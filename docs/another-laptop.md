# 다른 노트북에서 개발하기

1. Node.js 24 LTS와 Git을 설치합니다.
2. 터미널에서 저장소를 복제하고 의존성을 설치합니다.

```powershell
git clone https://github.com/khj27/K-SPOT.git
cd K-SPOT
npm ci
Copy-Item .env.example .env.local
```

3. `.env.local`에 기존 PC의 환경 변수 값을 직접 옮깁니다. 이 파일은 GitHub에 포함되지 않습니다. 비공개 키는 안전한 개인 전송 경로로 옮기고 저장소에 커밋하지 마세요.
4. `npm run dev`를 실행한 터미널을 유지하고 http://localhost:3000 을 엽니다. 터미널이나 노트북을 종료하면 로컬 서버도 종료됩니다. 다음 작업 때 다시 실행하세요.
5. 관리자 계정과 콘텐츠는 동일한 Firebase 프로젝트에 저장되므로 다시 만들 필요 없습니다. 카카오에는 `http://localhost:3000`이 등록돼 있어 같은 주소로 실행하면 됩니다.

작업을 시작하기 전에 `git pull --ff-only`, 완료한 뒤 `git add`, `git commit`, `git push`로 동기화합니다. 두 노트북에서 동시에 같은 파일을 수정하면 충돌을 해결해야 할 수 있습니다.

## 배포할 때

이 프로젝트는 관리자 인증과 API를 사용하는 Next.js 서버 앱입니다. 정적 GitHub Pages 대신 Next.js 서버 실행을 지원하는 호스팅에 연결하세요. 호스팅 환경 변수에 `.env.local`의 값을 등록하고, 카카오 JavaScript SDK 도메인에 실제 HTTPS 배포 주소를 추가합니다. 공개 환경 변수는 빌드에 반영되므로 변경 후 재배포합니다.
