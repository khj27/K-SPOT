import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function AdminLoginPage() {
  return <RoutePlaceholder eyebrow="ADMIN ACCESS" title="관리자 로그인" description="인증된 관리자만 데이터 관리 화면에 접근하도록 할 로그인 화면입니다." nextStep="STEP 8에서 Firebase Authentication과 서버 권한 검증을 연결합니다." />;
}
