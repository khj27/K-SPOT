import Link from "next/link";

import { AdminContentForm } from "@/components/admin/admin-content-form";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function NewSpotPage() {
  await requireAdminPage();
  return <main className="admin-page"><Link className="admin-back" href="/admin/spots">← 콘텐츠 장소 관리</Link><section className="admin-heading"><div><p className="kspot-eyebrow">ADMIN · NEW CONTENT PLACE</p><h1>새 콘텐츠 장소 등록</h1><p>촬영 근거와 위치를 입력해 콘텐츠 장소를 등록합니다. 이미지 출처·사용 근거는 선택 사항입니다.</p></div></section><AdminContentForm /></main>;
}
