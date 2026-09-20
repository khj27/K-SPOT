/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
function check(env, origin, headers = {}) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/account-validation.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, process: { env }, URL });
  return exports.isSameOrigin(new Request('http://localhost:10000/api/account/session', { headers: { ...headers, ...(origin == null ? {} : { origin }) } }));
}
test('Render public HTTPS origin works behind an internal HTTP proxy', () => {
  assert.equal(check({ RENDER_EXTERNAL_URL: 'https://k-spot.onrender.com' }, 'https://k-spot.onrender.com'), true);
});
test('foreign, absent, null, and forged forwarded origins remain rejected', () => {
  const env = { RENDER_EXTERNAL_URL: 'https://k-spot.onrender.com' };
  for (const origin of [undefined, 'null', 'https://evil.test', 'http://localhost:10000', 'https://k-spot.onrender.com.evil.test']) {
    assert.equal(check(env, origin, { 'x-forwarded-host': 'evil.test', 'x-forwarded-proto': 'https' }), false);
  }
});
test('local and custom domain origins work, invalid configuration fails closed', () => {
  assert.equal(check({}, 'http://localhost:10000'), true);
  assert.equal(check({ APP_URL: 'https://example.com', RENDER_EXTERNAL_URL: 'https://k-spot.onrender.com' }, 'https://example.com'), true);
  assert.equal(check({ APP_URL: 'invalid' }, 'http://localhost:10000'), false);
});
