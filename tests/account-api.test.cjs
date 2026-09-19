/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS test harness loads actual route handlers with isolated auth/storage. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function setup() {
  let identity = null;
  const docs = new Map();
  const paths = [];
  const snap = (id) => ({ data: () => docs.get(id) });
  const db = { collection(name) { return { doc(id) { paths.push(`${name}/${id}`); return { id, get: async () => snap(id) }; } }; }, async runTransaction(fn) { return fn({ get: async (ref) => snap(ref.id), set: (ref, value) => docs.set(ref.id, value) }); } };
  const overrides = { 'next/server': { NextResponse: { json: (value, init) => Response.json(value, init) } }, '@/lib/firebase/user-session': { getUserIdentity: async () => identity }, '@/lib/firebase/admin': { getFirebaseAdminDb: () => db } };
  function load(file) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports, Request, Response, TextEncoder, TextDecoder, URL, require: (id) => overrides[id] ?? load(id.replace('@/', 'src/') + '.ts') });
    return exports;
  }
  return { route: load('src/app/api/account/travel/route.ts'), setIdentity(value) { identity = value; }, docs, paths };
}
const backup = { format: 'kspot-travel', version: 1, exportedAt: '2026-09-19T00:00:00Z', spots: ['test-spot'], itineraries: [] };
function request(uid = 'alice', revision = 0, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/account/travel', { method: 'PUT', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ uid, revision, backup }) });
}
test('unauthenticated reads and writes fail before Firestore access', async () => {
  const app = setup();
  assert.equal((await app.route.GET()).status, 401);
  assert.equal((await app.route.PUT(request())).status, 401);
  assert.equal(app.paths.length, 0);
});
test('foreign origins and forged owner IDs cannot write', async () => {
  const app = setup(); app.setIdentity({ uid: 'alice' });
  assert.equal((await app.route.PUT(request('alice', 0, 'https://example.org'))).status, 403);
  assert.equal((await app.route.PUT(request('bob'))).status, 409);
  assert.equal(app.docs.size, 0);
});
test('reads and writes are always scoped to authenticated UID', async () => {
  const app = setup(); app.setIdentity({ uid: 'alice' });
  assert.equal((await app.route.PUT(request())).status, 200);
  assert.equal(app.docs.get('alice').revision, 1);
  const result = await app.route.GET();
  assert.equal(result.headers.get('cache-control'), 'private, no-store');
  assert.equal((await result.json()).backup.spots[0], 'test-spot');
  app.setIdentity({ uid: 'bob' });
  assert.equal((await (await app.route.GET()).json()).backup, null);
});
test('stale revision cannot overwrite newer cloud data', async () => {
  const app = setup(); app.setIdentity({ uid: 'alice' });
  await app.route.PUT(request());
  assert.equal((await app.route.PUT(request())).status, 409);
  assert.equal(app.docs.get('alice').revision, 1);
  assert.equal((await app.route.PUT(request('alice', 1))).status, 200);
});
test('oversized body is rejected without a write', async () => {
  const app = setup(); app.setIdentity({ uid: 'alice' });
  const req = new Request('http://localhost:3000/api/account/travel', { method: 'PUT', headers: { origin: 'http://localhost:3000' }, body: 'x'.repeat(450001) });
  assert.equal((await app.route.PUT(req)).status, 400);
  assert.equal(app.docs.size, 0);
});
