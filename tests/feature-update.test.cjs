/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load-ts.cjs');
const { paginate } = load('src/lib/pagination.ts');
const data = load('src/lib/travel-data.ts');
const m = load('src/lib/travel-mutations.ts');
const empty = () => ({ backup: m.emptyTravel(), recentViews: [], revision: 0 });
const trip = { id: 'trip-one', savedAt: '2026-09-19T00:00:00Z', days: 1, region: '서울', transport: '대중교통', companion: '친구', types: ['영화'], placeIds: ['a'] };
const tour = { contentId: '123', title: 'Tour', address: 'Seoul', latitude: 37, longitude: 127, contentTypeId: '12' };
test('pagination caps nine cards and nine links with valid empty and boundary pages', () => {
  const items = Array.from({ length: 100 }, (_, i) => i);
  assert.equal(paginate(items, '1').items.length, 9);
  assert.equal(paginate(items, '2').items[0], 9);
  assert.equal(paginate(items, '9').pages.length, 9);
  assert.equal(paginate(items, '10').pages[0], 10);
  assert.equal(paginate(items, '999').page, 12);
  assert.equal(paginate(items, '-1').page, 1);
  assert.equal(paginate([]).items.length, 0);
});
test('regions use the requested full ordered set without duplicated labels', () => {
  assert.equal(load('src/lib/regions.ts').REGIONS.join(' '), '강원 경기 경남 경북 광주 대구 대전 부산 서울 세종 울산 인천 전남 전북 제주 충남 충북');
});
test('legacy schedules and new title, people and visit times survive persistence', () => {
  let state = m.applyTravelMutation(empty(), { type: 'itinerary', itinerary: trip });
  state = m.applyTravelMutation(state, { type: 'itinerary', itinerary: { ...trip, title: '서울 여행', peopleCount: 3, placeTimes: [{ startTime: '09:00', endTime: '10:30' }] }, existing: true });
  const saved = data.parseTravelBackup(JSON.stringify(state.backup)).itineraries[0];
  assert.equal(saved.title, '서울 여행'); assert.equal(saved.peopleCount, 3); assert.equal(saved.placeTimes[0].endTime, '10:30');
  assert.equal(state.backup.itineraries.length, 1);
});
test('invalid people counts, reversed times and misaligned time arrays reject saves', () => {
  for (const changes of [{ peopleCount: 0 }, { peopleCount: 1.5 }, { peopleCount: 101 }, { title: 'x'.repeat(121) }, { placeTimes: [] }, { placeTimes: [{ startTime: '12:00', endTime: '11:00' }] }, { placeTimes: [{ startTime: '25:00', endTime: '26:00' }] }]) {
    assert.throws(() => m.applyTravelMutation(empty(), { type: 'itinerary', itinerary: { ...trip, ...changes } }));
  }
});
test('tour favorites deduplicate, reload and remove without affecting trips and native favorites', () => {
  let state = m.applyTravelMutation(empty(), { type: 'itinerary', itinerary: trip });
  state = m.applyTravelMutation(state, { type: 'spot', id: 'a', saved: true });
  for (let i = 0; i < 2; i++) state = m.applyTravelMutation(state, { type: 'tour-spot', place: tour, saved: true });
  assert.equal(data.parseTravelBackup(JSON.stringify(state.backup)).tourPlaces.length, 1);
  state = m.applyTravelMutation(state, { type: 'tour-spot', place: tour, saved: false });
  assert.equal(state.backup.tourPlaces.length, 0); assert.equal(state.backup.spots.length, 1); assert.equal(state.backup.itineraries.length, 1);
});
const suggestion = { id: 'd3cc5b7e-96db-409f-8f07-6f8b8bc660ca', title: '장소', category: '관광지', region: '서울', address: '서울 주소', description: '설명', reason: '방문 추천', relatedUrl: 'https://example.com' };
test('suggestions validate required fields and URL and discard supplied ownership', () => {
  const { parseSuggestion } = load('src/lib/content-suggestions.ts');
  assert.equal(parseSuggestion({ ...suggestion, uid: 'forged' }).uid, undefined);
  for (const changes of [{ title: '' }, { relatedUrl: 'javascript:alert(1)' }, { relatedUrl: 'https://user:pass@example.com' }, { category: 'unknown' }]) assert.throws(() => parseSuggestion({ ...suggestion, ...changes }));
});
test('suggestions accept a name alone and keep unknown details empty', () => {
  const { parseSuggestion } = load('src/lib/content-suggestions.ts');
  const minimal = { id: suggestion.id, title: '  아이브 안유진 콘텐츠  ' };
  const parsed = parseSuggestion(minimal);
  assert.equal(parsed.title, '아이브 안유진 콘텐츠');
  for (const field of ['category', 'region', 'address', 'description', 'reason', 'comments', 'relatedUrl']) {
    assert.equal(parsed[field], '');
    assert.equal(parseSuggestion({ ...minimal, [field]: '   ' })[field], '');
  }
  for (const title of ['', '   ', 'x'.repeat(121)]) assert.throws(() => parseSuggestion({ ...minimal, title }));
  for (const [field, max] of [['category', 30], ['region', 60], ['address', 240], ['description', 1000], ['reason', 1000], ['comments', 1000], ['relatedUrl', 1000]]) {
    assert.throws(() => parseSuggestion({ ...minimal, [field]: 'x'.repeat(max + 1) }));
  }
  assert.equal(parseSuggestion({ ...minimal, comments: '  더 많은 콘텐츠를 보고 싶어요  ' }).comments, '더 많은 콘텐츠를 보고 싶어요');
});
test('suggestion endpoint rejects guests, foreign origins and failures; retries are idempotent', async () => {
  let user = null, sameOrigin = true, fail = false, stored = null, writes = 0;
  const route = load('src/app/api/suggestions/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/firebase/user-session': { getUserIdentity: async () => user },
    '@/lib/account-validation': { isSameOrigin: () => sameOrigin, readAccountJson: request => request.json() },
    '@/lib/firebase/admin': { getFirebaseAdminDb: () => ({ collection: () => ({ doc: id => { assert.ok(id.startsWith('alice_')); return id; } }), runTransaction: async fn => { if (fail) throw new Error(); await fn({ get: async () => ({ exists: !!stored }), create: (_, value) => { stored = value; writes++; } }); } }) },
  });
  const request = (payload = suggestion) => new Request('https://example.com/api/suggestions', { method: 'POST', body: JSON.stringify(payload) });
  assert.equal((await route.POST(request())).status, 401);
  user = { uid: 'alice' }; sameOrigin = false; assert.equal((await route.POST(request())).status, 403);
  sameOrigin = true; fail = true; assert.equal((await route.POST(request())).status, 503);
  fail = false;
  assert.equal((await route.POST(request({ id: suggestion.id, title: '   ' }))).status, 400);
  assert.equal(writes, 0);
  const minimal = { id: suggestion.id, title: '아이브 안유진 콘텐츠' };
  assert.equal((await route.POST(request(minimal))).status, 200); assert.equal((await route.POST(request(minimal))).status, 200);
  assert.equal(writes, 1); assert.equal(stored.uid, 'alice'); assert.equal(stored.status, 'pending');
  assert.equal(stored.title, minimal.title); assert.equal(stored.address, ''); assert.equal(stored.reason, '');
});
