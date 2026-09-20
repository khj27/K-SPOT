"use client";
import { useTranslation } from "@/components/common/locale-provider";
export default function Loading() {
  const { t } = useTranslation();

  return (
    <main className="page-main" aria-busy="true" aria-label={t("페이지를 불러오는 중")}>
      <div className="shell loading-panel">
        <div className="loading-line loading-line-short" />
        <div className="loading-line loading-line-title" />
        <div className="loading-line" />
      </div>
    </main>
  );
}
