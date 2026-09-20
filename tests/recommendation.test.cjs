/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/recommendation.ts'), 'utf8');
const api = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports: api, require: () => require('./load-ts.cjs')('src/lib/regions.ts') });
const places = [{ id: 'seoul', region: '서울특별시 종로구', type: '영화', spotName: '서울 장소' }, { id: 'busan', region: '부산광역시', type: '드라마', spotName: '부산 장소' }];
test('full administrative region names match short selection and no capital bonus', () => {
  const result = api.rankPlaces({ places, region: '서울', selectedTypes: new Set(['영화']) });
  assert.equal(result.length, 1); assert.equal(result[0].score, 65);
  assert.equal(result[0].reasons.includes('비수도권 로컬 우선'), false);
});
test('explicit choice survives other filters and noncapital gets bonus', () => {
  const result = api.rankPlaces({ places, region: '서울', selectedTypes: new Set(['영화']), selectedSpotId: 'busan' });
  assert.equal(result[0].place.id, 'busan'); assert.equal(result[0].score, 120);
});
test('no matching interest gives an empty result and region normalization is stable', () => {
  assert.equal(api.rankPlaces({ places, selectedTypes: new Set(['예능']) }).length, 0);
  assert.equal(api.normalizeRegion('경기도 수원시'), '경기');
  assert.equal(api.normalizeRegion('강원특별자치도 강릉시'), '강원');
});
