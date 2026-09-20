# K-SPOT 기능 개선 결과 — 2026-09-20

## 1. 수정한 파일

기존 Next.js App Router·Firebase Admin 서버 세션·Firestore 사용자 문서·Kakao SDK·TourAPI 구조를 유지했습니다. Vite/React Router로 교체하거나 패키지를 추가하지 않았습니다.

| 파일 | 수정 이유 |
| --- | --- |
| `src/app/api/account/session/route.ts` | 서버 세션 기반 초기 로그인과 화면 이동 상태 통합 |
| `src/app/explore/page.tsx` | 9개 콘텐츠·최대 9개 페이지 번호와 필터 |
| `src/app/layout.tsx` | 서버 세션 기반 초기 로그인과 화면 이동 상태 통합 |
| `src/app/map/page.tsx` | 유형 필터, 지도 재사용 및 일정 순번 마커 |
| `src/app/mypage/page.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/app/page.tsx` | 홈 소개 및 기능 진입점 연결 |
| `src/app/planner/page.tsx` | 일정 제목·인원·시간·지도·순서·삭제 확인 |
| `src/app/planner/result/page.tsx` | 일정 제목·인원·시간·지도·순서·삭제 확인 |
| `src/app/recommend/page.tsx` | 공통 지역 목록과 추천 필터 |
| `src/app/saved/page.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/app/ui-polish.css` | 반응형 공통 폼·필터·목록 스타일 |
| `src/components/account/account-panel.tsx` | 홈 소개 및 기능 진입점 연결 |
| `src/components/account/user-login-form.tsx` | 서버 세션 기반 초기 로그인과 화면 이동 상태 통합 |
| `src/components/admin/admin-content-form.tsx` | 장소 분류 필드와 기존 자료 기본값 |
| `src/components/admin/admin-navigation.tsx` | 여행 일정 관리 메뉴와 제보 메뉴 |
| `src/components/common/locale-provider.tsx` | 새 문구 영어 번역 및 언어 전환 개선 |
| `src/components/layout/top-search.tsx` | 서버 세션 기반 초기 로그인과 화면 이동 상태 통합 |
| `src/components/map/kakao-map.tsx` | 유형 필터, 지도 재사용 및 일정 순번 마커 |
| `src/components/map/map-explorer.tsx` | 9개 콘텐츠·최대 9개 페이지 번호와 필터 |
| `src/components/planner/itinerary-tour-stops.tsx` | 일정 제목·인원·시간·지도·순서·삭제 확인 |
| `src/components/planner/planner-itinerary-editor.tsx` | 일정 제목·인원·시간·지도·순서·삭제 확인 |
| `src/components/saved/saved-itineraries-list.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/components/saved/saved-spots-list.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/components/saved/travel-dashboard.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/components/spots/nearby-tourism.tsx` | 주변 관광지 내부 상세와 공통 찜 연결 |
| `src/components/spots/spot-actions.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/lib/admin-content-validation.ts` | 장소 분류 필드와 기존 자료 기본값 |
| `src/lib/content-repository.ts` | 장소 분류 필드와 기존 자료 기본값 |
| `src/lib/i18n.ts` | 새 문구 영어 번역 및 언어 전환 개선 |
| `src/lib/navigation.ts` | 여행 일정 관리 메뉴와 제보 메뉴 |
| `src/lib/recommendation.ts` | 공통 지역 목록과 추천 필터 |
| `src/lib/travel-data.ts` | 계정별 Firebase 상태와 호환 가능한 저장 스키마 |
| `src/lib/travel-mutations.ts` | 계정별 Firebase 상태와 호환 가능한 저장 스키마 |
| `src/lib/travel-storage.ts` | 계정별 Firebase 상태와 호환 가능한 저장 스키마 |
| `src/types/admin-content.ts` | 장소 분류 필드와 기존 자료 기본값 |
| `src/types/content.ts` | 장소 분류 필드와 기존 자료 기본값 |
| `src/types/map.ts` | 유형 필터, 지도 재사용 및 일정 순번 마커 |
| `tests/public-content.test.cjs` | 회귀 검증 및 새 입력·저장 규칙 테스트 |
| `tests/recommendation.test.cjs` | 회귀 검증 및 새 입력·저장 규칙 테스트 |

## 2. 새로 추가한 파일

