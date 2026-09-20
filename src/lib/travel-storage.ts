export * from "@/lib/travel-data";
import { parseTravelBackup, type TravelBackup, type SavedItinerary } from "@/lib/travel-data";
import type { RecentView } from "@/lib/travel-mutations";

// In-memory display cache only. Firestore is the sole persistent store.
let owner = "guest", revision = -1;
let backup: TravelBackup | null = null;
let spotsSnapshot = "[]", tripsSnapshot = "[]", viewsSnapshot = "[]";
let state = "idle", message = "";
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;
let queue: Promise<unknown> = Promise.resolve();
let timer: ReturnType<typeof setInterval> | undefined;
let mutationGeneration = 0;
const uid = () => typeof document === "undefined" ? "guest" : document.documentElement.dataset.userScope ?? "guest";
export const isTravelSignedIn = () => uid() !== "guest";
const notify = () => listeners.forEach((listener) => listener());
function reset(next: string) {
  owner = next; revision = -1; backup = null;
  spotsSnapshot = tripsSnapshot = viewsSnapshot = "[]";
}
function accept(data: { uid: string; revision: number; backup: TravelBackup; recentViews?: RecentView[] }, expected: string) {
  if (data.uid !== expected || uid() !== expected) throw new Error("로그인 계정이 변경되었습니다. 새로고침해 주세요.");
  if (data.revision < revision) return;
  backup = parseTravelBackup(JSON.stringify(data.backup)); revision = data.revision;
  spotsSnapshot = JSON.stringify(backup.spots); tripsSnapshot = JSON.stringify(backup.itineraries);
  viewsSnapshot = JSON.stringify(data.recentViews ?? []);
}
function fail(error: unknown) {
  state = "error"; message = error instanceof Error ? error.message : "Firebase 연결을 확인해 주세요."; notify();
}
export async function refreshTravel(): Promise<void> {
  if (loading) return loading;
  if (state === "saving") return;
  const generation = mutationGeneration;
  const expected = uid();
  if (owner !== expected) reset(expected);
  if (expected === "guest") { state = "guest"; message = "로그인하면 찜·일정·최근 본 장소가 Firebase에 저장됩니다."; notify(); return; }
  loading = (async () => {
    state = "loading"; message = "Firebase 자료를 불러오는 중…"; notify();
    try {
      const response = await fetch("/api/account/travel", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) { if (response.status === 401) reset(expected); throw new Error(data.message); }
      if (generation !== mutationGeneration) return;
      accept(data, expected); state = "ready"; message = "Firebase에 연결됨"; notify();
    } catch (error) { if (generation === mutationGeneration) fail(error); }
    finally { loading = null; }
  })();
  return loading;
}
function onFocus() { void refreshTravel(); }
function onVisibility() { if (document.visibilityState === "visible") void refreshTravel(); }
export function subscribeToTravel(onChange: () => void) {
  listeners.add(onChange);
  if (listeners.size === 1) {
    void refreshTravel();
    window.addEventListener("focus", onFocus); document.addEventListener("visibilitychange", onVisibility);
    timer = setInterval(() => { if (document.visibilityState === "visible") void refreshTravel(); }, 30_000);
  }
  return () => {
    listeners.delete(onChange);
    if (!listeners.size) { clearInterval(timer); window.removeEventListener("focus", onFocus); document.removeEventListener("visibilitychange", onVisibility); }
  };
}
export const subscribeToSavedSpots = subscribeToTravel;
export const subscribeToItineraries = subscribeToTravel;
export const getEmptySnapshot = () => "[]";
export const getSavedSpotsSnapshot = () => owner === uid() ? spotsSnapshot : "[]";
export const getItinerariesSnapshot = () => owner === uid() ? tripsSnapshot : "[]";
export const getRecentViewsSnapshot = () => owner === uid() ? viewsSnapshot : "[]";
export const getTravelStatus = () => JSON.stringify({ state, message });
export const getTravelServerStatus = () => '{"state":"idle","message":"Firebase 자료를 확인하는 중…"}';

async function mutate(action: unknown) {
  const expected = uid();
  if (expected === "guest") throw new Error("로그인 후 저장할 수 있습니다.");
  const run = async () => {
    mutationGeneration++;
    if (uid() !== expected) throw new Error("계정이 변경되었습니다. 새로고침해 주세요.");
    if (owner !== expected) reset(expected);
    state = "saving"; message = "Firebase에 저장 중…"; notify();
    try {
      const response = await fetch("/api/account/travel", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ uid: expected, action }) });
      const data = await response.json();
      if (!response.ok) { if (response.status === 401) reset(expected); throw new Error(data.message); }
      accept(data, expected); state = "ready"; message = "Firebase에 저장되었습니다."; notify();
    } catch (error) { fail(error); throw error; }
  };
  const pending = queue.then(run, run);
  queue = pending.catch(() => undefined);
  return pending;
}
export const setSpotSaved = (id: string, saved: boolean) => mutate({ type: "spot", id, saved });
export const storeItinerary = (itinerary: SavedItinerary, existing = false) => mutate({ type: "itinerary", itinerary, existing });
export const removeSavedItinerary = (id: string) => mutate({ type: "remove-itinerary", id });
export const recordViewedSpot = (id: string) => mutate({ type: "view", id });
export const clearRecentViews = () => mutate({ type: "clear-views" });
export const removeRecentViews = (ids: string[]) => mutate({ type: "remove-views", ids });
export async function restoreTravelBackup(incoming: TravelBackup) { await mutate({ type: "import", backup: parseTravelBackup(JSON.stringify(incoming)) }); }
export function createTravelBackup() {
  if (owner !== uid() || !backup || state === "error") throw new Error("Firebase 자료를 먼저 불러와 주세요.");
  return parseTravelBackup(JSON.stringify(backup));
}
