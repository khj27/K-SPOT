import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminContentForm } from "@/components/admin/admin-content-form";
import { getAdminContentSpot } from "@/lib/content-repository";
import { requireAdminPage } from "@/lib/firebase/session";

type AdminSpotPageProps = { params: Promise<{ id: string }> };

export default async function AdminSpotPage({ params }: AdminSpotPageProps) {
  await requireAdminPage();
  const { id } = await params;
  const item = await getAdminContentSpot(id);
  if (!item) notFound();
  return <main className="admin-page"><Link className="admin-back" href="/admin/spots">← 콘텐츠 장소 관리</Link><section className="admin-heading"><div><p className="kspot-eyebrow">ADMIN · EDIT</p><h1>콘텐츠 장소 수정</h1><p><strong>{item.spotName}</strong><br />{item.contentTitle}</p></div><Link className="ui-button" href={`/spots/${item.slug}`}>공개 페이지 보기</Link></section><AdminContentForm initial={item} /></main>;
}
