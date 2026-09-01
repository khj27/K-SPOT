import { RoutePlaceholder } from "@/components/common/route-placeholder";

type AdminSpotPageProps = { params: Promise<{ id: string }> };

export default async function AdminSpotPage({ params }: AdminSpotPageProps) {
  const { id } = await params;
  return <RoutePlaceholder eyebrow={`ADMIN · SPOT · ${id}`} title="관광 장소 수정" description="장소 데이터와 검수 상태를 수정할 화면입니다." nextStep="STEP 8에서 저장, 삭제와 공개 상태 변경을 구현합니다." backHref="/admin/spots" backLabel="장소 관리로 돌아가기" />;
}
