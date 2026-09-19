import { NextResponse } from "next/server";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { getUserIdentity, USER_COOKIE, USER_MAX_AGE } from "@/lib/firebase/user-session";
import { isSameOrigin, readAccountJson } from "@/lib/account-validation";

export async function GET() {
  return NextResponse.json({ user: await getUserIdentity() }, { headers: { "Cache-Control": "private, no-store" } });
}
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!isFirebaseAdminConfigured()) return NextResponse.json({ message: "서버 인증 설정이 필요합니다." }, { status: 503 });
  try {
    const body = await readAccountJson(request, 16_000) as { idToken?: unknown };
    if (typeof body?.idToken !== "string") return NextResponse.json({ message: "로그인 정보가 없습니다." }, { status: 400 });
    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifyIdToken(body.idToken, true);
    if (Math.abs(Date.now() / 1000 - decoded.auth_time) > 300) return NextResponse.json({ message: "다시 로그인해 주세요." }, { status: 401 });
    const session = await auth.createSessionCookie(body.idToken, { expiresIn: USER_MAX_AGE * 1000 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(USER_COOKIE, session, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: USER_MAX_AGE });
    return response;
  } catch { return NextResponse.json({ message: "로그인하지 못했습니다. 다시 시도해 주세요." }, { status: 401 }); }
}
export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(USER_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
