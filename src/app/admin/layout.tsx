import Link from "next/link";

import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { getAdminIdentity } from "@/lib/firebase/session";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAdminIdentity();
  return (
    <div className="admin-surface">
      <div className="shell admin-bar">
        <Link className="admin-brand" href="/">K-SPOT <span>관리자</span></Link>
        <AdminNavigation />
        {admin && <div className="admin-account"><span>{admin.email}</span><AdminLogoutButton /></div>}
      </div>
      {children}
    </div>
  );
}
