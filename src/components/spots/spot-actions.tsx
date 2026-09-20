"use client";
import { useTravelSnapshot } from "@/components/account/travel-snapshot-provider";
import { useTranslation } from "@/components/common/locale-provider";

import { LocaleText } from "@/components/common/locale-provider";


import { useEffect, useState } from "react";
import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";

import { parseSavedSpotIds, setSpotSaved, recordViewedSpot, isTravelSignedIn } from "@/lib/travel-storage";

export function SpotActions({ spotId, youtubeUrl }: { spotId: string; youtubeUrl?: string }) {
  const { t } = useTranslation();

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const savedSpotsSnapshot = useTravelSnapshot("spots");
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
        <AppIcon name="bookmark" size={18} /> <LocaleText>{saved ? "저장됨" : "장소 저장"}</LocaleText>
      </button>
      <button className="spot-action spot-action-secondary" onClick={shareSpot} type="button">
        <AppIcon name="share" size={18} /><LocaleText>{" 공유 "}</LocaleText></button>
      {youtubeUrl && <a className="spot-action spot-action-secondary spot-action-youtube" href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label={t("유튜브 바로가기 (새 탭)")}>
        <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true"><rect x="0" y="1" width="20" height="14" rx="4" fill="#e62117" /><path d="M8 5v6l5-3Z" fill="white" /></svg><LocaleText>{"유튜브 바로가기 "}</LocaleText></a>}
      <p className="spot-action-message" role="status"><LocaleText>{message}</LocaleText></p>
      {message.includes("로그인") && <Link href="/login"><LocaleText>{"로그인하기"}</LocaleText></Link>}
    </div>
  );
}
