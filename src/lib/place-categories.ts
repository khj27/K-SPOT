// These contentTypeId values already existed in the TourAPI map integration.
export const TOUR_TYPE_LABELS: Record<string, string> = { "12": "관광지", "14": "문화시설", "15": "축제·행사", "25": "여행코스", "28": "레포츠", "32": "숙박", "38": "쇼핑", "39": "음식점" };
export const PLACE_CATEGORIES = ["관광지", "음식점", "문화시설", "숙박", "축제·행사", "쇼핑", "기타"] as const;
export type PlaceCategory = typeof PLACE_CATEGORIES[number];

export const TRIP_NEARBY_CATEGORIES = ["전체", "숙소", "식사", "놀거리", "쇼핑", "기타"] as const;
export type TripNearbyCategory = typeof TRIP_NEARBY_CATEGORIES[number];
export function tripNearbyCategory(contentTypeId: string): Exclude<TripNearbyCategory, "전체"> {
  if (contentTypeId === "32") return "숙소";
  if (contentTypeId === "39") return "식사";
  if (["12", "14", "15", "25", "28"].includes(contentTypeId)) return "놀거리";
  if (contentTypeId === "38") return "쇼핑";
  return "기타";
}
