"use client";
import { useRef, useState } from "react";
import { useTranslation } from "@/components/common/locale-provider";
import { PLACE_CATEGORIES } from "@/lib/place-categories";
import { REGIONS } from "@/lib/regions";
export function ContentSuggestionForm() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false), [success, setSuccess] = useState(false), [message, setMessage] = useState("");
  const requestId = useRef<string | null>(null);
  if (success) return <section className="travel-backup"><h2 role="status">{t("콘텐츠 제보가 접수되었습니다.")}</h2><p>{t("관리자가 내용을 확인한 뒤 등록 여부를 검토합니다.")}</p><button className="ui-button" onClick={() => { requestId.current = null; setSuccess(false); setMessage(""); }}>{t("다른 장소 제보하기")}</button></section>;
  return <form className="travel-backup suggestion-form" onSubmit={async (event) => {
    event.preventDefault(); if (busy) return; setBusy(true); setMessage(""); requestId.current ??= crypto.randomUUID();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try { const response = await fetch("/api/suggestions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, id: requestId.current }) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); setSuccess(true); }
    catch (error) { setMessage(error instanceof Error ? error.message : "제보를 저장하지 못했습니다. 다시 시도해 주세요."); } finally { setBusy(false); }
  }}>
    <p className="suggestion-help" id="suggestion-help">{t("장소명이나 콘텐츠명만 적어도 제보할 수 있어요. 나머지는 아는 내용만 자유롭게 알려주세요.")}</p>
    <label>{t("장소명 / 콘텐츠명 (필수)")}<input name="title" required maxLength={120} disabled={busy} aria-describedby="suggestion-help" placeholder={t("예: 아이브 안유진 콘텐츠")} /></label>
    <label>{t("간단한 설명 (선택)")}<textarea name="description" maxLength={1000} rows={3} disabled={busy} placeholder={t("어떤 콘텐츠나 장소인지, 추가되었으면 하는 내용을 편하게 적어주세요.")} /></label>
    <details className="suggestion-details">
      <summary>{t("추가 정보 남기기 (모두 선택)")}</summary>
      <div className="suggestion-details-fields">
        <div className="trip-metadata">
          <label>{t("카테고리 (선택)")}<select name="category" defaultValue="" disabled={busy}><option value="">{t("선택하지 않음")}</option>{PLACE_CATEGORIES.map((category) => <option value={category} key={category}>{t(category)}</option>)}</select></label>
          <label>{t("지역 (선택)")}<select name="region" defaultValue="" disabled={busy}><option value="">{t("선택하지 않음")}</option>{REGIONS.map((region) => <option value={region} key={region}>{t(region)}</option>)}</select></label>
        </div>
        <label>{t("주소 (선택)")}<input name="address" maxLength={240} disabled={busy} /></label>
        <label>{t("관련 URL (선택)")}<input type="url" name="relatedUrl" maxLength={1000} disabled={busy} placeholder="https://" /></label>
        <label>{t("추가 요청 사유 (선택)")}<textarea name="reason" maxLength={1000} rows={2} disabled={busy} /></label>
        <label>{t("기타 의견 (선택)")}<textarea name="comments" maxLength={1000} rows={2} disabled={busy} /></label>
      </div>
    </details>
    <button className="kspot-primary-button" disabled={busy}>{t(busy ? "처리 중…" : "제보 보내기")}</button><p role="status">{t(message)}</p>
  </form>;
}
