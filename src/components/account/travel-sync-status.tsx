"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { subscribeToTravel, getTravelStatus, getTravelServerStatus, refreshTravel } from "@/lib/travel-storage";

export function TravelSyncStatus() {
  const status = JSON.parse(useSyncExternalStore(subscribeToTravel, getTravelStatus, getTravelServerStatus)) as { state: string; message: string };
  return <div className="travel-sync-status" role="status"><span>{status.message}</span>{status.state === "error" && <button type="button" onClick={() => void refreshTravel()}>다시 불러오기</button>}{status.state === "guest" && <Link href="/login">로그인</Link>}</div>;
}
