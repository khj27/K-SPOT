import type { Metadata } from "next";

import { ContentExplorer } from "@/components/explore/content-explorer";
import { contentTypeIds, type ContentTypeId } from "@/types/content";

export const metadata: Metadata = {
  title: "콘텐츠 탐색",
  description: "K-콘텐츠와 연결된 로컬 여행 장소를 탐색합니다.",
};

type ExplorePageProps = {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[]; content?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const typeCandidate = firstValue(params.type);
  const initialType: ContentTypeId = contentTypeIds.includes(typeCandidate as ContentTypeId) ? typeCandidate as ContentTypeId : "all";
  const initialQuery = firstValue(params.q) || firstValue(params.content);

  return <ContentExplorer initialFilters={{ query: initialQuery, type: initialType }} />;
}
