import Link from "next/link";

import { listAdminContentSpots } from "@/lib/content-repository";
import { requireAdminPage } from "@/lib/firebase/session";

type Props = { searchParams: Promise<{ saved?: string; q?: string; status?: string }> };

export default async function AdminSpotsPage({ searchParams }: Props) {
  await requireAdminPage();
  const [items, params] = await Promise.all([listAdminContentSpots(), searchParams]);
  const query = (params.q ?? "").trim().toLocaleLowerCase("ko");
  const status = ["published", "draft"].includes(params.status ?? "") ? params.status : "";
  const filtered = items.filter((item) => (!status || item.status === status) && (!query || [item.contentTitle, item.spotName, item.region, item.contentType].join(" ").toLocaleLowerCase("ko").includes(query)));
  return (
    <main className="admin-page">
      <section className="admin-heading"><div><p className="kspot-eyebrow">ADMIN · CONTENT PLACES</p><h1>콘텐츠 장소 관리</h1><p>공개 상태와 검수 근거를 확인하고 내용을 수정할 수 있습니다.</p></div><Link className="kspot-primary-button" href="/admin/spots/new">새로 등록</Link></section>
      {params.saved === "1" && <p className="admin-success" role="status">변경사항을 저장했습니다.</p>}
      <form action="/admin/spots" className="admin-list-filter"><label>콘텐츠·장소 검색<input name="q" type="search" defaultValue={params.q} placeholder="콘텐츠명, 장소명, 지역" /></label><label>공개 상태<select name="status" defaultValue={status}><option value="">전체 상태</option><option value="published">공개</option><option value="draft">임시 저장</option></select></label><button className="kspot-primary-button" type="submit">검색</button><Link className="ui-button" href="/admin/spots">초기화</Link></form>
      <p className="admin-result-count" role="status">전체 {items.length}개 중 {filtered.length}개</p>
      {filtered.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>콘텐츠</th><th>장소</th><th>지역</th><th>상태</th><th>검수일</th><th><span className="sr-only">관리</span></th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.contentTitle}</strong><small>{item.contentType} · {item.episode}</small></td><td>{item.spotName}</td><td>{item.region}</td><td><span className={`admin-status status-${item.status}`}>{item.status === "published" ? "공개" : "임시 저장"}</span></td><td>{item.verifiedAt || "미검수"}</td><td><Link href={`/admin/spots/${item.id}`}>수정</Link></td></tr>)}</tbody></table></div> : <section className="admin-empty"><h2>{items.length ? "검색 조건에 맞는 콘텐츠가 없습니다." : "아직 등록된 콘텐츠가 없습니다."}</h2><p>{items.length ? "검색어나 공개 상태를 바꿔 보세요." : "첫 콘텐츠 장소를 등록해 보세요."}</p><Link className="kspot-primary-button" href="/admin/spots/new">첫 콘텐츠 장소 등록</Link></section>}
    </main>
  );
}
