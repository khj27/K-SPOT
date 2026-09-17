/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test harness compiles the source modules without a build. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) {
  const filename = path.resolve(__dirname, '..', file);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, TextEncoder, URL, require: (id) => load(id.replace('@/', 'src/') + '.ts') }, { filename });
  return exports;
}
const { CSV_COLUMNS, inspectContentCsv, csvTemplate, readResearchCsv, serializeContentCsv } = load('src/lib/content-csv.ts');
const sample = { slug: 'csv-test', contentTitle: '테스트', contentType: '드라마', episode: '1화', description: '촬영 장소', spotName: '장소', region: '서울', address: '서울시', latitude: '37.5', longitude: '127', sourceUrl: 'https://example.com', sourceLabel: '출처', verifiedAt: '2026-09-18', imageRights: '직접 촬영', status: 'published' };
const row = (changes = {}) => CSV_COLUMNS.map((key) => '"' + String(({ ...sample, ...changes })[key] ?? '').replaceAll('"', '""') + '"').join(',');
const inspect = (changes) => inspectContentCsv(csvTemplate() + row(changes))[0];
test('BOM template and valid data always produce draft', () => {
  assert.equal(inspect().errors.length, 0);
  assert.equal(inspect().data.status, 'draft');
});
test('quoted commas, escaped quotes and embedded newlines survive parsing', () => {
  const title = '서울, "촬영지"\n두 번째 줄';
  assert.equal(inspect({ contentTitle: title }).data.contentTitle, title);
});
test('blank coordinates rejected, zero accepted', () => {
  assert.ok(inspect({ latitude: '' }).errors.length);
  assert.ok(inspect({ longitude: ' ' }).errors.length);
  assert.equal(inspect({ latitude: '0', longitude: '0' }).data.latitude, 0);
});
test('invalid calendar dates rejected and leap day accepted', () => {
  assert.ok(inspect({ verifiedAt: '2026-02-30' }).errors.length);
  assert.equal(inspect({ verifiedAt: '2024-02-29' }).errors.length, 0);
});
test('duplicate slugs reject every duplicate ignoring case', () => {
  const rows = inspectContentCsv(csvTemplate() + row() + '\r\n' + row({ slug: 'CSV-TEST' }));
  assert.ok(rows.every((item) => item.errors.length && !item.data));
});
test('bad headers, malformed quotes, missing columns and limits rejected', () => {
  assert.throws(() => inspectContentCsv('slug\nhello'));
  assert.throws(() => inspectContentCsv(csvTemplate() + '"unfinished'));
  assert.ok(inspectContentCsv(csvTemplate() + 'one,two')[0].errors.length);
  assert.throws(() => inspectContentCsv(csvTemplate()));
  assert.throws(() => inspectContentCsv(csvTemplate() + Array(101).fill(row()).join('\n')));
  assert.throws(() => inspectContentCsv('x'.repeat(512 * 1024 + 1)));
});

test('actual Parasite research sheet maps to one editable place without invented facts', () => {
  const csv = fs.readFileSync(path.join(__dirname, 'fixtures/parasite-research.csv'), 'utf8');
  const input = readResearchCsv(csv);
  assert.equal(input.contentTitle, '기생충');
  assert.equal(input.spotName, '자하문터널 계단');
  assert.equal(input.releaseYear, '2019');
  assert.equal(input.region, '서울특별시 종로구');
  assert.equal(input.latitude, '');
  assert.equal(input.longitude, '');
  assert.equal(input.verifiedAt, '');
  assert.equal(input.imageRights, '');
  assert.equal(input.imageUrl, '');
  assert.match(input.description, /https:\/\/love.seoul.go.kr\/articles\/7297/);
  assert.match(input.description, /기생충 1시간 32분~33분/);
  assert.match(input.description, /검색 태그:/);
  assert.match(input.sourceUrl, /Q38h5XD4RKE/);
  assert.equal(input.slug, readResearchCsv(csv).slug);
  const missing = inspectContentCsv(serializeContentCsv(input));
  assert.equal(missing.length, 1);
  assert.equal(missing[0].errors.length, 4);
  const completed = inspectContentCsv(serializeContentCsv({ ...input, latitude: '37.5', longitude: '127', verifiedAt: '2026-09-18', imageRights: '테스트용 권리 기록' }));
  assert.equal(completed[0].errors.length, 0);
  assert.equal(completed[0].data.status, 'draft');
});

test('research format accepts actual-value header and preserves unknown fields', () => {
  const csv = '번호,조사 항목,설명,작성 내용\n1,장소명,,장소\n2,미디어 제목,,작품\n3,추가 조사,,메모';
  assert.match(readResearchCsv(csv).description, /추가 조사: 메모/);
  assert.equal(readResearchCsv(csvTemplate() + row()), null);
  assert.throws(() => readResearchCsv(csv + '\n4,장소명,,다른 장소'));
  assert.throws(() => readResearchCsv('조사 항목,설명\n장소명,설명'));
  assert.throws(() => readResearchCsv(csv + '\n4,정보 출처'));
});
