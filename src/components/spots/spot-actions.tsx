"use client";

import { useState, useSyncExternalStore } from "react";

import { AppIcon } from "@/components/common/app-icon";

import { SAVED_SPOTS_KEY, subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot, parseSavedSpotIds, writeTravelStorage } from "@/lib/travel-storage";

export function SpotActions({ spotId }: { spotId: string }) {
  const [message, setMessage] = useState("");
  const savedSpotsSnapshot = useSyncExternalStore(subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot);
  const saved = parseSavedSpotIds(savedSpotsSnapshot).includes(spotId);

  function toggleSaved() {
    const savedSpots = parseSavedSpotIds(getSavedSpotsSnapshot());
    const nextSaved = savedSpots.includes(spotId)
      ? savedSpots.filter((id) => id !== spotId)
      : [...savedSpots, spotId];

    try { writeTravelStorage(SAVED_SPOTS_KEY, nextSaved); setMessage(saved ? "저장을 해제했습니다." : "이 브라우저에 장소를 저장했습니다."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "저장에 실패했습니다."); }
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
      <button className={saved ? "spot-action is-saved" : "spot-action"} onClick={toggleSaved} type="button" aria-pressed={saved}>
        <AppIcon name="bookmark" size={18} /> {saved ? "저장됨" : "장소 저장"}
      </button>
      <button className="spot-action spot-action-secondary" onClick={shareSpot} type="button">
        <AppIcon name="share" size={18} /> 공유
      </button>
      <p className="spot-action-message" role="status">{message}</p>
    </div>
  );
}
