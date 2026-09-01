import { RoutePlaceholder } from "@/components/common/route-placeholder";

type SpotPageProps = { params: Promise<{ id: string }> };

export default async function SpotPage({ params }: SpotPageProps) {
  const { id } = await params;
  return <RoutePlaceholder eyebrow={`SPOT · ${id}`} title="관광 장소 상세" description="장소 정보, 콘텐츠 관계, 검증 출처와 주변 관광 정보를 보여줄 화면입니다." nextStep="STEP 6에서 실제 장소 데이터와 콘텐츠 관계를 연결합니다." backHref="/explore" backLabel="탐색으로 돌아가기" />;
}
