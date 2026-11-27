// Claude integration. Optional: with no ANTHROPIC_API_KEY the app runs fully offline and
// /api/ai answers 503 "key_not_set". The SDK is imported lazily, only when a key exists.
import { z } from 'zod';
import { answerPrompt, explainPrompt, gradePrompt } from './prompts.js';

export const DEFAULT_MODEL = 'claude-opus-5-5';
// Models that accept the server-side refusal fallback (`fallbacks: "default"`).
const SERVER_FALLBACK_MODELS = new Set(['claude-fable-5-2', 'claude-fable-5-1', 'claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5-5']);
const LANGS = new Set(['hinglish', 'hi', 'ta', 'bn', 'en']);
const NAV = ['answer', 'next', 'back', 'repeat', 'test', 'notes', 'read', 'explain', 'help', 'unclear'];

const AnswerSchema = z.object({ intent: z.enum(NAV), reply: z.string() });
const ExplainSchema = z.object({ reply: z.string() });
const GradeSchema = z.object({
  score: z.number(),
  right: z.array(z.string()),
  gap: z.string(),
  hint: z.string(),
  misconception: z.boolean(),
  notes: z.array(z.string()),
});

const TASKS = {
  answer: { schema: AnswerSchema, effort: 'low', prompt: answerPrompt },
  explain: { schema: ExplainSchema, effort: 'low', prompt: explainPrompt },
  grade: { schema: GradeSchema, effort: 'medium', prompt: gradePrompt },
};

export const modelName = (env = process.env) => (env.AI_MODEL || '').trim() || DEFAULT_MODEL;

export function aiStatus(env = process.env) {
  const hasKey = Boolean((env.ANTHROPIC_API_KEY || '').trim() || (env.ANTHROPIC_AUTH_TOKEN || '').trim());
  if (!hasKey) {
    return { enabled: false, reason: 'key_not_set', message: 'ANTHROPIC_API_KEY is not set, so BolkeSeekho runs its offline engine.' };
  }
  return { enabled: true, provider: 'anthropic', model: modelName(env) };
}

// ---------- input validation ----------
const LIMITS = { chapterTitle: 200, sectionTitle: 200, sectionText: 6000, question: 1000, transcript: 4000, item: 400, items: 40 };

function text(body, key, { required = false, max = LIMITS[key] } = {}) {
  const v = body[key];
  if (v == null || v === '') {
    if (required) throw new InputError(`${key} is required`);
    return '';
  }
  if (typeof v !== 'string') throw new InputError(`${key} must be a string`);
  if (v.length > max) throw new InputError(`${key} is too long (max ${max} characters)`);
  return v;
}

function list(body, key) {
  const v = body[key] ?? [];
  if (!Array.isArray(v)) throw new InputError(`${key} must be an array`);
  if (v.length > LIMITS.items) throw new InputError(`${key} has too many items`);
  return v.map((x) => {
    if (typeof x !== 'string' || x.length > LIMITS.item) throw new InputError(`${key} items must be short strings`);
    return x;
  });
}

export class InputError extends Error {}

export function validateTask(body) {
  if (!body || typeof body !== 'object') throw new InputError('JSON body required');
  const task = body.task;
  if (!Object.hasOwn(TASKS, task)) throw new InputError('task must be one of: answer, explain, grade');
  const base = {
    lang: LANGS.has(body.lang) ? body.lang : 'en',
    chapterTitle: text(body, 'chapterTitle'),
    sectionTitle: text(body, 'sectionTitle'),
    sectionText: text(body, 'sectionText', { required: task !== 'answer' }),
  };
  if (task === 'answer') return { task, input: { ...base, question: text(body, 'question', { required: true }) } };
  if (task === 'explain') return { task, input: { ...base, fresh: Boolean(body.fresh) } };
  return {
    task,
    input: {
      ...base,
      transcript: text(body, 'transcript', { required: true }),
      concepts: list(body, 'concepts'),
      confirmedTerms: list(body, 'confirmedTerms'),
      unsureTerms: list(body, 'unsureTerms'),
    },
  };
}

// ---------- model call ----------
let sdkPromise = null;
function loadSdk() {
  if (!sdkPromise) {
    sdkPromise = Promise.all([import('@anthropic-ai/sdk'), import('@anthropic-ai/sdk/helpers/beta/zod')])
      .then(([sdk, helpers]) => {
        const Anthropic = sdk.default;
        return { Anthropic, client: new Anthropic({ timeout: 45_000, maxRetries: 1 }), betaZodOutputFormat: helpers.betaZodOutputFormat };
      })
      .catch((err) => {
        sdkPromise = null;
        throw err;
      });
  }
  return sdkPromise;
}

/** Run one task. Never throws: returns { ok: true, data, model } or { ok: false, error }. */
export async function runTask(task, input, env = process.env) {
  const spec = TASKS[task];
  let sdk;
  try {
    sdk = await loadSdk();
  } catch {
    return { ok: false, error: 'sdk_unavailable' };
  }
  const { Anthropic, client, betaZodOutputFormat } = sdk;
  const model = modelName(env);
  const { system, user } = spec.prompt(input);
  const params = {
    model,
    max_tokens: 16000,
    system,
    messages: [{ role: 'user', content: user }],
    output_config: { effort: spec.effort, format: betaZodOutputFormat(spec.schema) },
  };
  if (SERVER_FALLBACK_MODELS.has(model)) {
    // If the model declines on policy grounds, the API retries on a fallback model in the same call.
    params.betas = ['server-side-fallback-2026-07-01'];
    params.fallbacks = 'default';
  }

  try {
    const response = await client.beta.messages.parse(params);
    if (response.stop_reason === 'refusal') return { ok: false, error: 'refused' };
    if (response.stop_reason === 'max_tokens' || !response.parsed_output) return { ok: false, error: 'bad_output' };
    return { ok: true, data: response.parsed_output, model: response.model };
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return { ok: false, error: 'bad_key' };
    if (err instanceof Anthropic.PermissionDeniedError) return { ok: false, error: 'forbidden' };
    if (err instanceof Anthropic.NotFoundError) return { ok: false, error: 'model_not_found' };
    if (err instanceof Anthropic.RateLimitError) return { ok: false, error: 'rate_limited' };
    if (err instanceof Anthropic.BadRequestError) return { ok: false, error: 'bad_request', detail: err.message };
    if (err instanceof Anthropic.APIConnectionError) return { ok: false, error: 'network' };
    if (err instanceof Anthropic.APIError) return { ok: false, error: 'ai_error', status: err.status };
    return { ok: false, error: 'bad_output' };
  }
}
