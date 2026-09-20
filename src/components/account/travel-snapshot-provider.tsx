"use client";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { getSavedSpotsSnapshot, getItinerariesSnapshot, getRecentViewsSnapshot, getTourPlacesSnapshot, hasLoadedTravel, subscribeToTravel } from "@/lib/travel-storage";
import type { TravelDocument } from "@/lib/travel-mutations";
import { useAuth } from "@/components/account/auth-provider";
export type InitialTravel = { uid: string; data: TravelDocument } | null;
const TravelContext = createContext<InitialTravel>(null);
export function TravelSnapshotProvider({ initial, children }: { initial: InitialTravel; children: ReactNode }) { return <TravelContext.Provider value={initial}>{children}</TravelContext.Provider>; }
export function useTravelSnapshot(kind: "spots" | "trips" | "views" | "tours") {
  const initial = useContext(TravelContext);
  const { user } = useAuth();
  const data = initial?.uid === user?.uid ? initial?.data : undefined;
  const initialValue = JSON.stringify(kind === "spots" ? data?.backup.spots ?? [] : kind === "trips" ? data?.backup.itineraries ?? [] : kind === "views" ? data?.recentViews ?? [] : data?.backup.tourPlaces ?? []);
  const getter = { spots: getSavedSpotsSnapshot, trips: getItinerariesSnapshot, views: getRecentViewsSnapshot, tours: getTourPlacesSnapshot }[kind];
  return useSyncExternalStore(subscribeToTravel, () => hasLoadedTravel() ? getter() : initialValue, () => initialValue);
}
