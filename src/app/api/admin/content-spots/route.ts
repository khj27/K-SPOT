import { NextResponse } from "next/server";

import { validateAdminContentSpot } from "@/lib/admin-content-validation";
import { createAdminContentSpot, listAdminContentSpots } from "@/lib/content-repository";
import { getAdminIdentity } from "@/lib/firebase/session";

export async function GET() {
  const admin = await getAdminIdentity();
  if (!admin) return NextResponse.json({ message: "관리자 로그인이 필요합니다." }, { status: 401 });
  return NextResponse.json({ items: await listAdminContentSpots() });
}

export async function POST(request: Request) {
  const admin = await getAdminIdentity();
  if (!admin) return NextResponse.json({ message: "관리자 로그인이 필요합니다." }, { status: 401 });
  const validation = validateAdminContentSpot(await request.json().catch(() => null), { allowIncompleteDraft: true });
  if (!validation.data) return NextResponse.json({ message: "입력값을 확인해 주세요.", errors: validation.errors }, { status: 400 });
  try {
    const id = await createAdminContentSpot(validation.data, admin.email);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_SLUG") return NextResponse.json({ message: "이미 사용 중인 고유 주소입니다.", errors: { slug: "다른 고유 주소를 입력해 주세요." } }, { status: 409 });
    return NextResponse.json({ message: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
