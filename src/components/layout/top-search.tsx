
"use client";
import { LocaleText, LanguageSelector, useTranslation } from "@/components/common/locale-provider";
import { AppIcon } from "@/components/common/app-icon";
import Link from "next/link";

export function TopSearch() {
  const { t } = useTranslation();
  return (
    <header className="top-search-bar">
      <form action="/explore" className="global-search" role="search">
        <AppIcon name="search" size={21} />
        <label className="sr-only" htmlFor="global-query"><LocaleText>{"지역, 콘텐츠, 장소 검색"}</LocaleText></label>
        <input id="global-query" name="q" placeholder={t(t("지역, 콘텐츠, 장소를 검색해보세요"))} type="search" />
      </form>
      <LanguageSelector />
      <Link className="admin-entry-link" href="/admin"><LocaleText>{"관리자"}</LocaleText></Link>
      <Link className="admin-entry-link" href="/login"><LocaleText>{"로그인·가입"}</LocaleText></Link>
      <LinkProfile />
    </header>
  );
}

function LinkProfile() {
  const { t } = useTranslation();

  return <a className="profile-button" href="/mypage" aria-label={t("마이 페이지")}><span /><AppIcon name="user" size={21} /></a>;
}
