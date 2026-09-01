import Link from "next/link";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-surface">
      <div className="shell admin-bar">
        <strong>관리자</strong>
        <nav aria-label="관리자 메뉴">
          <Link href="/admin">대시보드</Link>
          <Link href="/admin/spots">장소 관리</Link>
          <Link href="/admin/import">CSV 등록</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
