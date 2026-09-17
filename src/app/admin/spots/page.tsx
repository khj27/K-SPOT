import Link from "next/link";

import { listAdminContentSpots } from "@/lib/content-repository";
import { requireAdminPage } from "@/lib/firebase/session";

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function AdminSpotsPage({ searchParams }: Props) {
  await requireAdminPage();
  const [items, params] = await Promise.all([listAdminContentSpots(), searchParams]);
  return (
    <main className="admin-page">
      <section className="admin-heading"><div><p className="kspot-eyebrow">ADMIN · CONTENT PLACES</p><h1>콘텐츠 장소 관리</h1><p>공개 상태와 검수 근거를 확인하고 내용을 수정할 수 있습니다.</p></div><Link className="kspot-primary-button" href="/admin/spots/new">새로 등록</Link></section>
      {params.saved === "1" && <p className="admin-success" role="status">변경사항을 저장했습니다.</p>}
      {items.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>콘텐츠</th><th>장소</th><th>지역</th><th>상태</th><th>검수일</th><th><span className="sr-only">관리</span></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.contentTitle}</strong><small>{item.contentType} · {item.episode}</small></td><td>{item.spotName}</td><td>{item.region}</td><td><span className={`admin-status status-${item.status}`}>{item.status === "published" ? "공개" : "임시 저장"}</span></td><td>{item.verifiedAt}</td><td><Link href={`/admin/spots/${item.id}`}>수정</Link></td></tr>)}</tbody></table></div> : <section className="admin-empty"><h2>등록된 콘텐츠 장소가 없습니다.</h2><p>첫 데이터를 등록하면 목록과 공개 페이지에 연결됩니다.</p><Link className="kspot-primary-button" href="/admin/spots/new">첫 콘텐츠 장소 등록</Link></section>}
    </main>
  );
}
