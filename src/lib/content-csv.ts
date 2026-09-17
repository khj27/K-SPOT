import { validateAdminContentSpot } from "@/lib/admin-content-validation";
import type { AdminContentSpotInput } from "@/types/admin-content";

export const CSV_COLUMNS = ["slug", "contentTitle", "contentType", "creator", "releaseYear", "episode", "description", "spotName", "region", "address", "latitude", "longitude", "sourceUrl", "sourceLabel", "verifiedAt", "imageUrl", "imageRights", "status"] as const;
export const CSV_MAX_BYTES = 512 * 1024;
export type CsvRow = { row: number; slug: string; title: string; errors: string[]; data?: AdminContentSpotInput };

export function inspectContentCsv(csv: string): CsvRow[] {
  if (new TextEncoder().encode(csv).length > CSV_MAX_BYTES) throw new Error("CSV 파일은 512KB 이하로 업로드해 주세요.");
  const records = parseCsv(csv.replace(/^\uFEFF/, ""));
  const header = records.shift()?.map((cell) => cell.trim());
  if (!header || header.length !== CSV_COLUMNS.length || new Set(header).size !== header.length || CSV_COLUMNS.some((key) => !header.includes(key))) {
    throw new Error("열 이름이 양식과 다릅니다. CSV 양식을 내려받아 첫 줄을 그대로 사용해 주세요.");
  }
  if (records.length === 0 || records.length > 100) throw new Error("한 번에 데이터 1~100행을 등록할 수 있습니다.");
  const rows = records.map((cells, index): CsvRow => {
    const input = Object.fromEntries(header.map((key, i) => [key, cells[i] ?? ""]));
    // Import always begins as draft; publishing is a separate review action.
    input.status = "draft";
    const result = validateAdminContentSpot(input);
    const errors = Object.values(result.errors);
    if (cells.length !== header.length) errors.unshift("열 개수가 양식과 다릅니다.");
    return { row: index + 2, slug: input.slug.trim().toLowerCase(), title: input.contentTitle, errors, data: errors.length ? undefined : result.data };
  });
  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(row.slug, (counts.get(row.slug) ?? 0) + 1));
  rows.forEach((row) => {
    if (row.slug && counts.get(row.slug)! > 1) { row.errors.push("파일 안에서 고유 주소가 중복됩니다."); delete row.data; }
  });
  return rows;
}

/** RFC-style quoted fields, escaped quotes, CRLF, and embedded newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cells: string[] = [], value = "", quoted = false, closed = false;
  const cell = () => { cells.push(value); value = ""; closed = false; };
  const row = () => { cell(); if (cells.some((v) => v.trim())) rows.push(cells); cells = []; };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { value += '"'; i++; }
        else { quoted = false; closed = true; }
      } else value += char;
    } else if (char === ',') cell();
    else if (char === '\r' || char === '\n') { if (char === '\r' && text[i + 1] === '\n') i++; row(); }
    else if (char === '"' && !value && !closed) quoted = true;
    else if (closed || char === '"') throw new Error("CSV 따옴표 형식이 잘못되었습니다. CSV UTF-8 형식으로 다시 저장해 주세요.");
    else value += char;
  }
  if (quoted) throw new Error("CSV에 닫히지 않은 따옴표가 있습니다.");
  if (value || cells.length || closed) row();
  return rows;
}

export function csvTemplate() {
  return "\uFEFF" + CSV_COLUMNS.join(",") + "\r\n";
}

export function serializeContentCsv(input: Record<string, string>) {
  return csvTemplate() + CSV_COLUMNS.map((key) => '"' + (input[key] ?? "").replaceAll('"', '""') + '"').join(",");
}

/** A vertical research sheet describes one place, not one place per row. */
export function readResearchCsv(csv: string): Record<string, string> | null {
  if (new TextEncoder().encode(csv).length > CSV_MAX_BYTES) throw new Error("CSV 파일은 512KB 이하여야 합니다.");
  const records = parseCsv(csv.replace(/^\uFEFF/, ""));
  const header = records.shift()?.map((value) => value.trim()) ?? [];
  if (!header.includes("조사 항목")) return null;
  const labelIndex = header.indexOf("조사 항목");
  const valueIndex = header.includes("작성 내용") ? header.indexOf("작성 내용") : header.indexOf("작성 예시");
  if (valueIndex < 0 || new Set(header).size !== header.length) throw new Error("조사표에 작성 예시 또는 작성 내용 열이 필요합니다. 열 이름은 중복될 수 없습니다.");
  if (!records.length || records.length > 100) throw new Error("조사표는 1~100개 항목을 지원합니다.");
  const fields: Record<string, string> = {};
  for (const cells of records) {
    if (cells.length !== header.length) throw new Error("조사표의 열 개수가 첫 줄과 다릅니다.");
    const label = cells[labelIndex].trim();
    if (!label) throw new Error("조사 항목 이름이 비어 있습니다.");
    if (Object.hasOwn(fields, label)) throw new Error(`조사 항목이 중복됩니다: ${label}`);
    fields[label] = cells[valueIndex].trim();
  }
  const get = (key: string) => fields[key] ?? "";
  if (!get("장소명") || !get("미디어 제목")) throw new Error("조사표에 장소명과 미디어 제목을 입력해 주세요.");
  // Stable identifier; administrators can review or change it before saving.
  const identity = `${get("미디어 제목")}\n${get("장소명")}`;
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(identity)) hash = Math.imul(hash ^ byte, 16777619);
  const mapped = new Set(["장소명", "정확한 주소", "미디어 유형", "미디어 제목", "미디어 공개연도", "관련 연예인 이름", "등장 장면", "장소와 콘텐츠의 관계", "장소 소개", "정보 출처", "위도", "경도", "검수일", "이미지 권리", "고유 주소", "지역"]);
  const details = Object.entries(fields).filter(([key, value]) => !mapped.has(key) && value).map(([key, value]) => `${key}: ${value}`);
  const image = get("대표 이미지");
  let sourceLabel = "";
  try { sourceLabel = new URL(get("정보 출처")).hostname; } catch { /* Validation reports invalid or missing source URLs. */ }
  return {
    slug: get("고유 주소") || `research-${(hash >>> 0).toString(16).padStart(8, "0")}`,
    contentTitle: get("미디어 제목"), contentType: get("미디어 유형"), creator: get("관련 연예인 이름"),
    releaseYear: get("미디어 공개연도").replace(/\s*년$/, ""), episode: get("등장 장면"),
    description: [get("장소와 콘텐츠의 관계"), get("장소 소개"), ...details].filter(Boolean).join("\n"),
    spotName: get("장소명"), region: get("지역") || get("정확한 주소").split(/\s+/).slice(0, 2).join(" "), address: get("정확한 주소"),
    latitude: get("위도"), longitude: get("경도"), sourceUrl: get("정보 출처"), sourceLabel,
    verifiedAt: get("검수일"), imageRights: get("이미지 권리"),
    imageUrl: /^https?:\/\/[^\s]+\.(?:png|jpe?g|webp|gif)(?:[?#].*)?$/i.test(image) ? image : "", status: "draft",
  };
}
