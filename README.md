# 로컬리 — K-콘텐츠 로컬 관광 플래너

2026 관광데이터 활용 공모전 지정과제 3번을 위한 PC 중심 반응형 웹 서비스입니다.

현재 K-SPOT 공통 레이아웃, Kakao Maps 기반 홈·지도 탐색, 콘텐츠 탐색, 장소 상세, 저장한 장소와 설명 가능한 규칙 기반 여행 코스 추천 흐름까지 구현되어 있습니다. 홈 지도는 서버 전용 TourAPI 어댑터의 `locationBasedList2` 결과를 실제 마커로 표시하고, 선택한 관광지는 `detailCommon2` 설명·이미지와 함께 우측 패널에 표시합니다. 키가 없거나 장애가 발생하면 기존 디자인 지도와 K-SPOT 데이터로 안전하게 전환합니다. 일정 결과는 추천 근거, 순서 변경·삭제·로그인 계정의 Firebase 저장까지 지원합니다. Firebase 관리자 로그인과 Firestore 기반 콘텐츠 장소 등록·수정·공개 흐름도 연결되어 있습니다.

제공된 UI 참고 이미지와 분석 문서는 `docs/ui-reference/`에서 확인할 수 있습니다. 화면에 표시되는 콘텐츠·장소 관계는 현재 UI 검증용 데모이며, 실제 공개 데이터는 출처 검수 후 교체합니다.

TourAPI 요청·정규화·심사 증빙은 `docs/api-usage.md`, 현재 완성도와 제출 전 우선순위는 `docs/judging-checklist.md`에 정리되어 있습니다.

관리자 계정과 데이터 저장소 설정은 `docs/admin-setup.md`를 확인하세요. 관리자가 `공개`로 저장한 콘텐츠 장소는 홈, 탐색, 지도, 상세, 추천 후보에 자동 반영됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 검증 명령

```bash
npm run lint
npm run typecheck
npm run build
```

## 환경변수

`.env.example`을 `.env.local`로 복사한 뒤 실제 값을 입력합니다. 비밀키에는 `NEXT_PUBLIC_` 접두사를 사용하지 않습니다.

현재 단계의 화면 골격은 키 없이 실행할 수 있습니다. `GET /api/spots`는 정규화된 데모 데이터를 반환하며, `q`, `type`, `region` query로 필터링할 수 있습니다. `GET /api/nearby`는 장소 좌표로 TourAPI `locationBasedList2`를 호출해 주변 관광정보를 정규화합니다. 자세한 연결 방식과 심사 증빙 방법은 `docs/api-usage.md`를 확인하세요.

Kakao Developers에서 JavaScript 키를 발급하고 Web 플랫폼에 `http://localhost:3000` 및 배포 도메인을 등록한 뒤 `.env.local`에 다음 값을 설정합니다.

```dotenv
NEXT_PUBLIC_KAKAO_MAP_KEY=발급받은_JavaScript_키
TOUR_API_KEY=공공데이터포털_일반_인증키
```
