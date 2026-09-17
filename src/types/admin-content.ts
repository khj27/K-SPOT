import type { ContentType } from "@/types/content";

export const contentStatuses = ["draft", "published"] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export type AdminContentSpotInput = {
  slug: string;
  contentTitle: string;
  contentType: ContentType;
  creator: string;
  releaseYear: number | null;
  episode: string;
  description: string;
  spotName: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
  imageUrl: string;
  imageRights: string;
  status: ContentStatus;
};

export type AdminContentSpot = AdminContentSpotInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type AdminContentValidation = {
  data?: AdminContentSpotInput;
  errors: Record<string, string>;
};
