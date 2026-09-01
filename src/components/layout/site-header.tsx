import Link from "next/link";

import { primaryNavigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="로컬리 홈">
          <span className="brand-mark" aria-hidden="true">K</span>
          <span>
            <strong>로컬리</strong>
            <small>K-CONTENT LOCAL TRIP</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>

        <Link className="header-cta" href="/planner">내 여행 시작</Link>
      </div>

      <nav className="mobile-nav" aria-label="모바일 주요 메뉴">
        {primaryNavigation.map((item) => (
          <Link href={item.href} key={item.href}>{item.label}</Link>
        ))}
      </nav>
    </header>
  );
}
