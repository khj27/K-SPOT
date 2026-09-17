# TourAPI 활용 명세

## 사용자 가치와 연결

장소 상세의 좌표를 기준으로 한국관광공사 국문 관광정보 서비스의 주변 관광지를 조회한다. 팬이 한 촬영지만 보고 떠나는 대신, 반경 5km 안의 관광 자원을 함께 발견하도록 해 비수도권 체류와 지역 소비로 이어지는 흐름을 만든다.

## 사용 API

- 상품명: 한국관광공사 국문 관광정보 서비스_GW
- Base URL: `https://apis.data.go.kr/B551011/KorService2`
- 오퍼레이션: `locationBasedList2`, `detailCommon2`
- 화면: `/spots/[id]`의 ‘주변에서 함께 즐길 곳’
- 서버 경계: `/api/nearby?latitude={위도}&longitude={경도}`

홈 지도는 `locationBasedList2`를 반경 10km·최대 30건으로 호출하고, 장소를 선택하면 `/api/tour-spots/[contentId]`가 `detailCommon2`의 설명과 대표 이미지를 조회한다. 장소 상세 화면은 반경 5km 조회를 사용한다.

공공데이터포털의 2026-09-11 공개 명세에서 `KorService2`와 `locationBasedList2`를 확인했다.

## 요청과 정규화

서버는 `serviceKey`, `MobileOS=ETC`, `MobileApp=Locally`, `_type=json`, `mapX`, `mapY`, `radius`, `arrange=E`를 전송한다. TourAPI의 `mapX`는 경도, `mapY`는 위도로 정규화해 Kakao Maps의 `LatLng(위도, 경도)`에 전달한다. 숫자가 아니거나 범위를 벗어난 좌표는 마커 생성에서 제외한다. 외부 응답 전체를 화면에 전달하지 않고 다음 필드만 내부 타입으로 정규화한다.

| 외부 필드 | 내부 필드 | 용도 |
| --- | --- | --- |
| `contentid` | `contentId` | 항목 식별 |
| `contenttypeid` | `contentTypeId` | 관광 유형 구분 |
| `title` | `title` | 장소명 |
| `addr1`, `addr2` | `address` | 주소 표시 |
| `mapx`, `mapy` | `longitude`, `latitude` | 거리·지도 확장 |
| `firstimage`, `firstimage2` | `imageUrl`, `thumbnailUrl` | 권리 확인 후 이미지 표시 확장 |
| `tel` | `tel` | 문의 정보 |
| `dist` | `distanceMeters` | 가까운 순 거리 표시 |

## 키와 보안

`.env.local`의 `TOUR_API_KEY`에 일반 인증키를 넣는다. 키는 서버 모듈에서만 읽고 `NEXT_PUBLIC_` 접두사를 사용하지 않는다. API URL이나 오류 응답에 키를 기록하지 않는다.

## 안정성

- 6초 timeout
- 성공 응답은 CDN에서 6시간 캐시, stale 응답은 24시간 허용
- 빈 응답은 정상적인 0건으로 표시
- 키 미설정, 인증 오류, 네트워크 장애는 빈 배열과 사용자용 상태 메시지로 처리
- 응답 항목은 필수 식별자·제목·좌표가 있는 경우만 노출
- 홈의 최초 주변 검색은 개발 모드의 React Strict Mode에서도 동일 Promise를 공유하며, 이후 호출은 사용자가 ‘현재 지도 내 검색’을 누를 때만 발생

## Kakao Maps 연동

- SDK: `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false`
- 키: `NEXT_PUBLIC_KAKAO_MAP_KEY`에 Kakao Developers JavaScript 키 설정
- 로더: 모듈 단위 Promise와 `kakao-maps-sdk` script ID로 중복 로딩 방지
- SSR: 지도와 `window.kakao` 접근은 클라이언트 effect 안에서만 수행
- 마커: TourAPI와 K-SPOT 모두 정규화된 위도·경도를 사용하며 선택 항목은 보라색, 나머지는 파란색으로 표시
- 검색: 지도 객체의 `getCenter()`를 읽어 `/api/nearby`를 다시 호출

Kakao Developers에서 로컬 `http://localhost:3000`과 실제 배포 도메인을 Web 플랫폼 사이트 도메인으로 등록해야 한다.

## 심사 시연 확인

장소 상세에서 상태 배지가 `실시간 연동`인지 확인하고 브라우저 네트워크 탭에서 `/api/nearby` 응답의 `source: "tour-api"`, `operation: "locationBasedList2"`를 확인한다. 인증키 값은 응답에 포함되지 않는다.