| 파일 | 역할 |
| --- | --- |
| `src/app/admin/suggestions/page.tsx` | 로그인 사용자 제보 접수 및 관리자 조회 |
| `src/app/api/suggestions/route.ts` | 로그인 사용자 제보 접수 및 관리자 조회 |
| `src/app/suggest/page.tsx` | 로그인 사용자 제보 접수 및 관리자 조회 |
| `src/app/tour-spots/[id]/page.tsx` | 주변 관광지 내부 상세와 공통 찜 연결 |
| `src/components/account/auth-provider.tsx` | 서버 세션 기반 초기 로그인과 화면 이동 상태 통합 |
| `src/components/account/content-suggestion-form.tsx` | 로그인 사용자 제보 접수 및 관리자 조회 |
| `src/components/account/travel-snapshot-provider.tsx` | 계정별 Firebase 상태와 호환 가능한 저장 스키마 |
| `src/components/common/confirm-dialog.tsx` | 일정 제목·인원·시간·지도·순서·삭제 확인 |
| `src/components/common/pagination.tsx` | 9개 콘텐츠·최대 9개 페이지 번호와 필터 |
| `src/components/planner/itinerary-map.tsx` | 일정 제목·인원·시간·지도·순서·삭제 확인 |
| `src/components/planner/visit-time-fields.tsx` | 일정 제목·인원·시간·지도·순서·삭제 확인 |
| `src/components/saved/saved-tour-places.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/components/spots/tour-bookmark-button.tsx` | 마이페이지 찜 통합과 여행 일정 관리 분리 |
| `src/lib/content-suggestions.ts` | 로그인 사용자 제보 접수 및 관리자 조회 |
| `src/lib/pagination.ts` | 9개 콘텐츠·최대 9개 페이지 번호와 필터 |
| `src/lib/place-categories.ts` | 장소 분류 필드와 기존 자료 기본값 |
| `src/lib/regions.ts` | 공통 지역 목록과 추천 필터 |
| `tests/feature-update.test.cjs` | 회귀 검증 및 새 입력·저장 규칙 테스트 |
| `tests/load-ts.cjs` | 회귀 검증 및 새 입력·저장 규칙 테스트 |

## 3. 구현 완료 기능

- 로그인 사용자 콘텐츠 제보 및 관리자 전용 접수 목록.
- 일정 삭제 전 취소/삭제 확인 창.
- 여행 일정 관리와 마이페이지 찜 관리 분리.
- 로그인 상태의 공통 관리와 초기 서버 저장자료 표시.
- 홈 소개, 지도 콘텐츠/장소 분류 필터.
- 일정 제목·인원·장소별 시작/종료 시간 편집, 추가/제외/순서 조정, 선택 일정만 보이는 번호 지도.
- 주변 관광지 내부 상세·공통 찜 및 기본 접힘.
- 콘텐츠 검색 9개씩, 페이지 번호 최대 9개씩 구간 이동, 공통 17개 지역 가나다순.
- 새 일정 저장 성공 후 여행 일정 관리 이동. 실패 시 편집 화면 유지.

## 4. 로그인 관련 변경사항

초기 서버 세션을 AuthProvider에 전달해 로그인 여부를 먼저 거짓으로 표시하지 않습니다. 로그인 완료 후 공통 사용자 상태를 갱신하고 Next router로 이동합니다. 로그아웃은 세션 삭제 후 계정별 메모리 상태를 비웁니다. 헤더는 로그인한 경우 로그아웃 버튼과 초록색 프로필을 표시합니다. 내부 검색 폼은 next/form, 주요 이동은 Link/router로 유지합니다. 언어 변경도 전체 문서 새로고침 대신 router.refresh를 사용합니다.

## 5. 여행 일정 관련 변경사항

제목(최대 120자), 인원(1~100 정수), 날짜 표시, 장소별 시간 입력을 제공합니다. 시작/종료 시간은 둘 다 비워 두거나 종료가 시작보다 늦어야 저장됩니다. 촬영지와 연결 관광지 순서를 버튼으로 조정합니다. 지도는 현재 편집 일정의 장소만 날짜·방문 순서대로 표시합니다. 주변 관광지 조회 영역은 기본 접힘입니다.

편집 후 '일정 저장'으로 Firebase에 반영합니다. 저장 완료 전에 성공 문구나 페이지 이동이 발생하지 않습니다. 새 일정은 /saved로 이동하고, 기존 일정은 같은 ID를 갱신합니다. 삭제는 확인 창에서 삭제를 선택해야 실행됩니다. API 실패는 오류를 표시합니다.

## 6. 찜 기능 변경사항

기존 콘텐츠 찜은 기존 ID를 유지합니다. 주변 관광지는 TourAPI contentId와 표시 정보를 저장하며 동일 ID는 중복 저장되지 않습니다. 모든 찜은 동일한 UID 소유의 Firestore userTravel 문서를 통해 관리합니다. 마이페이지에서 둘 다 조회/해제할 수 있습니다. 주변 장소 클릭은 /tour-spots/[id] 내부 상세로 연결됩니다.

## 7. 관광 콘텐츠 관련 변경사항

홈/지도는 관리자 공개 자료만 표시하며, 콘텐츠 유형과 장소 분류를 조합해 즉시 필터링합니다. SDK 지도 인스턴스는 필터마다 새로 만들지 않습니다. 기존에 장소 분류가 없는 자료는 '기타'로 표시합니다.

/explore는 페이지당 최대 9개, 데스크톱 3열·태블릿 2열·모바일 1열입니다. 페이지 번호는 최대 9개이며 이전/다음은 번호 구간을 이동합니다. 검색·유형·지역 변경은 첫 페이지로 돌아갑니다.

