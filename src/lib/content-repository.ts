import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { exploreContents } from "@/mocks/explore-data";
import type { AdminContentSpot, AdminContentSpotInput } from "@/types/admin-content";
import type { ContentType, DemoMapPosition, ExploreContent } from "@/types/content";

const COLLECTION = "contentSpots";

export async function listAdminContentSpots(): Promise<AdminContentSpot[]> {
  const snapshot = await getFirebaseAdminDb().collection(COLLECTION).limit(250).get();
  return snapshot.docs.map((doc) => serializeAdminContent(doc.id, doc.data())).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getAdminContentSpot(id: string): Promise<AdminContentSpot | null> {
  const doc = await getFirebaseAdminDb().collection(COLLECTION).doc(id).get();
  return doc.exists ? serializeAdminContent(doc.id, doc.data()!) : null;
}

export async function createAdminContentSpot(input: AdminContentSpotInput, actor: string) {
  const ref = getFirebaseAdminDb().collection(COLLECTION).doc(input.slug);
  await getFirebaseAdminDb().runTransaction(async (transaction) => {
    if ((await transaction.get(ref)).exists) throw new Error("DUPLICATE_SLUG");
    transaction.create(ref, { ...input, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), createdBy: actor, updatedBy: actor });
  });
  return input.slug;
}

export async function updateAdminContentSpot(id: string, input: AdminContentSpotInput, actor: string) {
  if (id !== input.slug) throw new Error("SLUG_IMMUTABLE");
  const ref = getFirebaseAdminDb().collection(COLLECTION).doc(id);
  if (!(await ref.get()).exists) throw new Error("NOT_FOUND");
  await ref.set({ ...input, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor }, { merge: true });
}

export async function getPublicExploreContents(): Promise<ExploreContent[]> {
  if (!isFirebaseAdminConfigured()) return exploreContents;
  try {
    const managed = (await listAdminContentSpots()).filter((item) => item.status === "published").map(toExploreContent);
    const merged = new Map(exploreContents.map((item) => [item.id, item]));
    managed.forEach((item) => merged.set(item.id, item));
    return Array.from(merged.values());
  } catch {
    return exploreContents;
  }
}

function serializeAdminContent(id: string, data: Record<string, unknown>): AdminContentSpot {
  const toIso = (value: unknown) => value instanceof Timestamp ? value.toDate().toISOString() : typeof value === "string" ? value : "";
  return {
    id,
    slug: String(data.slug ?? id),
    contentTitle: String(data.contentTitle ?? ""),
    contentType: data.contentType as ContentType,
    creator: String(data.creator ?? ""),
    releaseYear: typeof data.releaseYear === "number" ? data.releaseYear : null,
    episode: String(data.episode ?? ""),
    description: String(data.description ?? ""),
    spotName: String(data.spotName ?? ""),
    region: String(data.region ?? ""),
    address: String(data.address ?? ""),
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    sourceUrl: String(data.sourceUrl ?? ""),
    sourceLabel: String(data.sourceLabel ?? ""),
    verifiedAt: String(data.verifiedAt ?? ""),
    imageUrl: String(data.imageUrl ?? ""),
    imageRights: String(data.imageRights ?? ""),
    status: data.status === "published" ? "published" : "draft",
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    createdBy: String(data.createdBy ?? ""),
    updatedBy: String(data.updatedBy ?? ""),
  };
}

function toExploreContent(item: AdminContentSpot): ExploreContent {
  const visuals: Record<ContentType, ExploreContent["visual"]> = { 드라마: "navy", 예능: "sky", 영화: "violet", 뮤직비디오: "rose", 아이돌: "violet", "웹툰/웹소설": "green" };
  const tones: Record<ContentType, DemoMapPosition["tone"]> = { 드라마: "purple", 예능: "blue", 영화: "orange", 뮤직비디오: "red", 아이돌: "teal", "웹툰/웹소설": "green" };
  return {
    id: item.slug,
    title: item.contentTitle,
    type: item.contentType,
    region: item.region,
    spotName: item.spotName,
    coordinates: { latitude: item.latitude, longitude: item.longitude },
    mapPosition: { x: clamp(((item.longitude - 124) / 8) * 100), y: clamp(((39 - item.latitude) / 6) * 100), tone: tones[item.contentType] },
    description: item.description,
    episode: item.episode,
    visual: visuals[item.contentType],
    address: item.address,
    sourceUrl: item.sourceUrl,
    sourceLabel: item.sourceLabel,
    verifiedAt: item.verifiedAt,
    imageUrl: item.imageUrl,
    imageRights: item.imageRights,
    managed: true,
  };
}

function clamp(value: number) {
  return Math.min(92, Math.max(8, value));
}
