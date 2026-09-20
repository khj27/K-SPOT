import { tripDays } from "@/lib/trip-dates";
export type SavedTourStop = {
  contentId: string; anchorId: string; title: string; address: string;
  latitude: number; longitude: number; source: "tour-api";
};

function parseTourStops(value: unknown, placeIds: string[]): SavedTourStop[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 10) throw new Error("관광지는 일정당 최대 10곳입니다.");
  const seen = new Set<string>();
  return value.map((item) => {
    if (!item || typeof item !== "object" || typeof item.contentId !== "string" || !/^\d{1,20}$/.test(item.contentId)
      || seen.has(item.contentId) || !placeIds.includes(item.anchorId) || item.source !== "tour-api"
      || typeof item.title !== "string" || !item.title.trim() || item.title.length > 500
      || typeof item.address !== "string" || item.address.length > 1000
      || !Number.isFinite(item.latitude) || item.latitude < -90 || item.latitude > 90
      || !Number.isFinite(item.longitude) || item.longitude < -180 || item.longitude > 180) throw new Error("저장 관광지 정보가 올바르지 않습니다.");
    seen.add(item.contentId);
    return { contentId: item.contentId, anchorId: item.anchorId, title: item.title, address: item.address, latitude: item.latitude, longitude: item.longitude, source: "tour-api" };
  });
}

export type SavedItinerary = {
  id: string; savedAt: string; days: number; region: string;
  transport: string; companion: string; types: string[]; placeIds: string[]; tourStops?: SavedTourStop[];
  startDate?: string; endDate?: string; placeDays?: number[];
};

export function parseSavedSpotIds(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === "string" && id.length > 0))] : [];
  } catch { return []; }
}

export function parseItineraries(value: string): SavedItinerary[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedItinerary => {
      if (!item || typeof item !== "object") return false;
      return typeof item.id === "string" && !!item.id && typeof item.savedAt === "string"
        && Number.isInteger(item.days) && item.days >= 1 && item.days <= 31
        && typeof item.region === "string" && typeof item.transport === "string" && typeof item.companion === "string"
        && Array.isArray(item.types) && item.types.every((type: unknown) => typeof type === "string")
        && Array.isArray(item.placeIds) && item.placeIds.every((id: unknown) => typeof id === "string" && !!id)
        && new Set(item.placeIds).size === item.placeIds.length
        && validSchedule(item);
    });
  } catch { return []; }
}

export const BACKUP_MAX_BYTES = 2 * 1024 * 1024;
export type TravelBackup = { format: "kspot-travel"; version: 1; exportedAt: string; spots: string[]; itineraries: SavedItinerary[] };

export function parseTravelBackup(text: string): TravelBackup {
  if (new TextEncoder().encode(text).length > BACKUP_MAX_BYTES) throw new Error("백업 파일은 2MB 이하여야 합니다.");
  let value;
  try { value = JSON.parse(text); } catch { throw new Error("JSON 백업 파일을 읽을 수 없습니다."); }
  if (!value || value.format !== "kspot-travel" || value.version !== 1 || typeof value.exportedAt !== "string" || !Number.isFinite(Date.parse(value.exportedAt))) throw new Error("지원하지 않는 K-SPOT 백업 형식입니다.");
  const string = (item: unknown) => typeof item === "string" && item.length > 0 && item.length <= 500;
  if (!Array.isArray(value.spots) || value.spots.length > 1000 || !value.spots.every(string) || new Set(value.spots).size !== value.spots.length) throw new Error("저장 장소 데이터가 올바르지 않습니다. 최대 1,000개를 지원합니다.");
  if (!Array.isArray(value.itineraries) || value.itineraries.length > 1000) throw new Error("저장 일정 데이터가 올바르지 않습니다. 최대 1,000개를 지원합니다.");
  const trips = parseItineraries(JSON.stringify(value.itineraries));
  if (trips.length !== value.itineraries.length || new Set(trips.map((item) => item.id)).size !== trips.length || trips.some((item) => ![item.id, item.region, item.transport, item.companion].every(string) || !Number.isFinite(Date.parse(item.savedAt)) || item.placeIds.length > 100 || !item.placeIds.every(string) || item.types.length > 20 || !item.types.every(string))) throw new Error("저장 일정에 잘못된 값 또는 중복 ID가 있습니다.");
  // Export only travel fields, never arbitrary browser or account data.
  return { format: "kspot-travel", version: 1, exportedAt: value.exportedAt, spots: value.spots, itineraries: trips.map(({ id, savedAt, days, region, transport, companion, types, placeIds, tourStops, startDate, endDate, placeDays }) => ({ id, savedAt, days, region, transport, companion, types, placeIds, ...(startDate && endDate ? { startDate, endDate } : {}), ...(placeDays ? { placeDays } : {}), ...(tourStops === undefined ? {} : { tourStops: parseTourStops(tourStops, placeIds) }) })) };
}

function validSchedule(item: SavedItinerary): boolean {
  if (item.startDate !== undefined || item.endDate !== undefined) {
    try { if (typeof item.startDate !== "string" || typeof item.endDate !== "string" || tripDays(item.startDate, item.endDate) !== item.days) return false; }
    catch { return false; }
  }
  return item.placeDays === undefined || (Array.isArray(item.placeDays) && item.placeDays.length === item.placeIds.length && item.placeDays.every((day) => Number.isInteger(day) && day >= 0 && day < item.days));
}
