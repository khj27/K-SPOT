export const SAVED_SPOTS_KEY = "kspot:saved-spots";
export const SAVED_ITINERARIES_KEY = "kspot:saved-itineraries";

export type SavedItinerary = {
  id: string; savedAt: string; days: number; region: string;
  transport: string; companion: string; types: string[]; placeIds: string[];
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
        && Number.isInteger(item.days) && item.days >= 1 && item.days <= 3
        && typeof item.region === "string" && typeof item.transport === "string" && typeof item.companion === "string"
        && Array.isArray(item.types) && item.types.every((type: unknown) => typeof type === "string")
        && Array.isArray(item.placeIds) && item.placeIds.every((id: unknown) => typeof id === "string" && !!id)
        && new Set(item.placeIds).size === item.placeIds.length;
    });
  } catch { return []; }
}

export function readTravelStorage(key: string): string {
  try { return window.localStorage.getItem(key) ?? "[]"; } catch { return "[]"; }
}

export function writeTravelStorage(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); }
  catch { throw new Error("브라우저 저장 공간에 접근하지 못했습니다. 저장 공간과 사이트 저장 허용 설정을 확인해 주세요."); }
  window.dispatchEvent(new Event(`${key}-change`));
}

export const getSavedSpotsSnapshot = () => readTravelStorage(SAVED_SPOTS_KEY);
export const getItinerariesSnapshot = () => readTravelStorage(SAVED_ITINERARIES_KEY);
export const getEmptySnapshot = () => "[]";
function subscribe(key: string, onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(`${key}-change`, onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener(`${key}-change`, onChange); };
}
export const subscribeToSavedSpots = (onChange: () => void) => subscribe(SAVED_SPOTS_KEY, onChange);
export const subscribeToItineraries = (onChange: () => void) => subscribe(SAVED_ITINERARIES_KEY, onChange);

export function storeItinerary(value: SavedItinerary) {
  // Read immediately before writing so changes made in another tab are retained.
  const existing = parseItineraries(readTravelStorage(SAVED_ITINERARIES_KEY));
  writeTravelStorage(SAVED_ITINERARIES_KEY, [value, ...existing.filter((item) => item.id !== value.id)]);
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
  return { format: "kspot-travel", version: 1, exportedAt: value.exportedAt, spots: value.spots, itineraries: trips.map(({ id, savedAt, days, region, transport, companion, types, placeIds }) => ({ id, savedAt, days, region, transport, companion, types, placeIds })) };
}

export function createTravelBackup(): TravelBackup {
  // Read directly: blocked storage must not become a seemingly successful empty backup.
  let spots, itineraries;
  try { spots = JSON.parse(window.localStorage.getItem(SAVED_SPOTS_KEY) ?? "[]"); itineraries = JSON.parse(window.localStorage.getItem(SAVED_ITINERARIES_KEY) ?? "[]"); }
  catch { throw new Error("현재 여행 데이터를 읽지 못했습니다. 브라우저 저장 설정과 데이터를 확인해 주세요."); }
  return parseTravelBackup(JSON.stringify({ format: "kspot-travel", version: 1, exportedAt: new Date().toISOString(), spots, itineraries }));
}

export function restoreTravelBackup(backup: TravelBackup) {
  const incoming = parseTravelBackup(JSON.stringify(backup));
  const current = createTravelBackup();
  const spots = [...new Set([...current.spots, ...incoming.spots])];
  const existingIds = new Set(current.itineraries.map((item) => item.id));
  const additions = incoming.itineraries.filter((item) => !existingIds.has(item.id));
  const merged = parseTravelBackup(JSON.stringify({ ...current, spots, itineraries: [...current.itineraries, ...additions] }));
  try {
    window.localStorage.setItem(SAVED_SPOTS_KEY, JSON.stringify(merged.spots));
    window.localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(merged.itineraries));
  } catch {
    try {
      window.localStorage.setItem(SAVED_SPOTS_KEY, JSON.stringify(current.spots));
      window.localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(current.itineraries));
    } catch { throw new Error("복원 중 저장소 접근이 차단되었습니다. 일부 항목만 반영되었을 수 있습니다. 저장 설정을 확인하고 다시 복원해 주세요."); }
    throw new Error("저장 공간 부족 또는 접근 제한으로 복원하지 못했습니다. 기존 데이터는 유지됩니다.");
  } finally {
    window.dispatchEvent(new Event(`${SAVED_SPOTS_KEY}-change`));
    window.dispatchEvent(new Event(`${SAVED_ITINERARIES_KEY}-change`));
  }
  return { spots: merged.spots.length - current.spots.length, itineraries: additions.length };
}
