import { NextResponse } from "next/server";

import { validateAdminContentSpot } from "@/lib/admin-content-validation";
import { getAdminContentSpot, updateAdminContentSpot } from "@/lib/content-repository";
import { getAdminIdentity } from "@/lib/firebase/session";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteProps) {
  const admin = await getAdminIdentity();
  if (!admin) return NextResponse.json({ message: "관리자 로그인이 필요합니다." }, { status: 401 });
  const { id } = await params;
  const item = await getAdminContentSpot(id);
  return item ? NextResponse.json({ item }) : NextResponse.json({ message: "데이터를 찾을 수 없습니다." }, { status: 404 });
}

export async function PUT(request: Request, { params }: RouteProps) {
  const admin = await getAdminIdentity();
  if (!admin) return NextResponse.json({ message: "관리자 로그인이 필요합니다." }, { status: 401 });
  const validation = validateAdminContentSpot(await request.json().catch(() => null));
  if (!validation.data) return NextResponse.json({ message: "입력값을 확인해 주세요.", errors: validation.errors }, { status: 400 });
  const { id } = await params;
  try {
    await updateAdminContentSpot(id, validation.data, admin.email);
    return NextResponse.json({ id });
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_IMMUTABLE") return NextResponse.json({ message: "고유 주소는 수정할 수 없습니다." }, { status: 400 });
    if (error instanceof Error && error.message === "NOT_FOUND") return NextResponse.json({ message: "데이터를 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ message: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
