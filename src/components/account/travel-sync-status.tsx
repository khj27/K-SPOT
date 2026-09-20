"use client";
import { LocaleText } from "@/components/common/locale-provider";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { subscribeToTravel, getTravelStatus, getTravelServerStatus, refreshTravel } from "@/lib/travel-storage";

export function TravelSyncStatus() {
  const status = JSON.parse(useSyncExternalStore(subscribeToTravel, getTravelStatus, getTravelServerStatus)) as { state: string; message: string };
  if (["ready", "idle", "guest"].includes(status.state)) return null;
  const message = status.state === "loading" ? "내 여행을 불러오는 중…" : status.state === "saving" ? "변경사항을 저장하는 중…" : status.message;
  return <div className="travel-sync-status" role="status"><span><LocaleText>{message}</LocaleText></span>{status.state === "error" && <button type="button" onClick={() => void refreshTravel()}><LocaleText>{"다시 불러오기"}</LocaleText></button>}{status.state === "guest" && <Link href="/login"><LocaleText>{"로그인"}</LocaleText></Link>}</div>;
}
