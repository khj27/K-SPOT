import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { getAdminIdentity } from "@/lib/firebase/session";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAdminIdentity();
  return (
    <div className="admin-surface">
      <div className="shell admin-bar">
        <Link className="admin-brand" href="/">K-SPOT <span>관리자</span></Link>
        <nav aria-label="관리자 메뉴">
          <Link href="/admin">대시보드</Link>
          <Link href="/admin/spots">콘텐츠 장소</Link>
          <Link href="/admin/import">CSV 등록</Link>
        </nav>
        {admin && <div className="admin-account"><span>{admin.email}</span><AdminLogoutButton /></div>}
      </div>
      {children}
    </div>
  );
}
