"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { primaryNavigation } from "@/lib/navigation";

export function PublicSidebar() {
  const pathname = usePathname();

  return (
    <aside className="public-sidebar">
      <Link className="kspot-brand" href="/" aria-label="K-SPOT 홈">
        <span className="kspot-brand-pin"><AppIcon name="pin" size={28} strokeWidth={2.4} /></span>
        <span><strong>K-SPOT</strong><small>K-콘텐츠로 떠나는 나만의 여행</small></span>
      </Link>

      <nav className="side-navigation" aria-label="주요 메뉴">
        {primaryNavigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return <Link className={active ? "is-active" : undefined} href={item.href} key={item.href}><AppIcon name={item.icon} /><span>{item.label}</span></Link>;
        })}
      </nav>

      <aside className="sidebar-promo" aria-label="추천 콘텐츠">
        <small>나만의 K-콘텐츠 여행</small>
        <strong>장면 속으로</strong>
        <span>등록된 촬영지 둘러보기</span>
        <Link href="/explore">콘텐츠 보기 <AppIcon name="arrow" size={14} /></Link>
        <div className="promo-portrait promo-portrait-one" />
        <div className="promo-portrait promo-portrait-two" />
      </aside>
    </aside>
  );
}
