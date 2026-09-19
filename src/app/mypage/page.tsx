import { TravelDashboard } from "@/components/saved/travel-dashboard";
import { AccountPanel } from "@/components/account/account-panel";
import { getUserIdentity } from "@/lib/firebase/user-session";

export default async function MyPage() {
  const user = await getUserIdentity();
  return <main className="saved-page"><section className="saved-heading"><div><p className="kspot-eyebrow">MY K-SPOT</p><h1>나의 K-SPOT 여행</h1><p>저장 현황을 확인하고 다른 기기로 여행 계획을 옮겨보세요.</p></div></section><AccountPanel user={user} /><TravelDashboard /></main>;
}
