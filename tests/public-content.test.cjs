/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function setup({ configured = true, fail = false } = {}) {
  const exports = {};
  const docs = [
    { id: 'registered', status: 'published', latitude: 35, longitude: 127 },
    { id: 'draft', status: 'draft', latitude: 35, longitude: 127 },
    { id: 'no-coordinate', status: 'published', latitude: null, longitude: null },
  ].map(({ id, ...data }) => ({ id, data: () => ({ ...data, contentType: '영화', contentTitle: '등록 작품' }) }));
  const overrides = {
    'server-only': {}, 'firebase-admin/firestore': { Timestamp: class {}, FieldValue: {} },
    '@/lib/firebase/admin': { isFirebaseAdminConfigured: () => configured, getFirebaseAdminDb: () => ({ collection: () => ({ limit: () => ({ get: async () => { if (fail) throw new Error(); return { docs }; } }) }) }) },
    '@/lib/content-thumbnail': { contentThumbnail: () => '' },
  };
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/content-repository.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports, require: (id) => { if (!(id in overrides)) throw new Error(`Unexpected dependency ${id}`); return overrides[id]; } });
  return exports;
}
test('public maps and recommendations receive only published registered coordinates', async () => {
  const items = await setup().getPublicExploreContents();
  assert.equal(items.length, 1); assert.equal(items[0].id, 'registered'); assert.equal(items[0].managed, true);
});
test('missing configuration or database outage never introduces demo places', async () => {
  assert.equal((await setup({ configured: false }).getPublicExploreContents()).length, 0);
  assert.equal((await setup({ fail: true }).getPublicExploreContents()).length, 0);
});
