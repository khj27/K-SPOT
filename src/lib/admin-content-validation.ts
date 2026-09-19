import { exploreTypes } from "@/mocks/explore-data";
import type { AdminContentValidation, ContentStatus } from "@/types/admin-content";
import type { ContentType } from "@/types/content";

const contentTypes = exploreTypes.filter((type): type is ContentType => type !== "전체");
const statuses: ContentStatus[] = ["draft", "published"];

export function validateAdminContentSpot(value: unknown, options: { allowIncompleteDraft?: boolean } = {}): AdminContentValidation {
  const input = isRecord(value) ? value : {};
  const incompleteDraft = options.allowIncompleteDraft === true && input.status === "draft";
  const errors: Record<string, string> = {};
  const text = (key: string, label: string, required = true, max = 500) => {
    const result = typeof input[key] === "string" ? input[key].trim() : "";
    if (required && !result) errors[key] = `${label}을(를) 입력해 주세요.`;
    if (result.length > max) errors[key] = `${label}은(는) ${max}자 이하로 입력해 주세요.`;
    return result;
  };

  const slug = text("slug", "고유 주소", true, 80).toLowerCase();
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.slug = "영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.";
  const contentTitle = text("contentTitle", "콘텐츠명", true, 120);
  const contentType = text("contentType", "콘텐츠 유형") as ContentType;
  if (!contentTypes.includes(contentType)) errors.contentType = "지원하는 콘텐츠 유형을 선택해 주세요.";
  const creator = text("creator", "제작자·아티스트", false, 120);
  const releaseYearText = text("releaseYear", "공개 연도", false, 4);
  const releaseYear = releaseYearText ? Number(releaseYearText) : null;
  if (releaseYear !== null && (!Number.isInteger(releaseYear) || releaseYear < 1900 || releaseYear > new Date().getFullYear() + 2)) errors.releaseYear = "올바른 공개 연도를 입력해 주세요.";
  const episode = text("episode", "회차·장면", true, 80);
  const description = text("description", "장소와 콘텐츠의 관계", true, 800);
  const spotName = text("spotName", "장소명", true, 120);
  const region = text("region", "지역", true, 60);
  const address = text("address", "주소", true, 240);
  const coordinate = (value: unknown) => {
    const missing = value === null || value === undefined || (typeof value === "string" && !value.trim());
    if (missing) return incompleteDraft ? null : NaN;
    return typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  };
  const latitude = coordinate(input.latitude);
  const longitude = coordinate(input.longitude);
  if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) errors.latitude = "위도는 -90~90 사이 숫자여야 합니다.";
  if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) errors.longitude = "경도는 -180~180 사이 숫자여야 합니다.";
  const sourceUrl = text("sourceUrl", "근거 URL", !incompleteDraft, 500);
  if (sourceUrl && !isHttpUrl(sourceUrl)) errors.sourceUrl = "http 또는 https 주소를 입력해 주세요.";
  const sourceLabel = text("sourceLabel", "출처명", !incompleteDraft, 120);
  const verifiedAt = text("verifiedAt", "검수일", !incompleteDraft, 10);
  const date = new Date(`${verifiedAt}T00:00:00Z`);
  if (verifiedAt && (!/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== verifiedAt)) errors.verifiedAt = "실제 존재하는 날짜를 YYYY-MM-DD 형식으로 입력해 주세요.";
  const imageUrl = text("imageUrl", "이미지 URL", false, 500);
  if (imageUrl && !isHttpUrl(imageUrl)) errors.imageUrl = "http 또는 https 주소를 입력해 주세요.";
  const imageRights = text("imageRights", "이미지 출처·사용 근거", false, 200);
  const status = text("status", "공개 상태") as ContentStatus;
  if (!statuses.includes(status)) errors.status = "공개 상태를 선택해 주세요.";

  if (Object.keys(errors).length > 0) return { errors };
  return { errors, data: { slug, contentTitle, contentType, creator, releaseYear, episode, description, spotName, region, address, latitude, longitude, sourceUrl, sourceLabel, verifiedAt, imageUrl, imageRights, status } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
