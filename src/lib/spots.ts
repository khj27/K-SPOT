import { exploreContents } from "@/mocks/explore-data";
import type { ExploreContent } from "@/types/content";

export type SpotDataSource = "demo" | "tour-api";

export type SpotQuery = {
  q?: string;
  type?: string;
  region?: string;
};

export type SpotResponse = {
  source: SpotDataSource;
  items: ExploreContent[];
  total: number;
};

export function getDemoSpots(query: SpotQuery): SpotResponse {
  const searchQuery = query.q?.trim().toLocaleLowerCase("ko-KR") ?? "";
  const items = exploreContents.filter((content) => {
    const matchesQuery = !searchQuery
      || [content.title, content.spotName, content.region].some((value) => value.toLocaleLowerCase("ko-KR").includes(searchQuery));
    const matchesType = !query.type || query.type === "전체" || content.type === query.type;
    const matchesRegion = !query.region || query.region === "전체 지역" || content.region === query.region;
    return matchesQuery && matchesType && matchesRegion;
  });

  return { source: "demo", items, total: items.length };
}
