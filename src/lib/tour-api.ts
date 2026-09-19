import type { NearbyTourismResponse, TourApiDetailResponse, TourApiPlace } from "@/types/tour-api";

const TOUR_API_BASE_URL = "https://apis.data.go.kr/B551011/KorService2";
const REQUEST_TIMEOUT_MS = 6_000;

type TourApiItem = {
  contentid?: string;
  contenttypeid?: string;
  title?: string;
  addr1?: string;
  addr2?: string;
  mapx?: string;
  mapy?: string;
  firstimage?: string;
  firstimage2?: string;
  tel?: string;
  dist?: string;
  overview?: string;
  homepage?: string;
};

type TourApiPayload = {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: { items?: { item?: TourApiItem | TourApiItem[] } | "" };
  };
};

export async function getNearbyTourism(latitude: number, longitude: number, radius = 5_000, limit = 20): Promise<NearbyTourismResponse> {
  const fetchedAt = new Date().toISOString();
  const serviceKey = process.env.TOUR_API_KEY?.trim();

  if (!serviceKey) {
    return {
      source: "unavailable",
      operation: "locationBasedList2",
      items: [],
      fetchedAt,
      message: `TOUR_API_KEY가 설정되면 반경 ${Math.round(radius / 1_000)}km의 한국관광공사 관광정보를 불러옵니다.`,
    };
  }

  const url = new URL(`${TOUR_API_BASE_URL}/locationBasedList2`);
  url.search = new URLSearchParams({
    serviceKey,
    MobileOS: "ETC",
    MobileApp: "Locally",
    _type: "json",
    arrange: "E",
    numOfRows: String(Math.min(Math.max(limit, 1), 50)),
    pageNo: "1",
    mapX: String(longitude),
    mapY: String(latitude),
    radius: String(Math.min(Math.max(radius, 100), 20_000)),
  }).toString();

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = (await response.json()) as TourApiPayload;
    const header = payload.response?.header;
    if (header?.resultCode && header.resultCode !== "0000") {
      throw new Error(header.resultMsg || `TourAPI ${header.resultCode}`);
    }

    const raw = payload.response?.body?.items;
    const items = raw && typeof raw === "object" ? raw.item : [];
    const normalized = (Array.isArray(items) ? items : items ? [items] : [])
      .map(normalizeTourApiPlace)
      .filter((item): item is TourApiPlace => item !== null);

    return { source: "tour-api", operation: "locationBasedList2", items: normalized, fetchedAt };
  } catch (error) {
    const reason = error instanceof Error && error.name === "TimeoutError" ? "응답 시간이 초과되었습니다." : "관광정보를 잠시 불러올 수 없습니다.";
    return { source: "unavailable", operation: "locationBasedList2", items: [], fetchedAt, message: reason };
  }
}

export async function getTourismDetail(contentId: string): Promise<TourApiDetailResponse> {
  const serviceKey = process.env.TOUR_API_KEY?.trim();
  if (!serviceKey) return { source: "unavailable", operation: "detailCommon2", message: "TourAPI 키가 설정되지 않았습니다." };

  const url = new URL(`${TOUR_API_BASE_URL}/detailCommon2`);
  url.search = new URLSearchParams({
    serviceKey,
    MobileOS: "ETC",
    MobileApp: "Locally",
    _type: "json",
    contentId,
  }).toString();

  try {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), next: { revalidate: 60 * 60 * 24 } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = (await response.json()) as TourApiPayload;
    const header = payload.response?.header;
    if (header?.resultCode && header.resultCode !== "0000") throw new Error(header.resultMsg || `TourAPI ${header.resultCode}`);
    const raw = payload.response?.body?.items;
    const item = raw && typeof raw === "object" ? (Array.isArray(raw.item) ? raw.item[0] : raw.item) : undefined;
    if (!item) return { source: "tour-api", operation: "detailCommon2", message: "상세정보가 없습니다." };
    const normalized = normalizeTourApiPlace(item);
    if (!normalized) return { source: "tour-api", operation: "detailCommon2", message: "상세정보가 없습니다." };
    return { source: "tour-api", operation: "detailCommon2", item: { ...normalized, overview: stripHtml(item.overview), homepage: item.homepage } };
  } catch {
    return { source: "unavailable", operation: "detailCommon2", message: "상세정보를 잠시 불러올 수 없습니다." };
  }
}

function normalizeTourApiPlace(item: TourApiItem): TourApiPlace | null {
  const latitude = Number(item.mapy);
  const longitude = Number(item.mapx);
  if (!item.contentid || !item.title || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const distance = Number(item.dist);
  return {
    contentId: item.contentid,
    contentTypeId: item.contenttypeid ?? "",
    title: item.title,
    address: [item.addr1, item.addr2].filter(Boolean).join(" "),
    latitude,
    longitude,
    imageUrl: normalizeImageUrl(item.firstimage),
    thumbnailUrl: normalizeImageUrl(item.firstimage2),
    tel: item.tel || undefined,
    distanceMeters: Number.isFinite(distance) ? Math.round(distance) : undefined,
  };
}

function stripHtml(value?: string) {
  if (!value) return undefined;
  return value.replace(/<br\s*\/?\s*>/gi, " ").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim() || undefined;
}

function normalizeImageUrl(value?: string) {
  return value ? value.replace(/^http:/i, "https:") : undefined;
}
