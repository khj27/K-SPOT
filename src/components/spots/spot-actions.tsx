"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";

import { subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot, parseSavedSpotIds, setSpotSaved, recordViewedSpot, isTravelSignedIn } from "@/lib/travel-storage";

export function SpotActions({ spotId }: { spotId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const savedSpotsSnapshot = useSyncExternalStore(subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot);
  const saved = parseSavedSpotIds(savedSpotsSnapshot).includes(spotId);

  useEffect(() => { if (isTravelSignedIn()) void recordViewedSpot(spotId).catch(() => { /* The global sync status displays failure. */ }); }, [spotId]);
  async function toggleSaved() {
    setBusy(true);
    try { await setSpotSaved(spotId, !saved); setMessage(saved ? "Firebase에서 찜을 해제했습니다." : "Firebase에 장소를 저장했습니다."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "저장에 실패했습니다."); }
    finally { setBusy(false); }
  }

  async function shareSpot() {
    try {
    if (navigator.share) {
      await navigator.share({ title: "K-SPOT 장소", url: window.location.href });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setMessage("장소 주소를 복사했습니다.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage("공유하지 못했습니다. 브라우저 주소창의 주소를 복사해 주세요.");
    }
  }

  return (
    <div className="spot-actions">
      <button className={saved ? "spot-action is-saved" : "spot-action"} onClick={toggleSaved} disabled={busy} type="button" aria-pressed={saved}>
        <AppIcon name="bookmark" size={18} /> {saved ? "저장됨" : "장소 저장"}
      </button>
      <button className="spot-action spot-action-secondary" onClick={shareSpot} type="button">
        <AppIcon name="share" size={18} /> 공유
      </button>
      <p className="spot-action-message" role="status">{message}</p>
      {message.includes("로그인") && <Link href="/login">로그인하기</Link>}
    </div>
  );
}
