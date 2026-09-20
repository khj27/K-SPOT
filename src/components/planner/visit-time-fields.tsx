"use client";
import { useTranslation } from "@/components/common/locale-provider";
import type { VisitTime } from "@/lib/travel-data";
export function VisitTimeFields({ value, onChange, disabled }: { value: VisitTime; onChange: (value: VisitTime) => void; disabled?: boolean }) {
  const { t } = useTranslation();
  return <div className="visit-time-fields"><label>{t("시작 시간")}<input type="time" value={value.startTime} disabled={disabled} onChange={(e) => onChange({ ...value, startTime: e.target.value })} /></label><span>~</span><label>{t("종료 시간")}<input type="time" value={value.endTime} disabled={disabled} onChange={(e) => onChange({ ...value, endTime: e.target.value })} /></label></div>;
}
