import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminIdentity, getAllowedAdminEmails } from "@/lib/firebase/session";

export default async function AdminLoginPage() {
  if (await getAdminIdentity()) redirect("/admin");
  const configured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY && getAllowedAdminEmails().length);
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="kspot-eyebrow">ADMIN ACCESS</p>
        <h1>관리자 로그인</h1>
        <p>승인된 운영자만 콘텐츠, 관광 장소, 근거 자료를 등록하고 공개할 수 있습니다.</p>
        <AdminLoginForm configured={configured} />
      </section>
    </main>
  );
}