지역 공통 목록: 강원 경기 경남 경북 광주 대구 대전 부산 서울 세종 울산 인천 전남 전북 제주 충남 충북. 기존 TourAPI는 좌표 기반 조회이므로 areaCode를 새로 만들거나 변경하지 않았습니다.

## 8. 데이터 구조 변경사항

- SavedItinerary: 선택 필드 title, peopleCount, placeTimes 추가.
- SavedTourStop: 선택 필드 startTime/endTime 추가.
- TravelBackup: 선택 필드 tourPlaces 추가. format/version은 기존 v1 유지.
- 관리자 콘텐츠: 선택 필드 placeCategory, 미지정 기본값 기타.
- 신규 contentSuggestions 컬렉션: 서버에서 uid/status=pending/createdAt을 부여합니다. 사용자 UID와 요청 UUID 조합으로 재시도 중복을 막습니다. 자동 공개되지 않습니다.

기존 일정·찜 문서를 일괄 수정하지 않습니다. 옛 일정은 기본 제목·1명·시간 미지정으로 열 수 있습니다. 로컬 저장은 추가하지 않았으며 기존 브라우저 자료 가져오기는 읽기 전용 이전 기능으로 유지합니다.

## 9. 테스트 결과

| 시나리오 | 결과와 검증 범위 |
| --- | --- |
| 기존+신규 자동 테스트 | 49개 통과, 0개 실패 |
| 미인증/다른 출처/소유권 위조 차단 | API 모의 테스트 통과 |
| 제보 검증·실패·재시도 중복 방지 | API 모의 테스트 통과, 실제 제보는 생성하지 않음 |
| 일정 제목·인원·시간 저장 및 옛 일정 호환 | 데이터/저장 테스트 통과 |
| 0명·소수 인원·잘못된 시간 차단 | 자동 테스트 통과, 브라우저에서 0명 저장 차단 확인 |
| 관광지 찜 중복·제거·다른 기록 보존 | 자동 테스트 통과 |
| 실제 로그인 초기/페이지 이동/새로고침 | 로컬 기존 로그인 세션으로 로그아웃 버튼·프로필 유지 확인 |
| 일정 조회/삭제 취소 | 실제 기존 일정 조회 및 모달 취소 후 유지 확인. 실제 사용자 일정 삭제는 하지 않음 |
| 지도 필터 | 실제 로컬 지도에서 전체32→영화6 및 빈 분류0 확인 |
| 일정 지도·접힘 | 기존 일정의 촬영지3+주변4만 목록 표시, 관광지 영역 기본 접힘 확인 |
| 주변 관광지 내부 상세 | 실제 TourAPI 고현성 사진/주소/설명/찜 버튼 및 내부 URL 확인 |
| 페이지 목록/필터 초기화 | 9개·2페이지 다른 목록·영화 필터 첫 페이지 확인 |
| 반응형 | 실제 CSS 너비312px 1열·880px 2열·기본 데스크톱3열, 모두9개·가로 넘침 없음 |
| 브라우저 오류 | 확인 화면에서 런타임/React key 오류 없음. 개발 중 코드 수정에 따른 Fast Refresh 재로딩 경고1회 |
| ESLint | 오류·경고 없음 |

## 10. 빌드 결과

```text
npm run build
결과: 성공 (exit 0)
Compiled successfully
TypeScript 완료
23/23 static page generation 완료
```

저장소 바깥 상위 폴더 package-lock.json을 Next.js가 무시한다는 경고가 있습니다. 빌드 오류는 아닙니다. 해당 외부 파일은 변경하지 않았습니다.

## 11. 추가 확인이 필요한 사항

- 관리자 콘텐츠 편집에서 장소 분류를 지정하세요. 기존 32개 자료에 임의 분류를 쓰지 않았으므로 음식점/숙박 등은 분류 입력 전 비어 있을 수 있습니다.
- 기존 입력 중 '전남광주', '전남 전주시', '경상남도 경주시'처럼 혼합·오표기된 지역이 있습니다. 관리자에서 실제 주소와 맞게 정정해야 정확한 지역 필터 결과가 나옵니다. 원문을 추측으로 덮어쓰지 않았습니다.
- 실제 사용자 자료에 대한 찜 변경/일정 삭제/제보 제출을 수행하지 않았습니다. 해당 쓰기·실패·권한 경로는 자동 모의 테스트로 검증했습니다. 서로 다른 기기에서의 동시 실계정 테스트는 미실시입니다.
- TourAPI 응답에 사진이 없는 장소는 대체 썸네일을 표시합니다. 모든 관광지 API 응답/영업시간을 전수 검증한 것은 아닙니다.
- 기존 영어 기능은 UI 문구 번역입니다. 관리자 입력 장소명·주소·설명은 원문을 유지합니다.
- 새 환경변수나 패키지 설치는 필요하지 않습니다.
