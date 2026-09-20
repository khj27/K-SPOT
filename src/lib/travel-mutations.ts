import { parseTravelBackup, parseTourPlace, type TravelBackup } from "@/lib/travel-data";

export type RecentView = { spotId: string; viewedAt: string };
export type TravelDocument = { backup: TravelBackup; recentViews: RecentView[]; revision: number };
export function emptyTravel(): TravelBackup {
  return { format: "kspot-travel", version: 1, exportedAt: new Date().toISOString(), spots: [], itineraries: [] };
}
export function applyTravelMutation(current: TravelDocument, value: unknown): TravelDocument {
  if (!value || typeof value !== "object") throw new Error("INVALID_ACTION");
  const action = value as Record<string, unknown>;
  let backup = parseTravelBackup(JSON.stringify(current.backup));
  let recentViews = [...current.recentViews];
  const id = (value: unknown) => {
    if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,160}$/.test(value)) throw new Error("INVALID_ID");
    return value;
  };
  switch (action.type) {
    case "tour-spot": {
      if (typeof action.saved !== "boolean") throw new Error("INVALID_SAVED");
      const place = parseTourPlace(action.place);
      const others = (backup.tourPlaces ?? []).filter((item) => item.contentId !== place.contentId);
      backup.tourPlaces = action.saved ? [...others, place] : others;
      break;
    }
    case "spot": {
      const spot = id(action.id);
      if (typeof action.saved !== "boolean") throw new Error("INVALID_SAVED");
      backup.spots = action.saved ? [...new Set([...backup.spots, spot])] : backup.spots.filter((item) => item !== spot);
      break;
    }
    case "itinerary": {
      const checked = parseTravelBackup(JSON.stringify({ ...emptyTravel(), itineraries: [action.itinerary] })).itineraries[0];
      id(checked.id);
      // An edit must not silently resurrect an itinerary removed on another device.
      if (action.existing === true && !backup.itineraries.some((item) => item.id === checked.id)) throw new Error("ITINERARY_REMOVED");
      backup.itineraries = [checked, ...backup.itineraries.filter((item) => item.id !== checked.id)];
      break;
    }
    case "remove-itinerary": {
      const key = id(action.id);
      backup.itineraries = backup.itineraries.filter((item) => item.id !== key);
      break;
    }
    case "view": {
      const spotId = id(action.id);
      recentViews = [{ spotId, viewedAt: new Date().toISOString() }, ...recentViews.filter((item) => item.spotId !== spotId)].slice(0, 50);
      break;
    }
    case "clear-views": recentViews = []; break;
    case "remove-views": {
      if (!Array.isArray(action.ids) || action.ids.length < 1 || action.ids.length > 50) throw new Error("INVALID_IDS");
      const removed = new Set(action.ids.map(id));
      recentViews = recentViews.filter((view) => !removed.has(view.spotId));
      break;
    }
    case "import": {
      const incoming = parseTravelBackup(JSON.stringify(action.backup));
      const ids = new Set(backup.itineraries.map((item) => item.id));
      backup.spots = [...new Set([...backup.spots, ...incoming.spots])];
      backup.itineraries = [...backup.itineraries, ...incoming.itineraries.filter((item) => !ids.has(item.id))];
      const tourIds = new Set((backup.tourPlaces ?? []).map((item) => item.contentId));
      if (incoming.tourPlaces) backup.tourPlaces = [...(backup.tourPlaces ?? []), ...incoming.tourPlaces.filter((item) => !tourIds.has(item.contentId))];
      break;
    }
    default: throw new Error("INVALID_ACTION");
  }
  backup = parseTravelBackup(JSON.stringify({ ...backup, exportedAt: new Date().toISOString() }));
  const result = { backup, recentViews, revision: current.revision + 1 };
  if (new TextEncoder().encode(JSON.stringify(result)).length > 400_000) throw new Error("TOO_LARGE");
  return result;
}
