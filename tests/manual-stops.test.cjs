/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load-ts.cjs');
const { parseManualStops } = load('src/lib/manual-stops.ts');
const { applyTravelMutation, emptyTravel } = load('src/lib/travel-mutations.ts');
const stop = { id: 'manual-12345678-1234-4234-8234-123456789012', title: '직접 찾은 카페', address: '약속 장소 메모', day: 1, startTime: '13:00', endTime: '14:00' };
test('manual-only itinerary saves, reloads and edits without registered place IDs', () => {
  const trip = { id: 'trip', savedAt: new Date().toISOString(), days: 2, region: '서울', transport: '도보', companion: '친구', types: [], placeIds: [], manualStops: [stop] };
  let state = applyTravelMutation({ backup: emptyTravel(), recentViews: [], revision: 0 }, { type: 'itinerary', itinerary: trip });
  assert.equal(JSON.parse(JSON.stringify(state)).backup.itineraries[0].manualStops[0].title, stop.title);
  state = applyTravelMutation(state, { type: 'itinerary', existing: true, itinerary: { ...trip, manualStops: [{ ...stop, title: '수정한 장소', day: 0 }] } });
  assert.equal(state.backup.itineraries.length, 1);
  assert.equal(state.backup.itineraries[0].manualStops[0].day, 0);
});
test('manual places reject invalid names days times duplicates and excessive counts', () => {
  for (const patch of [{ title: ' ' }, { title: 'a'.repeat(121) }, { day: -1 }, { day: 2 }, { endTime: '12:00' }, { startTime: '99:00' }]) assert.throws(() => parseManualStops([{ ...stop, ...patch }], 2));
  assert.throws(() => parseManualStops([stop, stop], 2));
  assert.throws(() => parseManualStops(Array(101).fill(stop), 2));
  assert.equal(parseManualStops(undefined, 2).length, 0);
});
