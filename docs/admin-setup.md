# K-SPOT 관리자 설정

관리자 기능은 Firebase Authentication의 이메일/비밀번호 계정, 서버 세션 쿠키, Firestore를 사용한다. `ADMIN_EMAILS`에 등록된 계정만 서버가 관리자 세션을 발급한다. 브라우저가 Firestore를 직접 읽거나 쓰지 않으며, 모든 데이터 작업은 권한을 다시 확인하는 Route Handler를 거친다.

## 1. Firebase 프로젝트 준비

1. Firebase Console에서 프로젝트를 만든다.
2. **Authentication → Sign-in method**에서 **Email/Password**를 활성화한다.
3. **Authentication → Users → Add user**에서 실제 관리자 이메일과 임시 비밀번호를 만든다.
4. **Firestore Database**를 생성한다. 서버 SDK만 접근하므로 운영 모드는 어느 지역을 선택해도 되지만, 서비스 대상과 가까운 `asia-northeast3`(서울)을 권장한다.
5. 프로젝트 설정에서 Web App을 추가하고 공개 설정 세 값을 확인한다.
6. **프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성**에서 서버용 JSON 키를 내려받는다. 이 파일은 저장소에 넣지 않는다.

## 2. `.env.local` 설정

프로젝트 루트의 `.env.local`에 아래 값을 채운다.

```dotenv
FIREBASE_PROJECT_ID=서비스계정_JSON의_project_id
FIREBASE_CLIENT_EMAIL=서비스계정_JSON의_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_EMAILS=관리자이메일@example.com

NEXT_PUBLIC_FIREBASE_API_KEY=Firebase_Web_App_apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=Firebase_Web_App_authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=Firebase_Web_App_projectId
```

관리자가 여러 명이면 `ADMIN_EMAILS=one@example.com,two@example.com`처럼 쉼표로 구분한다. 서비스 계정 JSON 전체와 비밀번호는 코드, 문서, Git에 넣지 않는다.

## 3. Firestore 보안 규칙

저장소의 `firestore.rules`는 클라이언트의 직접 읽기와 쓰기를 모두 막는다. Firebase CLI를 연결한 뒤 이 규칙을 배포한다.

```bash
firebase deploy --only firestore:rules
```

## 4. 확인 순서

1. 개발 서버를 다시 시작한다.
2. `/admin/login`에서 `ADMIN_EMAILS`에 넣은 Firebase 계정으로 로그인한다.
3. `/admin/spots/new`에서 근거 URL, 검수일, 이미지 권리를 포함해 등록한다.
4. `임시 저장` 데이터는 관리자 목록에만 나타난다.
5. `즉시 공개`로 바꾸면 홈, 탐색, 지도, 상세, 추천 후보에 표시된다.

관리자 계정이 탈취되거나 운영자에서 제외되면 Firebase Authentication에서 사용자를 비활성화하고 `ADMIN_EMAILS`에서도 제거한다. 서버는 세션 검증 때 계정 철회 상태를 확인한다.
