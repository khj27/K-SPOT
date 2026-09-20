"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { subscribeToTravel, getTravelStatus, getTravelServerStatus, refreshTravel } from "@/lib/travel-storage";

export function TravelSyncStatus() {
  const status = JSON.parse(useSyncExternalStore(subscribeToTravel, getTravelStatus, getTravelServerStatus)) as { state: string; message: string };
  if (["ready", "idle", "guest"].includes(status.state)) return null;
  const message = status.state === "loading" ? "내 여행을 불러오는 중…" : status.state === "saving" ? "변경사항을 저장하는 중…" : status.message;
  return <div className="travel-sync-status" role="status"><span>{message}</span>{status.state === "error" && <button type="button" onClick={() => void refreshTravel()}>다시 불러오기</button>}{status.state === "guest" && <Link href="/login">로그인</Link>}</div>;
}
