import { NextResponse } from "next/server";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { isSameOrigin, readAccountJson } from "@/lib/account-validation";
import { parseSuggestion } from "@/lib/content-suggestions";
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  const user = await getUserIdentity();
  if (!user) return NextResponse.json({ message: "로그인 후 이용해 주세요." }, { status: 401 });
  let suggestion;
  try { suggestion = parseSuggestion(await readAccountJson(request, 16_000)); }
  catch { return NextResponse.json({ message: "장소명 / 콘텐츠명과 입력한 항목의 글자 수·URL을 확인해 주세요." }, { status: 400 }); }
  try {
    const db = getFirebaseAdminDb();
    const ref = db.collection("contentSuggestions").doc(`${user.uid}_${suggestion.id}`);
    await db.runTransaction(async (transaction) => {
      if (!(await transaction.get(ref)).exists) transaction.create(ref, { ...suggestion, uid: user.uid, status: "pending", createdAt: new Date().toISOString() });
    });
    return NextResponse.json({ message: "콘텐츠 제보가 접수되었습니다." });
  } catch { return NextResponse.json({ message: "제보를 저장하지 못했습니다. 다시 시도해 주세요." }, { status: 503 }); }
}
