"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function AdminNavigation() {
  const path = usePathname();
  return <nav aria-label="관리자 메뉴">{[["/admin", "대시보드"], ["/admin/spots", "콘텐츠 장소"], ["/admin/import", "CSV 등록"], ["/admin/suggestions", "콘텐츠 제보"]].map(([href, label]) => <Link href={href} key={href} aria-current={(href === "/admin" ? path === href : path.startsWith(href)) ? "page" : undefined}>{label}</Link>)}</nav>;
}
