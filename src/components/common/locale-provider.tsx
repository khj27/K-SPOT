"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { locale } = useTranslation();
  return <label className="language-selector" title={locale === "en" ? "Choose your language" : "언어를 선택하세요"}><span className="sr-only">Language / 언어</span><select aria-label="Language / 언어" value={locale} onChange={(event) => {
    const next = event.target.value === "en" ? "en" : "ko";
    document.cookie = `kspot-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    // Refresh server translations while preserving the client navigation state.
    router.refresh();
  }}><option value="ko">한국어</option><option value="en">English</option></select></label>;
}
