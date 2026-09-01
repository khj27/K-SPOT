# 로컬리 — K-콘텐츠 로컬 관광 플래너

2026 관광데이터 활용 공모전 지정과제 3번을 위한 PC 중심 반응형 웹 서비스입니다.

현재 STEP 1~3 범위로 프로젝트 기반, K-SPOT 공통 레이아웃, 주요 라우트 골격과 지도 중심 홈 화면까지 구현되어 있습니다. 검색, 일정 추천, 관리자 CRUD와 외부 API는 이후 단계에서 연결합니다.

제공된 UI 참고 이미지와 분석 문서는 `docs/ui-reference/`에서 확인할 수 있습니다. 화면에 표시되는 콘텐츠·장소 관계는 현재 UI 검증용 데모이며, 실제 공개 데이터는 출처 검수 후 교체합니다.

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

현재 단계의 화면 골격은 키 없이 실행할 수 있습니다.
