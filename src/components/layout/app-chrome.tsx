"use client";

import { usePathname } from "next/navigation";

import { PublicSidebar } from "@/components/layout/public-sidebar";
import { TopSearch } from "@/components/layout/top-search";

export function AppChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return children;

  return (
    <div className="public-app-shell">
      <PublicSidebar />
      <div className="public-app-content">
        <TopSearch />
        {children}
      </div>
    </div>
  );
}
