export type ContentCategory = {
  id: string;
  label: string;
  count: number;
  icon: "clapper" | "mic" | "film" | "music" | "users" | "book";
};

export type MapMarker = {
  id: string;
  label: string;
  count?: number;
  x: number;
  y: number;
  tone: "purple" | "blue" | "green" | "orange" | "red" | "teal";
};

export type FeaturedContent = {
  id: string;
  title: string;
  type: string;
  meta: string;
  visual: "violet" | "sky" | "rose" | "navy";
};

export type FeaturedPlace = {
  id: string;
  name: string;
  region: string;
  rating: number;
  reviewCount: number;
  contents: FeaturedContent[];
  nearby: Array<{ label: string; count: number; icon: string }>;
  isDemo: true;
};
