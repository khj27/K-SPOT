"use client";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { getSavedSpotsSnapshot, getItinerariesSnapshot, getRecentViewsSnapshot, getTourPlacesSnapshot, hasLoadedTravel, subscribeToTravel } from "@/lib/travel-storage";
import type { TravelDocument } from "@/lib/travel-mutations";
import { useAuth } from "@/components/account/auth-provider";
import Link from "next/link";
import { useTranslation } from "@/components/common/locale-provider";
import { getTravelStatus, getTravelServerStatus, refreshTravel } from "@/lib/travel-storage";
export type InitialTravel = { uid: string; data: TravelDocument } | null;
const TravelContext = createContext<InitialTravel>(null);
export function TravelSnapshotProvider({ initial, children }: { initial: InitialTravel; children: ReactNode }) { return <TravelContext.Provider value={initial}>{children}</TravelContext.Provider>; }
export function TravelDataBoundary({ children }: { children: ReactNode }) {
  const initial = useContext(TravelContext);
  const { user } = useAuth();
  const { t } = useTranslation();
  const status = JSON.parse(useSyncExternalStore(subscribeToTravel, getTravelStatus, getTravelServerStatus)) as { state: string };
  if (!user) return <section className="saved-empty"><p>{t("로그인 후 이용해 주세요.")}</p><Link className="ui-button" href="/login">{t("로그인하기")}</Link></section>;
  if (initial?.uid === user.uid || hasLoadedTravel()) return children;
  return <section className="saved-empty" role="status"><p>{t(status.state === "error" ? "저장 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." : "저장 자료를 확인하고 있습니다.")}</p>{status.state === "error" && <button className="ui-button" type="button" onClick={() => void refreshTravel()}>{t("다시 불러오기")}</button>}</section>;
}
export function useTravelSnapshot(kind: "spots" | "trips" | "views" | "tours") {
  const initial = useContext(TravelContext);
  const { user } = useAuth();
  const data = initial?.uid === user?.uid ? initial?.data : undefined;
  const initialValue = JSON.stringify(kind === "spots" ? data?.backup.spots ?? [] : kind === "trips" ? data?.backup.itineraries ?? [] : kind === "views" ? data?.recentViews ?? [] : data?.backup.tourPlaces ?? []);
  const getter = { spots: getSavedSpotsSnapshot, trips: getItinerariesSnapshot, views: getRecentViewsSnapshot, tours: getTourPlacesSnapshot }[kind];
  return useSyncExternalStore(subscribeToTravel, () => hasLoadedTravel() ? getter() : initialValue, () => initialValue);
}
