// These contentTypeId values already existed in the TourAPI map integration.
export const TOUR_TYPE_LABELS: Record<string, string> = { "12": "관광지", "14": "문화시설", "15": "축제·행사", "25": "여행코스", "28": "레포츠", "32": "숙박", "38": "쇼핑", "39": "음식점" };
export const PLACE_CATEGORIES = ["관광지", "음식점", "문화시설", "숙박", "축제·행사", "쇼핑", "기타"] as const;
export type PlaceCategory = typeof PLACE_CATEGORIES[number];
