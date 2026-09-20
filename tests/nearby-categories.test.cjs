/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { tripNearbyCategory, TRIP_NEARBY_CATEGORIES } = require('./load-ts.cjs')('src/lib/place-categories.ts');
test('trip filters group existing TourAPI types without guessing unknown types', () => {
  assert.equal(tripNearbyCategory('32'), '숙소');
  assert.equal(tripNearbyCategory('39'), '식사');
  for (const id of ['12', '14', '15', '25', '28']) assert.equal(tripNearbyCategory(id), '놀거리');
  assert.equal(tripNearbyCategory('38'), '쇼핑');
  for (const id of ['', '999']) assert.equal(tripNearbyCategory(id), '기타');
  assert.equal(TRIP_NEARBY_CATEGORIES[0], '전체');
});
