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
  latitude: number | null;
  longitude: number | null;
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
  imageUrl: string;
  imageRights: string;
  status: ContentStatus;
};

export type AdminContentSpot = AdminContentSpotInput & {
  researchImport?: { sheetName: string; spreadsheetUrl: string; notes: string[]; rows: { label: string; value: string; links: string[] }[] };
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
