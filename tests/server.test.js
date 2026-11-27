// The server must start and serve the main screen with no secret keys at all.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

delete process.env.ANTHROPIC_API_KEY;
delete process.env.ANTHROPIC_AUTH_TOKEN;
const { createServer } = await import('../server/index.js');

let server;
let base;
test.before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

const rawGet = (path) => new Promise((resolve, reject) => {
  const { port } = server.address();
  http.get({ host: '127.0.0.1', port, path }, (res) => {
    let body = '';
    res.on('data', (c) => { body += c; });
    res.on('end', () => resolve({ status: res.statusCode, body }));
  }).on('error', reject);
});

test('serves the main screen without any keys', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  assert.match(res.headers.get('content-security-policy'), /default-src 'self'/);
  const html = await res.text();
  assert.match(html, /BolkeSeekho/);
  assert.match(html, /id="voiceInput"/);
});

test('serves ES modules and the stylesheet with the right types', async () => {
  for (const [p, type] of [['/js/app.js', /javascript/], ['/js/engine/content.js', /javascript/], ['/styles.css', /text\/css/], ['/manifest.webmanifest', /manifest\+json/]]) {
    const res = await fetch(base + p);
    assert.equal(res.status, 200, p);
    assert.match(res.headers.get('content-type'), type, p);
  }
});

test('ETag revalidation returns 304', async () => {
  const first = await fetch(`${base}/styles.css`);
  const etag = first.headers.get('etag');
  assert.ok(etag);
  const again = await fetch(`${base}/styles.css`, { headers: { 'if-none-match': etag } });
  assert.equal(again.status, 304);
});

test('config reports that the AI key is not set', async () => {
  const body = await (await fetch(`${base}/api/config`)).json();
  assert.equal(body.app, 'bolkeseekho');
  assert.equal(body.ai.enabled, false);
  assert.equal(body.ai.reason, 'key_not_set');
});

test('AI endpoint answers "key not set" instead of failing', async () => {
  const res = await fetch(`${base}/api/ai`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ task: 'answer', question: 'hi' }) });
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.error, 'key_not_set');
  assert.match(body.message, /key not set/i);
});

test('app routes fall back to index.html; missing assets are 404', async () => {
  assert.equal((await fetch(`${base}/study/thermo`)).status, 200);
  assert.equal((await fetch(`${base}/missing.js`)).status, 404);
  assert.equal((await fetch(`${base}/api/nope`)).status, 404);
});

test('path traversal cannot escape public/', async () => {
  for (const p of ['/../package.json', '/..%2fpackage.json', '/%2e%2e/%2e%2e/server/ai.js', '/js/..%2f..%2fserver%2fai.js']) {
    const res = await rawGet(p);
    assert.notEqual(res.status, 200, p);
    assert.doesNotMatch(res.body, /"name": "bolkeseekho"|ANTHROPIC/, p);
  }
});

test('health check', async () => {
  const res = await fetch(`${base}/healthz`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'ok');
});
