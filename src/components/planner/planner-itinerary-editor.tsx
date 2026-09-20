"use client";
import { useTranslation } from "@/components/common/locale-provider";

import { LocaleText } from "@/components/common/locale-provider";

import Link from "next/link";
import { useRef, useState } from "react";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import type { RankedPlace } from "@/lib/recommendation";
import { storeItinerary, removeSavedItinerary } from "@/lib/travel-storage";
import type { SavedTourStop } from "@/lib/travel-data";
import { dayDate, distributeDays } from "@/lib/trip-dates";
import { ItineraryTourStops } from "@/components/planner/itinerary-tour-stops";

type Props = {
  recommendations: RankedPlace[]; candidates?: RankedPlace[]; days: number; region: string;
  transport: string; companion: string; types: string[]; savedId?: string;
  startDate?: string; endDate?: string; initialPlaceDays?: number[]; initialTourStops?: SavedTourStop[];
};
type Stop = RankedPlace & { day: number };
export function PlannerItineraryEditor({ recommendations, candidates = recommendations, days, region, transport, companion, types, savedId, startDate, endDate, initialPlaceDays, initialTourStops = [] }: Props) {
  const { t } = useTranslation();

  const [itinerary, setItinerary] = useState<Stop[]>(() => recommendations.map((item, index) => ({ ...item, day: initialPlaceDays?.[index] ?? distributeDays(recommendations.length, days)[index] })));
  const [tourStops, setTourStops] = useState(initialTourStops);
  const [saved, setSaved] = useState(Boolean(savedId));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const itineraryId = useRef(savedId);
  const persisted = useRef(Boolean(savedId));

  async function update(next: Stop[], nextStops = tourStops, forceSave = false) {
    if (busy) return;
    const validStops = nextStops.filter((stop) => next.some(({ place }) => place.id === stop.anchorId));
    if (!persisted.current && !forceSave) { setItinerary(next); setTourStops(validStops); setMessage("변경한 일정을 저장해 주세요."); return; }
    setBusy(true); setMessage("");
    itineraryId.current ??= `itinerary-${crypto.randomUUID()}`;
    try {
      await storeItinerary({ id: itineraryId.current, savedAt: new Date().toISOString(), days, region, transport, companion, types, placeIds: next.map(({ place }) => place.id), placeDays: next.map(({ day }) => day), tourStops: validStops, ...(startDate && endDate ? { startDate, endDate } : {}) }, persisted.current);
      persisted.current = true; setSaved(true); setItinerary(next); setTourStops(validStops); setMessage("일정을 저장했습니다.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "저장하지 못했습니다. 다시 시도해 주세요."); }
    finally { setBusy(false); }
  }
  async function toggleSaved() {
    if (busy) return;
    if (!saved) return update(itinerary, tourStops, true);
    setBusy(true);
    try { await removeSavedItinerary(itineraryId.current!); persisted.current = false; setSaved(false); setMessage("일정 저장을 취소했습니다. 다시 눌러 저장할 수 있습니다."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "저장 취소에 실패했습니다."); }
    finally { setBusy(false); }
  }
  function move(index: number, direction: number) {
    const indices = itinerary.map((stop, i) => stop.day === itinerary[index].day ? i : -1).filter((i) => i >= 0);
    const target = indices[indices.indexOf(index) + direction];
    if (target === undefined) return;
    const next = [...itinerary]; [next[index], next[target]] = [next[target], next[index]];
    void update(next);
  }
  const remaining = candidates.filter(({ place }) => !itinerary.some((stop) => stop.place.id === place.id));
  return <>
    <div className="planner-edit-toolbar"><span>{days}<LocaleText>{"일 · 촬영지 "}</LocaleText>{itinerary.length}<LocaleText>{"곳 · 주변 관광지 "}</LocaleText>{tourStops.length}<LocaleText>{"곳"}</LocaleText></span><button className={`planner-save-button ${saved ? "is-saved" : ""}`} type="button" aria-pressed={saved} disabled={busy} onClick={() => void toggleSaved()}><LocaleText>{busy ? "처리 중…" : saved ? "일정 저장됨 · 저장 취소" : "일정 저장"}</LocaleText></button></div>
    <p role="status"><LocaleText>{message || (saved ? "수정한 내용은 자동으로 저장됩니다." : "날짜별 장소를 조정하고 로그인 후 저장하세요.")}</LocaleText></p>
    <nav className="trip-day-nav" aria-label={t("일정 날짜")}>{Array.from({ length: days }, (_, day) => <a key={day} href={`#trip-day-${day + 1}`}>DAY {day + 1}{startDate ? ` · ${dayDate(startDate, day).slice(5)}` : ""}</a>)}</nav>
    <div className="trip-days">{Array.from({ length: days }, (_, day) => {
      const stops = itinerary.filter((stop) => stop.day === day);
      return <section className="trip-day-section" id={`trip-day-${day + 1}`} key={day}>
        <header><div><p className="kspot-eyebrow">DAY {day + 1}</p><h2><LocaleText>{startDate ? dayDate(startDate, day) : `${day + 1}일차`}</LocaleText></h2></div><span><LocaleText>{"촬영지 "}</LocaleText>{stops.length}<LocaleText>{"곳"}</LocaleText></span></header>
        {!stops.length && <div className="trip-free-day"><h3><LocaleText>{"자유 일정"}</LocaleText></h3><p><LocaleText>{"이 날짜에는 아직 담은 장소가 없습니다. 아래 후보에서 추가하거나 다른 날짜의 장소를 옮겨 주세요."}</LocaleText></p></div>}
        {stops.map((stop, order) => {
          const { place, reasons } = stop;
          const index = itinerary.indexOf(stop);
          return <article className="trip-stop-card" key={place.id}>
            <div className="planner-stop"><span className="trip-stop-number">{order + 1}</span><div className={`planner-stop-visual visual-${place.visual}`}><ContentThumbnail src={place.imageUrl} title={place.title} /></div><div className="planner-stop-content"><p>{place.region} · <LocaleText>{place.type}</LocaleText></p><h3>{place.spotName}</h3><span>{place.title}</span><Link href={`/spots/${place.id}`}><LocaleText>{"장소·지도 보기"}</LocaleText></Link></div></div>
            <div className="recommendation-reasons">{reasons.map((reason) => <small key={reason}><LocaleText>{reason}</LocaleText></small>)}</div>
            <div className="trip-stop-actions"><label><LocaleText>{"방문 날짜"}</LocaleText><select aria-label={t(`${place.spotName} 방문 날짜`)} disabled={busy} value={day} onChange={(event) => void update(itinerary.map((item, i) => i === index ? { ...item, day: Number(event.target.value) } : item))}>{Array.from({ length: days }, (_, d) => <option key={d} value={d}>DAY {d + 1}{startDate ? ` · ${dayDate(startDate, d)}` : ""}</option>)}</select></label><button disabled={busy || order === 0} onClick={() => move(index, -1)} aria-label={t(`${place.spotName} 앞으로 이동`)}>↑</button><button disabled={busy || order === stops.length - 1} onClick={() => move(index, 1)} aria-label={t(`${place.spotName} 뒤로 이동`)}>↓</button><button disabled={busy} onClick={() => void update(itinerary.filter((item) => item !== stop))}><LocaleText>{"일정에서 제외"}</LocaleText></button></div>
            <ItineraryTourStops place={place} stops={tourStops} busy={busy} onChange={(next) => update(itinerary, next)} />
          </article>;
        })}
        <label className="trip-add-place"><LocaleText>{"촬영지 추가"}</LocaleText><select aria-label={t(`DAY ${day + 1} 촬영지 추가`)} value="" disabled={busy || !remaining.length || itinerary.length >= 100} onChange={(event) => { const item = remaining.find(({ place }) => place.id === event.target.value); if (item) void update([...itinerary, { ...item, day }]); }}><option value=""><LocaleText>{remaining.length ? "추가할 장소를 선택하세요" : "추가할 촬영지 후보가 없습니다"}</LocaleText></option>{remaining.map(({ place }) => <option key={place.id} value={place.id}>{place.spotName} · {place.title}</option>)}</select></label>
      </section>;
    })}</div>
  </>;
}
