# TourAPI 실제 응답 검증 — 2026-09-19

- 서비스: 한국관광공사_국문 관광정보 서비스_GW, KorService2
- 인증키: Git 제외 파일 `.env.local`에만 등록. 문서와 커밋에 값 미포함.
- 로컬 개발 서버: localhost:3000
- `/api/nearby?latitude=37.592&longitude=126.966&radius=3000`: source=tour-api, operation=locationBasedList2, 30건 반환.
- 첫 항목: contentId 252547, 창의문(자하문).
- `/api/tour-spots/252547`: source=tour-api, operation=detailCommon2, 주소·소개·대표 이미지 반환 확인.
- 상세 호출에서 기존 `defaultYN`, `firstImageYN`, `addrinfoYN`, `mapinfoYN`, `overviewYN` 옵션을 제거해 정상 응답 확인.

이 검증은 서버 API 응답을 확인한 것으로, 모든 관광지의 데이터 완전성이나 배포 환경 동작을 보장하지 않습니다. 다른 PC와 호스팅에는 인증키를 별도로 설정해야 합니다.
