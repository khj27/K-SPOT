"use client";
import { LocaleText } from "@/components/common/locale-provider";

import { useSyncExternalStore } from "react";
import { subscribeToTravel, getTravelStatus, getTravelServerStatus, refreshTravel } from "@/lib/travel-storage";

export function TravelSyncStatus() {
  const status = JSON.parse(useSyncExternalStore(subscribeToTravel, getTravelStatus, getTravelServerStatus)) as { state: string; message: string };
  // Keep the subscription active without interrupting the page during background sync.
  if (status.state !== "error") return null;
  return <div className="travel-sync-status" role="status"><span><LocaleText>{status.message}</LocaleText></span><button type="button" onClick={() => void refreshTravel()}><LocaleText>{"다시 불러오기"}</LocaleText></button></div>;
}
