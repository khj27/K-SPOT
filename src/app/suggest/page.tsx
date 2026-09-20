import Link from "next/link";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { ContentSuggestionForm } from "@/components/account/content-suggestion-form";
import { LocaleText } from "@/components/common/locale-provider";
export default async function SuggestPage() {
  const user = await getUserIdentity();
  return <main className="saved-page"><section className="saved-heading"><div><p className="kspot-eyebrow">SUGGEST A PLACE</p><h1><LocaleText>콘텐츠 제보</LocaleText></h1><p><LocaleText>아직 소개되지 않은 장소나 콘텐츠를 알려주세요.</LocaleText></p></div></section>{user ? <ContentSuggestionForm /> : <section className="travel-backup"><p><LocaleText>로그인 후 이용해 주세요.</LocaleText></p><Link className="kspot-primary-button" href="/login"><LocaleText>로그인하기</LocaleText></Link></section>}</main>;
}
