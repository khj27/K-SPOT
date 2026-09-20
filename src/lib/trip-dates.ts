export const MAX_TRIP_DAYS = 31;
export function dateNumber(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const n = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(n) && new Date(n).toISOString().slice(0, 10) === value ? n : NaN;
}
export function tripDays(start: string, end: string): number {
  const days = (dateNumber(end) - dateNumber(start)) / 86400000 + 1;
  if (!Number.isInteger(days) || days < 1 || days > MAX_TRIP_DAYS) throw new Error(`여행 기간은 시작일부터 최대 ${MAX_TRIP_DAYS}일까지 선택해 주세요.`);
  return days;
}
export function dayDate(start: string, offset: number): string {
  return new Date(dateNumber(start) + offset * 86400000).toISOString().slice(0, 10);
}
export function distributeDays(count: number, days: number): number[] {
  return Array.from({ length: count }, (_, index) => Math.min(days - 1, Math.floor(index * days / Math.max(count, days))));
}
