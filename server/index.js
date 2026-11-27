// BolkeSeekho server: serves the app and, if a key is configured, proxies AI tasks.
// Zero-config: `node server/index.js` (or `docker compose up`) works with no secrets.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { aiStatus, runTask, validateTask, InputError } from './ai.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PUBLIC_DIR = path.resolve(here, '..', 'public');
const VERSION = '1.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'microphone=(self), camera=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};

// ---------- tiny per-IP rate limiter for AI calls (protects a live demo key) ----------
const WINDOW_MS = 60_000;
const MAX_AI_CALLS = Number(process.env.AI_RATE_LIMIT_PER_MIN) || 20;
const hits = new Map();
function allowAiCall(ip, now = Date.now()) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_AI_CALLS) { hits.set(ip, recent); return false; }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(ip);
}, WINDOW_MS).unref();

// ---------- helpers ----------
function sendJson(res, status, body) {
  res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readJson(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error('Request body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(Object.assign(new Error('Body is not valid JSON'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

async function serveStatic(req, res, pathname) {
  let rel;
  try {
    rel = decodeURIComponent(pathname);
  } catch {
    return sendJson(res, 400, { ok: false, error: 'bad_path' });
  }
  if (rel.includes('\0')) return sendJson(res, 400, { ok: false, error: 'bad_path' });
  if (rel.endsWith('/')) rel += 'index.html';
  let file = path.resolve(PUBLIC_DIR, `.${path.posix.normalize(`/${rel}`)}`);
  if (file !== PUBLIC_DIR && !file.startsWith(PUBLIC_DIR + path.sep)) return sendJson(res, 403, { ok: false, error: 'forbidden' });

  let info = await stat(file).catch(() => null);
  if (!info || !info.isFile()) {
    if (path.extname(rel)) {
      res.writeHead(404, { ...SECURITY_HEADERS, 'Content-Type': MIME['.txt'] });
      return res.end('Not found');
    }
    file = path.join(PUBLIC_DIR, 'index.html'); // app routes fall back to the single page
    info = await stat(file);
  }
  const etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`;
  const headers = {
    ...SECURITY_HEADERS,
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
    ETag: etag,
  };
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, headers);
    return res.end();
  }
  const body = await readFile(file);
  res.writeHead(200, { ...headers, 'Content-Length': body.length });
  return res.end(req.method === 'HEAD' ? undefined : body);
}

async function handleAi(req, res) {
  const status = aiStatus();
  if (!status.enabled) {
    return sendJson(res, 503, { ok: false, error: 'key_not_set', message: 'AI key not set. Add ANTHROPIC_API_KEY to enable open questions and AI grading; everything else works offline.' });
  }
  const ip = req.socket.remoteAddress || 'unknown';
  if (!allowAiCall(ip)) return sendJson(res, 429, { ok: false, error: 'rate_limited', message: 'Too many AI requests; try again in a minute.' });

  let task;
  let input;
  try {
    ({ task, input } = validateTask(await readJson(req)));
  } catch (err) {
    if (err instanceof InputError) return sendJson(res, 400, { ok: false, error: 'bad_request', message: err.message });
    return sendJson(res, err.status || 400, { ok: false, error: 'bad_request', message: err.message });
  }
  const result = await runTask(task, input);
  if (!result.ok) {
    console.warn(`[ai] ${task} failed: ${result.error}${result.status ? ` (${result.status})` : ''}`);
    return sendJson(res, 502, { ok: false, error: result.error });
  }
  return sendJson(res, 200, { ok: true, task, model: result.model, data: result.data });
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const started = Date.now();
    const { pathname } = new URL(req.url, 'http://localhost');
    try {
      if (pathname === '/healthz') {
        res.writeHead(200, { 'Content-Type': MIME['.txt'], 'Cache-Control': 'no-store' });
        return res.end('ok');
      }
      if (pathname === '/api/config' && req.method === 'GET') {
        return sendJson(res, 200, { app: 'bolkeseekho', version: VERSION, ai: aiStatus() });
      }
      if (pathname === '/api/ai') {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
        await handleAi(req, res);
        console.log(`${req.method} ${pathname} ${res.statusCode} ${Date.now() - started}ms`);
        return undefined;
      }
      if (pathname.startsWith('/api/')) return sendJson(res, 404, { ok: false, error: 'not_found' });
      if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
      return await serveStatic(req, res, pathname);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) sendJson(res, 500, { ok: false, error: 'server_error' });
      else res.end();
      return undefined;
    }
  });
}

export function start({ port = Number(process.env.PORT) || 8080, host = process.env.HOST || '0.0.0.0' } = {}) {
  const server = createServer();
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') console.error(`Port ${port} is already in use. Stop the other app, or start with PORT=8090 (Docker: HOST_PORT=8090 docker compose up).`);
    else console.error(err);
    process.exit(1);
  });
  server.listen(port, host, () => {
    const ai = aiStatus();
    console.log(`BolkeSeekho is running on http://localhost:${port}`);
    console.log(ai.enabled ? `AI: on (${ai.model})` : 'AI: key not set. Running the offline engine (commands, explanations, glossary, rubric grading).');
  });
  const shutdown = () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) start();
