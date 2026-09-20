import type { ExploreContent } from "@/types/content";

export type MapCoordinate = { latitude: number; longitude: number };

export type MapPlace = {
  order?: number;
  id: string;
  source: "tour-api" | "kspot";
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  contentTypeLabel: string;
  description?: string;
  distanceMeters?: number;
  kspotContent?: ExploreContent;
};
