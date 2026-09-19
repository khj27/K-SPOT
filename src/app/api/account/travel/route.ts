import { NextResponse } from "next/server";
import { getUserIdentity } from "@/lib/firebase/user-session";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { isSameOrigin, readAccountJson } from "@/lib/account-validation";
import { parseTravelBackup } from "@/lib/travel-storage";

const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  const user = await getUserIdentity();
  if (!user) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401, headers });
  try {
    const doc = await getFirebaseAdminDb().collection("userTravel").doc(user.uid).get();
    return NextResponse.json({ uid: user.uid, revision: doc.data()?.revision ?? 0, backup: doc.data()?.backup ?? null }, { headers });
  } catch { return NextResponse.json({ message: "계정 자료를 불러오지 못했습니다." }, { status: 503, headers }); }
}
export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403, headers });
  const user = await getUserIdentity();
  if (!user) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401, headers });
  let body: { uid: string; revision: number; backup: ReturnType<typeof parseTravelBackup> };
  try {
    const raw = await readAccountJson(request) as typeof body;
    if (!raw || raw.uid !== user.uid || !Number.isSafeInteger(raw.revision) || raw.revision < 0) return NextResponse.json({ message: "로그인 계정이 변경되었거나 요청이 올바르지 않습니다. 새로고침해 주세요." }, { status: 409, headers });
    const backup = parseTravelBackup(JSON.stringify(raw.backup));
    if (new TextEncoder().encode(JSON.stringify(backup)).length > 400_000) throw new Error();
    body = { uid: user.uid, revision: raw.revision, backup };
  } catch { return NextResponse.json({ message: "계정 저장은 400KB까지 지원합니다. 자료 형식과 크기를 확인해 주세요." }, { status: 400, headers }); }
  try {
    const db = getFirebaseAdminDb();
    const ref = db.collection("userTravel").doc(user.uid);
    const revision = await db.runTransaction(async (transaction) => {
      const current = await transaction.get(ref);
      const revision = current.data()?.revision ?? 0;
      if (revision !== body.revision) throw new Error("CONFLICT");
      transaction.set(ref, { backup: body.backup, revision: revision + 1, updatedAt: new Date().toISOString() });
      return revision + 1;
    });
    return NextResponse.json({ revision }, { headers });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error && error.message === "CONFLICT" ? "다른 기기에서 자료가 변경되었습니다. 계정 자료를 다시 확인한 뒤 저장해 주세요." : "저장하지 못했습니다. 계정 자료를 다시 확인해 주세요." }, { status: error instanceof Error && error.message === "CONFLICT" ? 409 : 503, headers });
  }
}
