import { NextResponse } from "next/server";

import { getTourismDetail } from "@/lib/tour-api";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ contentId: string }> }) {
  const { contentId } = await context.params;
  if (!/^\d+$/.test(contentId)) return NextResponse.json({ message: "유효한 contentId가 필요합니다." }, { status: 400 });

  const result = await getTourismDetail(contentId);
  return NextResponse.json(result, { headers: { "Cache-Control": result.source === "tour-api" ? "public, s-maxage=86400, stale-while-revalidate=604800" : "no-store" } });
}
