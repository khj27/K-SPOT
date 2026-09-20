"use client";
import { useState } from "react";
import { dayDate } from "@/lib/trip-dates";
export function TripDateFields({ today }: { today: string }) {
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  return <><label><span>여행 시작일</span><input type="date" name="startDate" required value={start} onChange={(event) => { const next = event.target.value; setStart(next); if (next && (end < next || end > dayDate(next, 30))) setEnd(next); }} /></label><label><span>여행 종료일</span><input type="date" name="endDate" required min={start} max={start ? dayDate(start, 30) : undefined} value={end} onChange={(event) => setEnd(event.target.value)} /></label></>;
}
