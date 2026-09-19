import { TravelDashboard } from "@/components/saved/travel-dashboard";
import { AccountPanel } from "@/components/account/account-panel";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { getPublicExploreContents } from "@/lib/content-repository";

export default async function MyPage() {
  const user = await getUserIdentity();
  const contents = await getPublicExploreContents();
  return <main className="saved-page"><section className="saved-heading"><div><p className="kspot-eyebrow">MY K-SPOT</p><h1>나의 K-SPOT 여행</h1><p>Firebase에 저장된 나의 장소와 여행 일정을 확인하세요.</p></div></section><AccountPanel user={user} /><TravelDashboard contents={contents} /></main>;
}
