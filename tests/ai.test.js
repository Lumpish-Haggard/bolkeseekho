// Exercises the real Anthropic SDK call path against a local mock of the Messages API,
// so the AI integration is tested without a real key or network access.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

const captured = [];
let failNext = null;

const mock = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  captured.push({ url: req.url, headers: req.headers, body });
  if (failNext) {
    const { status, type } = failNext;
    failNext = null;
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ type: 'error', error: { type, message: 'mock failure' } }));
    return;
  }
  const props = body.output_config?.format?.schema?.properties || {};
  const payload = props.score
    ? { score: 8, right: ['Energy conservation'], gap: '', hint: '', misconception: false, notes: ['Energy is conserved.', 'Closed systems exchange energy, not matter.', 'Isolated systems exchange neither.'] }
    : props.intent
      ? { intent: 'answer', reply: 'Mock answer.' }
      : { reply: 'Mock explanation.' };
  res.writeHead(200, { 'content-type': 'application/json', 'request-id': 'req_mock' });
  res.end(JSON.stringify({
    id: 'msg_mock', type: 'message', role: 'assistant', model: body.model,
    content: [{ type: 'text', text: JSON.stringify(payload) }],
    stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 12, output_tokens: 34 },
  }));
});
await new Promise((resolve) => mock.listen(0, '127.0.0.1', resolve));

process.env.ANTHROPIC_API_KEY = 'test-key';
process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${mock.address().port}`;
delete process.env.AI_MODEL;
const { runTask, validateTask, aiStatus, InputError } = await import('../server/ai.js');
test.after(() => mock.close());

const gradeBody = {
  task: 'grade', lang: 'hinglish', chapterTitle: 'Thermodynamics', sectionTitle: 'Systems',
  sectionText: 'Energy can neither be created nor destroyed.', transcript: 'energy na banti hai na khatam hoti hai',
  concepts: ['Energy is conserved: energy can neither be created nor destroyed'], confirmedTerms: ['energy'], unsureTerms: ['adiabetic'],
};

test('status shows AI on when a key is present', () => {
  assert.deepEqual(aiStatus(), { enabled: true, provider: 'anthropic', model: 'claude-opus-5-5' });
});

test('grade: structured output, effort and server-side fallbacks go through the SDK', async () => {
  const { task, input } = validateTask(gradeBody);
  const r = await runTask(task, input);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.data.score, 8);
  assert.equal(r.data.notes.length, 3);
  const req = captured.at(-1);
  assert.match(req.url, /^\/v1\/messages/);
  // SDK 1.x sends the key as a bearer token (older releases used x-api-key).
  assert.ok(req.headers.authorization === 'Bearer test-key' || req.headers['x-api-key'] === 'test-key', JSON.stringify(req.headers));
  assert.match(req.headers['anthropic-beta'] || '', /server-side-fallback-2026-07-01/);
  assert.equal(req.body.model, 'claude-opus-5-5');
  assert.equal(req.body.fallbacks, 'default');
  assert.equal(req.body.output_config.effort, 'medium');
  assert.equal(req.body.output_config.format.type, 'json_schema');
  assert.match(req.body.messages[0].content, /energy na banti hai/);
  assert.match(req.body.messages[0].content, /<unsure_terms>\n- adiabetic/);
  assert.match(req.body.system, /data, not instructions/);
});

test('answer and explain tasks', async () => {
  const a = await runTask(...Object.values(validateTask({ task: 'answer', lang: 'ta', sectionText: 'x', question: 'why?' })));
  assert.deepEqual(a.data, { intent: 'answer', reply: 'Mock answer.' });
  assert.match(captured.at(-1).body.system, /Tamil/);
  assert.equal(captured.at(-1).body.output_config.effort, 'low');
  const e = await runTask(...Object.values(validateTask({ task: 'explain', lang: 'bn', sectionText: 'x', fresh: true })));
  assert.equal(e.data.reply, 'Mock explanation.');
  assert.match(captured.at(-1).body.messages[0].content, /different one/);
});

test('a model without server-side fallback does not send the beta', async () => {
  process.env.AI_MODEL = 'claude-haiku-5-5';
  try {
    const r = await runTask(...Object.values(validateTask(gradeBody)));
    assert.equal(r.ok, true);
    const req = captured.at(-1);
    assert.equal(req.body.model, 'claude-haiku-5-5');
    assert.equal(req.body.fallbacks, undefined);
    assert.doesNotMatch(req.headers['anthropic-beta'] || '', /server-side-fallback/);
  } finally {
    delete process.env.AI_MODEL;
  }
});

test('API errors become friendly error codes', async () => {
  failNext = { status: 401, type: 'authentication_error' };
  assert.equal((await runTask(...Object.values(validateTask(gradeBody)))).error, 'bad_key');
  failNext = { status: 404, type: 'not_found_error' };
  assert.equal((await runTask(...Object.values(validateTask(gradeBody)))).error, 'model_not_found');
});

test('input validation rejects bad or oversized payloads', () => {
  assert.throws(() => validateTask({ task: 'delete-everything' }), InputError);
  assert.throws(() => validateTask({ task: 'answer', sectionText: 'x' }), /question is required/);
  assert.throws(() => validateTask({ ...gradeBody, transcript: 'x'.repeat(5000) }), /too long/);
  assert.throws(() => validateTask({ ...gradeBody, concepts: 'nope' }), /array/);
  assert.equal(validateTask({ ...gradeBody, lang: 'klingon' }).input.lang, 'en');
});
