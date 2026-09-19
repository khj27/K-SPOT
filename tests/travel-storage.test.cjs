/* eslint-disable @typescript-eslint/no-require-imports -- Node source test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, globals = {}) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports, TextEncoder, URL, setInterval, clearInterval, ...globals, require: (id) => load(id.replace('@/', 'src/') + '.ts', globals) });
  return exports;
}
const data = load('src/lib/travel-data.ts');
const mutations = load('src/lib/travel-mutations.ts');
const trip = { id: 'trip-one', savedAt: '2026-09-19T00:00:00Z', days: 2, region: '서울', transport: '대중교통', companion: '친구', types: ['영화'], placeIds: ['a', 'b'] };
function empty() { return { backup: mutations.emptyTravel(), recentViews: [], revision: 0 }; }
function setup(uid = 'alice') {
  let remote = empty(), fail = false;
  const requests = [];
  const globals = {
    document: { documentElement: { dataset: { userScope: uid } } },
    window: { get localStorage() { throw new Error('Local storage must not be used'); } },
    fetch: async (_url, options) => {
      requests.push(options);
      if (fail) return { ok: false, status: 503, json: async () => ({ message: 'unavailable' }) };
      if (options.method === 'PATCH') remote = mutations.applyTravelMutation(remote, JSON.parse(options.body).action);
      return { ok: true, status: 200, json: async () => ({ uid, ...remote }) };
    },
  };
  return { api: load('src/lib/travel-storage.ts', globals), requests, fail() { fail = true; }, fresh() { return load('src/lib/travel-storage.ts', globals); } };
}
test('bookmark changes persist to server and reload without any local storage', async () => {
  const app = setup();
  await app.api.setSpotSaved('attorney', true);
  assert.equal(app.api.getSavedSpotsSnapshot(), '["attorney"]');
  const reloaded = app.fresh(); await reloaded.refreshTravel();
  assert.equal(reloaded.getSavedSpotsSnapshot(), '["attorney"]');
  await reloaded.setSpotSaved('attorney', false);
  assert.equal(reloaded.getSavedSpotsSnapshot(), '[]');
});
test('guest writes require login, no network or local fallback', async () => {
  const app = setup('guest');
  await assert.rejects(app.api.setSpotSaved('a', true), /로그인/);
  assert.equal(app.requests.length, 0);
});
test('failed writes do not publish successful values and surface failure', async () => {
  const app = setup(); await app.api.setSpotSaved('a', true); app.fail();
  await assert.rejects(app.api.setSpotSaved('b', true), /unavailable/);
  assert.equal(app.api.getSavedSpotsSnapshot(), '["a"]');
  assert.equal(JSON.parse(app.api.getTravelStatus()).state, 'error');
});
test('itinerary save edit and deletion are written directly to server', async () => {
  const app = setup(); await app.api.storeItinerary(trip);
  await app.api.storeItinerary({ ...trip, placeIds: ['b', 'a'] }, true);
  assert.equal(JSON.parse(app.api.getItinerariesSnapshot())[0].placeIds[0], 'b');
  await app.api.removeSavedItinerary(trip.id);
  assert.equal(app.api.getItinerariesSnapshot(), '[]');
  await assert.rejects(app.api.storeItinerary(trip, true), /ITINERARY_REMOVED/);
});
test('independent mutations preserve other data, and repeated actions are idempotent', () => {
  let current = mutations.applyTravelMutation(empty(), { type: 'spot', id: 'a', saved: true });
  current = mutations.applyTravelMutation(current, { type: 'spot', id: 'b', saved: true });
  current = mutations.applyTravelMutation(current, { type: 'spot', id: 'a', saved: true });
  current = mutations.applyTravelMutation(current, { type: 'itinerary', itinerary: trip });
  assert.equal(current.backup.spots.length, 2);
  assert.equal(current.backup.itineraries.length, 1);
});
test('history is deduplicated capped at 50 and can be cleared', () => {
  let current = empty();
  for (let i = 0; i < 60; i++) current = mutations.applyTravelMutation(current, { type: 'view', id: `spot-${i}` });
  current = mutations.applyTravelMutation(current, { type: 'view', id: 'spot-30' });
  assert.equal(current.recentViews.length, 50);
  assert.equal(current.recentViews[0].spotId, 'spot-30');
  assert.equal(mutations.applyTravelMutation(current, { type: 'clear-views' }).recentViews.length, 0);
});
test('migration preserves existing server edits and invalid inputs are rejected', () => {
  const current = mutations.applyTravelMutation(empty(), { type: 'itinerary', itinerary: trip });
  const incoming = { ...mutations.emptyTravel(), itineraries: [{ ...trip, region: '부산' }], spots: ['new'] };
  const merged = mutations.applyTravelMutation(current, { type: 'import', backup: incoming });
  assert.equal(merged.backup.itineraries[0].region, '서울');
  assert.throws(() => mutations.applyTravelMutation(current, { type: 'spot', id: '../other', saved: true }));
  assert.throws(() => mutations.applyTravelMutation(current, { type: 'spot', id: 'a', saved: 'true' }));
  assert.throws(() => data.parseTravelBackup('{broken'));
});
