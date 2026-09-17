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

export function rankPlaces({ places, region, selectedTypes, selectedSpotId }: RecommendationInput): RankedPlace[] {
  return places
    .map((place) => {
      const reasons: string[] = [];
      let score = 0;

      if (place.id === selectedSpotId) {
        score += 100;
        reasons.push("직접 선택한 장소");
      }
      if (!region || place.region === region) {
        score += 35;
        reasons.push(region ? `${region} 지역 일치` : "선택 지역 제한 없음");
      }
      if (selectedTypes.has(place.type)) {
        score += 30;
        reasons.push(`${place.type} 취향 일치`);
      }
      if (!CAPITAL_REGIONS.has(place.region)) {
        score += 20;
        reasons.push("비수도권 로컬 우선");
      }

      return { place, score, reasons };
    })
    .filter((result) => result.place.id === selectedSpotId || (!region || result.place.region === region) && selectedTypes.has(result.place.type))
    .sort((a, b) => b.score - a.score || a.place.spotName.localeCompare(b.place.spotName, "ko-KR"));
}
