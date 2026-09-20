import type { ExploreContent } from "@/types/content";

export type RankedPlace = {
  place: ExploreContent;
  score: number;
  reasons: string[];
};

type RecommendationInput = {
  places: ExploreContent[];
  region?: string;
  selectedTypes: Set<string>;
  selectedSpotId?: string;
};

const CAPITAL_REGIONS = new Set(["서울", "경기", "인천"]);
const REGION_NAMES: Record<string, string> = { 서울특별시: "서울", 부산광역시: "부산", 대구광역시: "대구", 인천광역시: "인천", 광주광역시: "광주", 대전광역시: "대전", 울산광역시: "울산", 세종특별자치시: "세종", 경기도: "경기", 강원도: "강원", 강원특별자치도: "강원", 충청북도: "충북", 충청남도: "충남", 전라북도: "전북", 전북특별자치도: "전북", 전라남도: "전남", 경상북도: "경북", 경상남도: "경남", 제주도: "제주", 제주특별자치도: "제주" };
export function normalizeRegion(region: string) {
  const first = region.trim().split(/\s+/)[0];
  return REGION_NAMES[first] ?? first;
}

export function rankPlaces({ places, region, selectedTypes, selectedSpotId }: RecommendationInput): RankedPlace[] {
  const matchesRegion = (place: ExploreContent) => !region || region === "전국" || normalizeRegion(place.region) === normalizeRegion(region);
  return places
    .map((place) => {
      const reasons: string[] = [];
      let score = 0;

      if (place.id === selectedSpotId) {
        score += 100;
        reasons.push("직접 선택한 장소");
      }
      if (matchesRegion(place)) {
        score += 35;
        reasons.push(region ? `${region} 지역 일치` : "선택 지역 제한 없음");
      }
      if (selectedTypes.has(place.type)) {
        score += 30;
        reasons.push(`${place.type} 취향 일치`);
      }
      if (!CAPITAL_REGIONS.has(normalizeRegion(place.region))) {
        score += 20;
        reasons.push("비수도권 로컬 우선");
      }

      return { place, score, reasons };
    })
    .filter((result) => result.place.id === selectedSpotId || matchesRegion(result.place) && selectedTypes.has(result.place.type))
    .sort((a, b) => b.score - a.score || a.place.spotName.localeCompare(b.place.spotName, "ko-KR"));
}
