# Render 배포

K-SPOT은 Firebase Admin과 API 라우트를 사용하는 Next.js Node 웹 서비스입니다.

## 서비스 설정

- GitHub 저장소: khj27/K-SPOT, 브랜치 main
- Web Service / Node / Root Directory 비움 / Singapore
- Build Command: `npm ci --include=dev && npm run build`
- Start Command: `npm run start -- --hostname 0.0.0.0 --port $PORT`
- NODE_VERSION: 24
- 최초 배포는 Free 플랜으로 구성. 유료 플랜 변경은 별도 결정.

저장소 루트의 render.yaml로 Blueprint를 만들거나 위 설정으로 Web Service를 만들 수 있습니다. 두 경로를 모두 사용해 중복 서비스를 만들지 마세요.

## 환경변수

`.env.example`에 나열된 9개 설정을 Render Environment에 등록합니다. 값은 현재 PC의 `.env.local`에서 가져옵니다. 서비스 계정 개인키는 FIREBASE_PRIVATE_KEY에만 넣고 NEXT_PUBLIC_ 접두사를 붙이지 않습니다. 개인키의 줄바꿈은 실제 줄바꿈 또는 `\n` 형식을 사용할 수 있습니다. `.env.local`의 값을 그대로 입력할 때 파일 문법의 바깥 따옴표는 제외합니다.

NEXT_PUBLIC_ 변수는 빌드 시 반영되므로 최초 빌드 전에 입력하고 변경 후 다시 빌드합니다. Firebase와 TourAPI 데이터는 동일 프로젝트를 사용하므로 다시 등록하지 않습니다.

## 배포 주소 생성 후

1. Firebase Authentication 설정의 승인된 도메인에 생성된 호스트 이름을 추가합니다.
2. Kakao Developers JavaScript 키의 허용 웹 도메인에 생성된 HTTPS 주소를 추가합니다.
3. 배포 주소에서 회원 로그인·찜·일정 저장·지도·TourAPI·관리자 페이지를 확인합니다.

GitHub 저장소가 목록에 없다면 Render Credentials → khj27 → Configure에서 Render GitHub 앱의 허용 저장소에 K-SPOT을 추가해야 합니다.

공식 참고: https://render.com/docs/deploy-nextjs-app
