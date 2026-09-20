"use client";
import Link from "next/link";
import { useState } from "react";
import { useTravelSnapshot } from "@/components/account/travel-snapshot-provider";
import { useTranslation } from "@/components/common/locale-provider";
import { setTourPlaceSaved, type SavedTourPlace } from "@/lib/travel-storage";
export function TourBookmarkButton({ place }: { place: SavedTourPlace }) {
  const { t } = useTranslation();
  const saved = (JSON.parse(useTravelSnapshot("tours")) as SavedTourPlace[]).some((item) => item.contentId === place.contentId);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return <div className="tour-bookmark"><button type="button" className="ui-button" aria-pressed={saved} disabled={busy} onClick={async () => { setBusy(true); try { await setTourPlaceSaved(place, !saved); setMessage(saved ? "찜한 장소에서 삭제되었습니다." : "찜한 장소에 추가되었습니다."); } catch (error) { setMessage(error instanceof Error ? error.message : "저장에 실패했습니다."); } finally { setBusy(false); } }}>{saved ? "♥ " : "♡ "}{t(busy ? "처리 중…" : saved ? "찜됨" : "찜하기")}</button><span role="status">{t(message)}</span>{message.includes("로그인") && <Link href="/login">{t("로그인하기")}</Link>}</div>;
}
