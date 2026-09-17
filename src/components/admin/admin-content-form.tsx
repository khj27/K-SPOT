"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { exploreTypes } from "@/mocks/explore-data";
import type { AdminContentSpot } from "@/types/admin-content";

type Props = { initial?: AdminContentSpot };
type ApiResult = { id?: string; message?: string; errors?: Record<string, string> };

export function AdminContentForm({ initial }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const endpoint = initial ? `/api/admin/content-spots/${encodeURIComponent(initial.id)}` : "/api/admin/content-spots";
      const response = await fetch(endpoint, { method: initial ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as ApiResult;
      if (!response.ok) {
        setErrors(result.errors ?? {});
        setMessage(result.message ?? "저장하지 못했습니다.");
        return;
      }
      router.push("/admin/spots?saved=1");
      router.refresh();
    } catch {
      setMessage("네트워크 오류로 저장하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const field = (name: string) => errors[name] ? <small className="admin-field-error">{errors[name]}</small> : null;
  return (
    <form className="admin-content-form" onSubmit={submit} noValidate>
      <section className="admin-form-section">
        <div><p>CONTENT</p><h2>콘텐츠 정보</h2></div>
        <div className="admin-form-grid">
          <label><span>콘텐츠명 *</span><input name="contentTitle" defaultValue={initial?.contentTitle} required />{field("contentTitle")}</label>
          <label><span>콘텐츠 유형 *</span><select name="contentType" defaultValue={initial?.contentType ?? "드라마"}>{exploreTypes.filter((type) => type !== "전체").map((type) => <option key={type}>{type}</option>)}</select>{field("contentType")}</label>
          <label><span>제작자·아티스트</span><input name="creator" defaultValue={initial?.creator} /></label>
          <label><span>공개 연도</span><input name="releaseYear" type="number" min="1900" max="2030" defaultValue={initial?.releaseYear ?? ""} /></label>
          <label><span>회차·장면 *</span><input name="episode" defaultValue={initial?.episode} placeholder="예: EP. 12 / MV 촬영지" required />{field("episode")}</label>
          <label><span>고유 주소 *</span><input name="slug" defaultValue={initial?.slug} disabled={Boolean(initial)} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="예: reply-1988" required />{initial && <input name="slug" type="hidden" value={initial.slug} />}{field("slug")}</label>
          <label className="admin-field-wide"><span>장소와 콘텐츠의 관계 *</span><textarea name="description" defaultValue={initial?.description} rows={4} required />{field("description")}</label>
        </div>
      </section>

      <section className="admin-form-section">
        <div><p>PLACE</p><h2>관광 장소</h2></div>
        <div className="admin-form-grid">
          <label><span>장소명 *</span><input name="spotName" defaultValue={initial?.spotName} required />{field("spotName")}</label>
          <label><span>지역 *</span><input name="region" defaultValue={initial?.region} placeholder="예: 부산" required />{field("region")}</label>
          <label className="admin-field-wide"><span>주소 *</span><input name="address" defaultValue={initial?.address} required />{field("address")}</label>
          <label><span>위도 *</span><input name="latitude" type="number" step="any" defaultValue={initial?.latitude} placeholder="35.1532" required />{field("latitude")}</label>
          <label><span>경도 *</span><input name="longitude" type="number" step="any" defaultValue={initial?.longitude} placeholder="129.1186" required />{field("longitude")}</label>
        </div>
      </section>

      <section className="admin-form-section">
        <div><p>EVIDENCE</p><h2>근거와 권리</h2></div>
        <div className="admin-form-grid">
          <label><span>출처명 *</span><input name="sourceLabel" defaultValue={initial?.sourceLabel} placeholder="예: 부산영상위원회" required />{field("sourceLabel")}</label>
          <label><span>검수일 *</span><input name="verifiedAt" type="date" defaultValue={initial?.verifiedAt ?? new Date().toISOString().slice(0, 10)} required />{field("verifiedAt")}</label>
          <label className="admin-field-wide"><span>근거 URL *</span><input name="sourceUrl" type="url" defaultValue={initial?.sourceUrl} required />{field("sourceUrl")}</label>
          <label className="admin-field-wide"><span>이미지 URL</span><input name="imageUrl" type="url" defaultValue={initial?.imageUrl} />{field("imageUrl")}</label>
          <label className="admin-field-wide"><span>이미지 권리 *</span><input name="imageRights" defaultValue={initial?.imageRights} placeholder="예: 한국관광공사 공공누리 제1유형" required />{field("imageRights")}</label>
          <label><span>공개 상태 *</span><select name="status" defaultValue={initial?.status ?? "draft"}><option value="draft">임시 저장</option><option value="published">즉시 공개</option></select>{field("status")}</label>
        </div>
      </section>
      {message && <p className="admin-form-error" role="alert">{message}</p>}
      <div className="admin-form-actions"><button type="button" onClick={() => router.back()}>취소</button><button className="kspot-primary-button" disabled={submitting} type="submit">{submitting ? "저장 중…" : initial ? "변경사항 저장" : "콘텐츠 장소 등록"}</button></div>
    </form>
  );
}
