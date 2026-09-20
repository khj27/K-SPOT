import { requireAdminPage } from "@/lib/firebase/session";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
export default async function AdminSuggestions() {
  await requireAdminPage();
  const snapshot = await getFirebaseAdminDb().collection("contentSuggestions").orderBy("createdAt", "desc").limit(100).get();
  return <main className="admin-page"><section className="admin-heading"><div><p className="kspot-eyebrow">USER SUGGESTIONS</p><h1>콘텐츠 제보</h1><p>최근 제보 100건입니다. 제보는 자동 공개되지 않으며, 확인 후 콘텐츠 장소 메뉴에서 등록할 수 있습니다.</p></div></section>{snapshot.empty ? <p>접수된 제보가 없습니다.</p> : snapshot.docs.map((doc) => { const item = doc.data(); return <article className="admin-guide-card" key={doc.id}><h2>{String(item.title)}</h2><p>{String(item.createdAt)} · {String(item.category)} · {String(item.region)}</p><dl>{[["주소", "address"], ["설명", "description"], ["추가 요청 사유", "reason"], ["기타 의견", "comments"]].map(([label, field]) => <div key={field}><dt>{label}</dt><dd>{String(item[field] ?? "")}</dd></div>)}</dl>{typeof item.relatedUrl === "string" && /^https?:\/\//.test(item.relatedUrl) && <a href={item.relatedUrl} target="_blank" rel="noopener noreferrer">관련 URL 확인</a>}</article>; })}</main>;
}
