export type TourApiPlace = {
  contentId: string;
  contentTypeId: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  tel?: string;
  distanceMeters?: number;
};

export type NearbyTourismResponse = {
  source: "tour-api" | "unavailable";
  operation: "locationBasedList2";
  items: TourApiPlace[];
  fetchedAt: string;
  message?: string;
};

export type TourApiDetail = TourApiPlace & {
  overview?: string;
  homepage?: string;
};

export type TourApiDetailResponse = {
  source: "tour-api" | "unavailable";
  operation: "detailCommon2";
  item?: TourApiDetail;
  message?: string;
};
