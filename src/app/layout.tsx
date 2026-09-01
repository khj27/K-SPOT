import type { Metadata } from "next";

import { AppChrome } from "@/components/layout/app-chrome";

import "./globals.css";
import "./kspot.css";

export const metadata: Metadata = {
  title: {
    default: "로컬리 | K-콘텐츠 로컬 여행",
    template: "%s | 로컬리",
  },
  description: "K-콘텐츠와 함께 발견하는 비수도권 로컬 여행 플래너",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">본문 바로가기</a>
        <AppChrome><div id="main-content">{children}</div></AppChrome>
      </body>
    </html>
  );
}
