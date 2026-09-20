export type ManualStop = { id: string; title: string; address: string; day: number; startTime: string; endTime: string };
export function parseManualStops(value: unknown, days: number): ManualStop[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 100) throw new Error("직접 입력 장소는 최대 100곳입니다.");
  const seen = new Set<string>();
  return value.map(item => {
    if (!item || typeof item.id !== "string" || !/^manual-[a-f0-9-]{36}$/.test(item.id) || seen.has(item.id)
      || typeof item.title !== "string" || !item.title.trim() || item.title.length > 120
      || typeof item.address !== "string" || item.address.length > 500
      || !Number.isInteger(item.day) || item.day < 0 || item.day >= days
      || typeof item.startTime !== "string" || typeof item.endTime !== "string"
      || !((item.startTime === "" && item.endTime === "") || (/^([01]\d|2[0-3]):[0-5]\d$/.test(item.startTime) && /^([01]\d|2[0-3]):[0-5]\d$/.test(item.endTime) && item.startTime < item.endTime))) throw new Error("직접 입력 장소의 이름·날짜·시간을 확인해 주세요.");
    seen.add(item.id);
    return { id: item.id, title: item.title.trim(), address: item.address.trim(), day: item.day, startTime: item.startTime, endTime: item.endTime };
  });
}
