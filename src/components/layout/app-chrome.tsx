"use client";

import { usePathname } from "next/navigation";

import { PublicSidebar } from "@/components/layout/public-sidebar";
import { TopSearch } from "@/components/layout/top-search";
import { TravelSyncStatus } from "@/components/account/travel-sync-status";
import { useTranslation } from "@/components/common/locale-provider";

export function AppChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { locale, t } = useTranslation();

  if (pathname.startsWith("/admin")) return children;

  return (
    <div className="public-app-shell">
      <PublicSidebar />
      <div className="public-app-content">
        <TopSearch />
        <TravelSyncStatus />
        {children}
        {locale === "en" && <p className="locale-note">{t("원문 안내")}</p>}
      </div>
    </div>
  );
}
