
import { LocaleText } from "@/components/common/locale-provider";
import { TravelDashboard } from "@/components/saved/travel-dashboard";
import { AccountPanel } from "@/components/account/account-panel";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { getPublicExploreContents } from "@/lib/content-repository";

export default async function MyPage() {
  const user = await getUserIdentity();
  const contents = await getPublicExploreContents();
  return <main className="saved-page"><section className="saved-heading"><div><p className="kspot-eyebrow">MY K-SPOT</p><h1><LocaleText>{"나의 K-SPOT 여행"}</LocaleText></h1><p><LocaleText>{"저장한 장소와 일정, 최근 둘러본 곳을 한눈에 확인하세요."}</LocaleText></p></div></section><AccountPanel user={user}><TravelDashboard contents={contents} /></AccountPanel></main>;
}
