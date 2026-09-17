import Link from "next/link";

import { AdminContentForm } from "@/components/admin/admin-content-form";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function NewSpotPage() {
  await requireAdminPage();
  return <main className="admin-page"><Link className="admin-back" href="/admin/spots">← 콘텐츠 장소 관리</Link><section className="admin-heading"><div><p className="kspot-eyebrow">ADMIN · NEW CONTENT PLACE</p><h1>새 콘텐츠 장소 등록</h1><p>출처와 이미지 권리를 포함해 공개 가능한 데이터 한 건을 만듭니다.</p></div></section><AdminContentForm /></main>;
}
