"use client";
import { useEffect, useRef } from "react";
import { useTranslation } from "@/components/common/locale-provider";

export function ConfirmDialog({ open, busy, onCancel, onConfirm, error }: { error?: string; open: boolean; busy?: boolean; onCancel: () => void; onConfirm: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  return <dialog ref={dialog} className="confirm-dialog" aria-labelledby="delete-trip-title" onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
    <h2 id="delete-trip-title">{t("정말 이 여행 일정을 삭제하시겠습니까?")}</h2>
    <p>{t("삭제한 일정은 되돌릴 수 없습니다.")}</p>
    {error && <p role="alert">{t(error)}</p>}
    <div className="ui-actions"><button type="button" className="ui-button" autoFocus disabled={busy} onClick={onCancel}>{t("취소")}</button><button type="button" className="kspot-primary-button" disabled={busy} onClick={onConfirm}>{t(busy ? "처리 중…" : "삭제")}</button></div>
  </dialog>;
}
