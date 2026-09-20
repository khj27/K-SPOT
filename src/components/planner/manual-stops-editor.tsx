"use client";
import { useState } from "react";
import { useTranslation } from "@/components/common/locale-provider";
import { VisitTimeFields } from "@/components/planner/visit-time-fields";
import type { ManualStop } from "@/lib/manual-stops";

export function ManualStopsEditor({ day, days, stops, busy, onChange }: { day: number; days: number; stops: ManualStop[]; busy: boolean; onChange: (stops: ManualStop[]) => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const selected = stops.filter(item => item.day === day);
  const patch = (id: string, value: Partial<ManualStop>) => onChange(stops.map(item => item.id === id ? { ...item, ...value } : item));
  function move(id: string, offset: number) {
    const target = selected[selected.findIndex(item => item.id === id) + offset];
    if (!target) return;
    const next = [...stops], from = next.findIndex(item => item.id === id), to = next.findIndex(item => item.id === target.id);
    [next[from], next[to]] = [next[to], next[from]]; onChange(next);
  }
  return <section className="manual-stops-editor"><h3>{t("직접 입력한 장소")}</h3>
    {selected.map((item, index) => <article className="trip-stop-card" key={item.id}>
      <div className="manual-place-fields"><label>{t("장소 이름")}<input aria-label={`${t("장소 이름")} ${index + 1}`} maxLength={120} value={item.title} disabled={busy} onChange={event => patch(item.id, { title: event.target.value })} /></label><label>{t("주소 또는 메모")}<input maxLength={500} value={item.address} disabled={busy} onChange={event => patch(item.id, { address: event.target.value })} /></label></div>
      <VisitTimeFields value={item} disabled={busy} onChange={time => patch(item.id, time)} />
      <div className="trip-stop-actions"><label>{t("방문 날짜")}<select value={item.day} disabled={busy} onChange={event => patch(item.id, { day: Number(event.target.value) })}>{Array.from({length:days},(_,d)=><option key={d} value={d}>DAY {d+1}</option>)}</select></label><button type="button" disabled={busy || index===0} aria-label={`${item.title} ${t("앞으로 이동")}`} onClick={()=>move(item.id,-1)}>↑</button><button type="button" disabled={busy || index===selected.length-1} aria-label={`${item.title} ${t("뒤로 이동")}`} onClick={()=>move(item.id,1)}>↓</button><button type="button" disabled={busy} onClick={()=>onChange(stops.filter(stop=>stop.id!==item.id))}>{t("일정에서 제외")}</button></div>
    </article>)}
    <form className="manual-place-form" onSubmit={event=>{event.preventDefault();if(busy || !title.trim() || stops.length>=100)return;onChange([...stops,{id:`manual-${crypto.randomUUID()}`,title:title.trim(),address:address.trim(),day,startTime:"",endTime:""}]);setTitle("");setAddress("");}}>
      <div className="manual-place-fields"><label>{t("새 장소 이름")}<input required maxLength={120} value={title} disabled={busy} onChange={event=>setTitle(event.target.value)} /></label><label>{t("주소 또는 메모")}<input maxLength={500} value={address} disabled={busy} onChange={event=>setAddress(event.target.value)} /></label></div><button type="submit" className="ui-button" disabled={busy || !title.trim() || stops.length>=100}>{t("직접 입력 장소 추가")}</button>
      <p>{t("직접 입력한 장소는 일정에 저장되며 지도에는 표시되지 않습니다.")}</p>
    </form>
  </section>;
}
