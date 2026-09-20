"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translate, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("ko");
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export function useTranslation() {
  const locale = useContext(LocaleContext);
  return { locale, t: (text: string) => translate(text, locale) };
}
export function LocaleText({ children }: { children: string | number | null | undefined | false }) {
  const { t } = useTranslation();
  return typeof children === "string" ? t(children) : children;
}
export function LanguageSelector() {
  const { locale, t } = useTranslation();
  return <label className="language-selector" title={locale === "en" ? t("언어 변경 안내") : "언어 변경 시 페이지가 새로고침됩니다. 수정 중인 일정은 먼저 저장해 주세요."}><span className="sr-only">Language / 언어</span><select aria-label="Language / 언어" value={locale} onChange={(event) => {
    const next = event.target.value === "en" ? "en" : "ko";
    document.cookie = `kspot-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    // Reload to keep server content, document language and client UI in sync.
    window.location.reload();
  }}><option value="ko">한국어</option><option value="en">English</option></select></label>;
}
