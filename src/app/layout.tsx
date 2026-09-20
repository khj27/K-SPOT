import type { Metadata } from "next";

import { AppChrome } from "@/components/layout/app-chrome";
import { getUserIdentity } from "@/lib/firebase/user-session";

import "./globals.css";
import "./kspot.css";
import "./ui-polish.css";

export const metadata: Metadata = {
  title: {
    default: "로컬리 | K-콘텐츠 로컬 여행",
    template: "%s | 로컬리",
  },
  description: "K-콘텐츠와 함께 발견하는 비수도권 로컬 여행 플래너",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserIdentity();
  return (
    <html lang="ko" data-scroll-behavior="smooth" data-user-scope={user?.uid ?? "guest"}>
      <body>
        <a className="skip-link" href="#main-content">본문 바로가기</a>
        <AppChrome><div id="main-content">{children}</div></AppChrome>
      </body>
    </html>
  );
}
