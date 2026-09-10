"use client";

import { useSyncExternalStore } from "react";

import { AppIcon } from "@/components/common/app-icon";

const SAVED_SPOTS_KEY = "kspot:saved-spots";

export function SpotActions({ spotId }: { spotId: string }) {
  const savedSpotsSnapshot = useSyncExternalStore(subscribeToSavedSpots, getSavedSpotsSnapshot, getSavedSpotsServerSnapshot);
  const saved = parseSavedSpots(savedSpotsSnapshot).includes(spotId);

  function toggleSaved() {
    const savedSpots = parseSavedSpots(savedSpotsSnapshot);
    const nextSaved = savedSpots.includes(spotId)
      ? savedSpots.filter((id) => id !== spotId)
      : [...savedSpots, spotId];

    window.localStorage.setItem(SAVED_SPOTS_KEY, JSON.stringify(nextSaved));
    window.dispatchEvent(new Event("kspot:saved-spots-change"));
  }

  async function shareSpot() {
    if (navigator.share) {
      await navigator.share({ title: "K-SPOT 장소", url: window.location.href });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="spot-actions">
      <button className={saved ? "spot-action is-saved" : "spot-action"} onClick={toggleSaved} type="button" aria-pressed={saved}>
        <AppIcon name="bookmark" size={18} /> {saved ? "저장됨" : "장소 저장"}
      </button>
      <button className="spot-action spot-action-secondary" onClick={shareSpot} type="button">
        <AppIcon name="share" size={18} /> 공유
      </button>
    </div>
  );
}

function subscribeToSavedSpots(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("kspot:saved-spots-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("kspot:saved-spots-change", onChange);
  };
}

function getSavedSpotsSnapshot(): string {
  return window.localStorage.getItem(SAVED_SPOTS_KEY) ?? "[]";
}

function getSavedSpotsServerSnapshot(): string {
  return "[]";
}

function parseSavedSpots(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}
