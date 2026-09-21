import { PLACE_CATEGORIES } from "@/lib/place-categories";
export function parseSuggestion(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("제보 내용을 확인해 주세요.");
  const input = value as Record<string, unknown>;
  const text = (key: string, max: number, required = true) => {
    const result = typeof input[key] === "string" ? (input[key] as string).trim() : "";
    if ((required && !result) || result.length > max) throw new Error("필수 항목과 글자 수를 확인해 주세요.");
    return result;
  };
  const id = text("id", 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error("제보 번호가 올바르지 않습니다.");
  const title = text("title", 120), category = text("category", 30, false), region = text("region", 60, false), address = text("address", 240, false), description = text("description", 1000, false), reason = text("reason", 1000, false), comments = text("comments", 1000, false), relatedUrl = text("relatedUrl", 1000, false);
  if (category && !(PLACE_CATEGORIES as readonly string[]).includes(category)) throw new Error("카테고리를 확인해 주세요.");
  if (relatedUrl) { const url = new URL(relatedUrl); if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("관련 URL을 확인해 주세요."); }
  return { id, title, category, region, address, description, reason, comments, relatedUrl };
}
