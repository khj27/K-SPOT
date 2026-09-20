
import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";
import { SavedSpotsList } from "@/components/saved/saved-spots-list";
import { SavedTourPlaces } from "@/components/saved/saved-tour-places";
import { TravelDashboard } from "@/components/saved/travel-dashboard";
import { AccountPanel } from "@/components/account/account-panel";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { getPublicExploreContents } from "@/lib/content-repository";

export default async function MyPage() {
  const user = await getUserIdentity();
  const contents = await getPublicExploreContents();
  return <main className="saved-page"><section className="saved-heading"><div><p className="kspot-eyebrow">MY K-SPOT</p><h1><LocaleText>{"나의 K-SPOT 여행"}</LocaleText></h1><p><LocaleText>{"저장한 장소와 일정, 최근 둘러본 곳을 한눈에 확인하세요."}</LocaleText></p></div></section><AccountPanel user={user}><TravelDashboard contents={contents} /><section id="saved-places"><h2><LocaleText>찜한 장소</LocaleText></h2><SavedSpotsList contents={contents} /><SavedTourPlaces /></section><Link className="ui-button" href="/suggest"><LocaleText>콘텐츠 제보</LocaleText></Link></AccountPanel></main>;
}
