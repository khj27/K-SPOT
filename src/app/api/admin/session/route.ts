import { NextResponse } from "next/server";

import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, isAllowedAdminEmail } from "@/lib/firebase/session";

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) return NextResponse.json({ message: "Firebase 서버 설정이 필요합니다." }, { status: 503 });
  try {
    const { idToken } = await request.json() as { idToken?: string };
    if (!idToken) return NextResponse.json({ message: "로그인 토큰이 없습니다." }, { status: 400 });
    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken);
    if (!isAllowedAdminEmail(decoded.email)) return NextResponse.json({ message: "관리자 권한이 없는 계정입니다." }, { status: 403 });
    const expiresIn = ADMIN_SESSION_MAX_AGE * 1000;
    const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: ADMIN_SESSION_MAX_AGE });
    return response;
  } catch {
    return NextResponse.json({ message: "이메일 또는 비밀번호를 확인해 주세요." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
