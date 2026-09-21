
"use client";
import { LocaleText, LanguageSelector, useTranslation } from "@/components/common/locale-provider";
import { AppIcon } from "@/components/common/app-icon";
import Link from "next/link";
import Form from "next/form";
import { useState } from "react";
import { useAuth } from "@/components/account/auth-provider";

export function TopSearch() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <header className="top-search-bar">
      <Form action="/explore" className="global-search" role="search">
        <AppIcon name="search" size={21} />
        <label className="sr-only" htmlFor="global-query"><LocaleText>{"지역, 콘텐츠, 장소 검색"}</LocaleText></label>
        <input id="global-query" name="q" placeholder={t("지역, 콘텐츠, 장소를 검색해보세요")} type="search" />
      </Form>
      <div className="top-search-actions">
        <LanguageSelector />
        <Link className="admin-entry-link" href="/admin"><LocaleText>{"관리자"}</LocaleText></Link>
        {user ? <button className="admin-entry-link" disabled={busy} onClick={async () => { setBusy(true); setError(""); try { await logout(); } catch { setError(t("로그아웃하지 못했습니다.")); } finally { setBusy(false); } }}>{t(busy ? "처리 중…" : "로그아웃")}</button> : <Link className="admin-entry-link" href="/login"><LocaleText>{"로그인·가입"}</LocaleText></Link>}
        <LinkProfile />
      </div>
      {error && <p className="top-search-error" role="alert">{error}</p>}
    </header>
  );
}

function LinkProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return <Link className={`profile-button ${user ? "is-signed-in" : ""}`} href="/mypage" aria-label={`${t("마이 페이지")}${user ? ` · ${user.name || user.email}` : ""}`}><span /><AppIcon name="user" size={21} /></Link>;
}
