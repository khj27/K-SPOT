import type { Metadata } from "next";

import { AppChrome } from "@/components/layout/app-chrome";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { cookies } from "next/headers";
import { LocaleProvider, LocaleText } from "@/components/common/locale-provider";
import { AuthProvider } from "@/components/account/auth-provider";
import { TravelSnapshotProvider, type InitialTravel } from "@/components/account/travel-snapshot-provider";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { emptyTravel } from "@/lib/travel-mutations";
import { parseTravelBackup } from "@/lib/travel-data";

import "./globals.css";
import "./kspot.css";
import "./ui-polish.css";

export async function generateMetadata(): Promise<Metadata> {
  const english = (await cookies()).get("kspot-locale")?.value === "en";
  return {
  title: {
    default: english ? "K-SPOT | K-content Travel in Korea" : "K-SPOT | K-콘텐츠 로컬 여행",
    template: english ? "%s | K-SPOT" : "%s | K-SPOT",
  },
  description: english ? "Discover Korean filming locations and plan your own K-content trip." : "K-콘텐츠와 함께 발견하는 비수도권 로컬 여행 플래너",
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserIdentity();
  let initialTravel: InitialTravel = null;
  if (user) {
    try {
      const doc = (await getFirebaseAdminDb().collection("userTravel").doc(user.uid).get()).data();
      initialTravel = { uid: user.uid, data: { backup: parseTravelBackup(JSON.stringify(doc?.backup ?? emptyTravel())), revision: doc?.revision ?? 0, recentViews: doc?.recentViews ?? [] } };
    } catch { /* The client displays a retry state if loading fails. */ }
  }
  const locale = (await cookies()).get("kspot-locale")?.value === "en" ? "en" : "ko";
  return (
    <html lang={locale} data-scroll-behavior="smooth" data-user-scope={user?.uid ?? "guest"}>
      <body>
        <LocaleProvider locale={locale}>
        <a className="skip-link" href="#main-content"><LocaleText>본문 바로가기</LocaleText></a>
        <AuthProvider initialUser={user}><TravelSnapshotProvider initial={initialTravel}><AppChrome><div id="main-content">{children}</div></AppChrome></TravelSnapshotProvider></AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
