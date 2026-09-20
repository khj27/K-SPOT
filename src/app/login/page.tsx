
import { LocaleText } from "@/components/common/locale-provider";
import { redirect } from "next/navigation";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { UserLoginForm } from "@/components/account/user-login-form";

export default async function LoginPage() {
  if (await getUserIdentity()) redirect("/mypage");
  const configured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  return <main className="saved-page account-login-page"><section className="saved-heading"><div><p className="kspot-eyebrow">K-SPOT ACCOUNT</p><h1><LocaleText>{"나의 여행 계정"}</LocaleText></h1><p><LocaleText>{"이메일로 가입하고 다른 기기에서도 여행 자료를 불러오세요."}</LocaleText></p></div></section><UserLoginForm configured={configured} /></main>;
}
