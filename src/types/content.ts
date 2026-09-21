export const contentTypeIds = [
  "all",
  "drama",
  "variety",
  "movie",
  "music-video",
  "idol",
  "webtoon",
] as const;

export type ContentTypeId = (typeof contentTypeIds)[number];
export type PublishedContentType = Exclude<ContentTypeId, "all">;
export type ContentSort = "latest" | "oldest" | "places" | "title";

export type ContentExploreItem = {
  id: string;
  title: string;
  contentType: PublishedContentType;
  typeLabel: string;
  year: number;
  format: string;
  placeCount: number;
  regions: string[];
  artistNames: string[];
  visualTone: "midnight" | "sky" | "coast" | "sepia" | "violet" | "night" | "forest" | "heritage" | "city";
  status: "draft";
  isDemo: true;
};

export type ExploreInitialFilters = {
  query: string;
  type: ContentTypeId;
};
