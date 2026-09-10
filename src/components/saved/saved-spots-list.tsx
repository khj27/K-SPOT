"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { exploreContents } from "@/mocks/explore-data";

const SAVED_SPOTS_KEY = "kspot:saved-spots";

export function SavedSpotsList() {
  const savedSpotsSnapshot = useSyncExternalStore(subscribeToSavedSpots, getSavedSpotsSnapshot, getSavedSpotsServerSnapshot);
  const savedIds = parseSavedSpotIds(savedSpotsSnapshot);

  const savedContents = savedIds
    .map((id) => exploreContents.find((content) => content.id === id))
    .filter((content): content is (typeof exploreContents)[number] => content !== undefined);

  if (savedContents.length === 0) {
    return (
      <section className="saved-empty">
        <div className="saved-empty-icon" aria-hidden="true"><AppIcon name="bookmark" size={30} /></div>
        <h2>아직 저장한 장소가 없습니다.</h2>
        <p>마음에 드는 촬영지를 저장하면 이곳에서 한눈에 확인할 수 있어요.</p>
        <Link className="kspot-primary-button saved-empty-link" href="/explore">장소 탐색하기 <AppIcon name="arrow" size={16} /></Link>
      </section>
    );
  }

  function removeSaved(id: string) {
    const nextIds = savedIds.filter((savedId) => savedId !== id);
    window.localStorage.setItem(SAVED_SPOTS_KEY, JSON.stringify(nextIds));
    window.dispatchEvent(new Event("kspot:saved-spots-change"));
  }

  return (
    <div className="saved-content-grid">
      {savedContents.map((content) => (
        <article className="saved-content-card" key={content.id}>
          <Link href={`/spots/${content.id}`} className={`saved-content-visual visual-${content.visual}`}>
            <span>{content.type}</span><strong>{content.title.slice(0, 1)}</strong><small>{content.episode}</small>
          </Link>
          <div className="saved-content-body">
            <p><AppIcon name="pin" size={14} /> {content.region} · {content.spotName}</p>
            <h2><Link href={`/spots/${content.id}`}>{content.spotName}</Link></h2>
            <span>{content.title} · {content.description}</span>
            <div className="saved-card-footer">
              <Link href={`/spots/${content.id}`}>상세 보기 <AppIcon name="arrow" size={14} /></Link>
              <button onClick={() => removeSaved(content.id)} type="button" aria-label={`${content.spotName} 저장 해제`}><AppIcon name="bookmark" size={16} /> 저장 해제</button>
            </div>
          </div>
        </article>
      ))}
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

function parseSavedSpotIds(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}
