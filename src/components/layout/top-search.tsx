import { AppIcon } from "@/components/common/app-icon";

export function TopSearch() {
  return (
    <header className="top-search-bar">
      <form action="/explore" className="global-search" role="search">
        <AppIcon name="search" size={21} />
        <label className="sr-only" htmlFor="global-query">지역, 콘텐츠, 장소 검색</label>
        <input id="global-query" name="q" placeholder="지역, 콘텐츠, 장소를 검색해보세요" type="search" />
      </form>
      <button className="icon-button" type="button" aria-label="알림"><AppIcon name="bell" /></button>
      <LinkProfile />
    </header>
  );
}

function LinkProfile() {
  return <a className="profile-button" href="/mypage" aria-label="마이 페이지"><span /><AppIcon name="user" size={21} /></a>;
}
