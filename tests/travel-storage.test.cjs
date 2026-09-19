/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/travel-storage.ts'), 'utf8');
function setup(blocked = false, failWrite = 0, scope = "guest") {
  let writes = 0;
  const entries = new Map();
  const events = [];
  const exports = {};
  const document = { documentElement: { dataset: { userScope: scope } } };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
    exports, Event, TextEncoder, document, window: { localStorage: {
      getItem(key) { if (blocked) throw new Error('blocked'); return entries.get(key) ?? null; },
      setItem(key, value) { writes++; if (blocked || writes === failWrite) throw new Error('blocked'); entries.set(key, value); },
    }, dispatchEvent(event) { events.push(event.type); } },
  });
  return { api: exports, entries, events, document };
}
const trip = { id: 'trip-one', savedAt: '2026-09-18', days: 2, region: '서울', transport: '대중교통', companion: '친구', types: ['영화'], placeIds: ['research-place', 'reply-1988'] };
test('local data is separated between guest and each signed-in user', () => {
  const { api, document } = setup();
  api.storeItinerary(trip);
  document.documentElement.dataset.userScope = 'user-a';
  assert.equal(api.parseItineraries(api.getItinerariesSnapshot()).length, 0);
  api.storeItinerary({ ...trip, id: 'a-trip' });
  document.documentElement.dataset.userScope = 'user-b';
  assert.equal(api.parseItineraries(api.getItinerariesSnapshot()).length, 0);
  document.documentElement.dataset.userScope = 'user-a';
  assert.equal(api.createTravelBackup().itineraries[0].id, 'a-trip');
  document.documentElement.dataset.userScope = 'guest';
  assert.equal(api.createTravelBackup().itineraries[0].id, 'trip-one');
});
test('managed place IDs and their order survive saving and reload', () => {
  const { api } = setup();
  api.storeItinerary(trip);
  const restored = api.parseItineraries(api.getItinerariesSnapshot())[0];
  assert.equal(JSON.stringify(restored.placeIds), JSON.stringify(trip.placeIds));
});
test('editing the same itinerary replaces it and preserves other trips', () => {
  const { api, events } = setup();
  api.storeItinerary({ ...trip, id: 'another-trip' });
  api.storeItinerary(trip);
  api.storeItinerary({ ...trip, placeIds: ['reply-1988', 'research-place'] });
  api.storeItinerary({ ...trip, placeIds: ['research-place'] });
  const saved = api.parseItineraries(api.getItinerariesSnapshot());
  assert.equal(saved.length, 2);
  assert.equal(saved[0].placeIds.length, 1);
  assert.equal(saved[1].id, 'another-trip');
  assert.equal(events.at(-1), 'kspot:saved-itineraries-change');
});
test('malformed storage and invalid itinerary data do not crash reading', () => {
  const { api } = setup();
  assert.equal(api.parseItineraries('{broken').length, 0);
  assert.equal(api.parseItineraries(JSON.stringify([trip, null, { ...trip, days: 0 }, { ...trip, placeIds: ['same', 'same'] }])).length, 1);
  assert.equal(JSON.stringify(api.parseSavedSpotIds('["managed",null,"managed","demo",42]')), '["managed","demo"]');
});
test('blocked storage gives a readable error without publishing success events', () => {
  const { api, events } = setup(true);
  assert.equal(api.getItinerariesSnapshot(), '[]');
  assert.throws(() => api.storeItinerary(trip), /저장 공간/);
  assert.equal(events.length, 0);
});

const backup = { format: 'kspot-travel', version: 1, exportedAt: '2026-09-18T00:00:00Z', spots: ['managed-place'], itineraries: [trip] };
test('backup round trip includes only supported travel fields', () => {
  const { api } = setup();
  const parsed = api.parseTravelBackup(JSON.stringify({ ...backup, secret: 'excluded', itineraries: [{ ...trip, extra: 'excluded' }] }));
  assert.equal(parsed.secret, undefined);
  assert.equal(parsed.itineraries[0].extra, undefined);
  api.restoreTravelBackup(parsed);
  const exported = api.createTravelBackup();
  assert.equal(exported.spots[0], 'managed-place');
  assert.equal(exported.itineraries[0].id, trip.id);
});
test('restore preserves local edits and remains idempotent', () => {
  const { api } = setup();
  api.storeItinerary({ ...trip, region: '부산' });
  const first = api.restoreTravelBackup(backup);
  const second = api.restoreTravelBackup(backup);
  assert.equal(first.spots, 1);
  assert.equal(first.itineraries, 0);
  assert.equal(second.spots, 0);
  assert.equal(api.createTravelBackup().itineraries[0].region, '부산');
});
test('invalid backup versions, malformed records, duplicates and excessive size rejected', () => {
  const { api } = setup();
  assert.throws(() => api.parseTravelBackup('{broken'));
  for (const changed of [{ version: 2 }, { spots: ['x', 'x'] }, { itineraries: [null] }, { itineraries: [{ ...trip, days: 9 }] }, { exportedAt: 'invalid' }]) {
    assert.throws(() => api.parseTravelBackup(JSON.stringify({ ...backup, ...changed })));
  }
  assert.throws(() => api.parseTravelBackup(' '.repeat(2 * 1024 * 1024 + 1)));
});
test('second write failure restores previous data and reports failure', () => {
  const { api, entries } = setup(false, 2);
  entries.set(api.SAVED_SPOTS_KEY, '["existing"]');
  entries.set(api.SAVED_ITINERARIES_KEY, '[]');
  assert.throws(() => api.restoreTravelBackup(backup), /기존 데이터는 유지/);
  assert.equal(entries.get(api.SAVED_SPOTS_KEY), '["existing"]');
  assert.equal(entries.get(api.SAVED_ITINERARIES_KEY), '[]');
});
test('blocked or corrupted local storage cannot produce an empty successful backup', () => {
  assert.throws(() => setup(true).api.createTravelBackup(), /읽지 못/);
  const { api, entries } = setup();
  entries.set(api.SAVED_SPOTS_KEY, '{broken');
  assert.throws(() => api.createTravelBackup());
  assert.throws(() => api.restoreTravelBackup(backup));
  assert.equal(entries.get(api.SAVED_SPOTS_KEY), '{broken');
});
