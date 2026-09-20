import Link from "next/link";

import { listAdminContentSpots } from "@/lib/content-repository";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminPage() {
  await requireAdminPage();
  const items = await listAdminContentSpots();
  const published = items.filter((item) => item.status === "published").length;
  return (
    <main className="admin-page">
      <section className="admin-heading"><div><p className="kspot-eyebrow">ADMIN DASHBOARD</p><h1>데이터 관리</h1><p>등록 현황을 확인하고 콘텐츠를 검수·공개하세요.</p></div><Link className="kspot-primary-button" href="/admin/spots/new">새 콘텐츠 장소 등록</Link></section>
      <section className="admin-stat-grid"><Link href="/admin/spots"><span>전체 콘텐츠</span><strong>{items.length}</strong><small>전체 목록 보기 →</small></Link><Link href="/admin/spots?status=published"><span>공개 중</span><strong>{published}</strong><small>공개 콘텐츠 보기 →</small></Link><Link href="/admin/spots?status=draft"><span>검수 대기 · 임시 저장</span><strong>{items.length - published}</strong><small>검수할 콘텐츠 보기 →</small></Link></section>
      <section className="admin-guide-card"><h2>등록 기준</h2><ol><li>작품과 장소의 관계를 확인할 수 있는 근거 URL을 남깁니다.</li><li>정확한 주소와 위·경도를 입력해 지도 위치를 검수합니다.</li><li>필수 정보를 검수한 뒤 공개 상태로 전환합니다. 이미지 출처는 선택 항목입니다.</li></ol><Link className="kspot-primary-button" href="/admin/import">CSV 일괄 등록</Link></section>
    </main>
  );
}
