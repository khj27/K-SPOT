/* eslint-disable @typescript-eslint/no-require-imports -- Node source test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/lib/i18n.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsObject });
const { translate } = exportsObject;
test('Korean remains unchanged and unknown registered content keeps its original spelling', () => {
  assert.equal(translate(' 로그인 ', 'ko'), ' 로그인 ');
  assert.equal(translate('화정떡갈비', 'en'), '화정떡갈비');
  assert.equal(translate('user@example.com', 'en'), 'user@example.com');
});
test('English covers account controls and preserves surrounding spacing', () => {
  assert.equal(translate(' 로그인 ', 'en'), ' Log in ');
  assert.equal(translate('선택 지우기', 'en'), 'Remove selected');
  assert.equal(translate('비밀번호 확인이 일치하지 않습니다.', 'en'), 'Passwords do not match.');
});
test('dynamic trip and accessibility text preserves numbers and place names', () => {
  assert.equal(translate('2박 3일', 'en'), '3 days / 2 nights');
  assert.equal(translate('부산 지역 일치', 'en'), 'Region match: Busan');
  assert.equal(translate('화정떡갈비 방문 날짜', 'en'), 'Visit date for 화정떡갈비');
  assert.equal(translate('검수 완료 · 2026-09-20', 'en'), 'Verified · 2026-09-20');
});
