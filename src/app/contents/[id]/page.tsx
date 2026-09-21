import { notFound } from "next/navigation";

import { RoutePlaceholder } from "@/components/common/route-placeholder";
import { demoContents } from "@/mocks/content-data";

export function generateStaticParams() {
  return demoContents.map((content) => ({ id: content.id }));
}

type ContentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { id } = await params;
  const content = demoContents.find((item) => item.id === id);

  if (!content) notFound();

  return <RoutePlaceholder eyebrow={`${content.typeLabel} · UI DEMO`} title={content.title} description={`${content.year}년 ${content.format} 콘텐츠 상세 화면입니다. 연결된 장소는 출처 검증 후 공개됩니다.`} nextStep="다음 상세 화면 단계에서 제공된 콘텐츠 상세 UI와 관계 데이터를 연결합니다." backHref="/explore" backLabel="콘텐츠 탐색으로 돌아가기" />;
}
