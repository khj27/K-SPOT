import { NextResponse } from "next/server";

import { getNearbyTourism } from "@/lib/tour-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));
  const radiusValue = Number(searchParams.get("radius") ?? 5_000);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ message: "유효한 latitude와 longitude가 필요합니다." }, { status: 400 });
  }

  const radius = Number.isFinite(radiusValue) ? Math.min(Math.max(radiusValue, 100), 20_000) : 5_000;
  const result = await getNearbyTourism(latitude, longitude, radius, 30);
  return NextResponse.json(result, {
    headers: { "Cache-Control": result.source === "tour-api" ? "public, s-maxage=21600, stale-while-revalidate=86400" : "no-store" },
  });
}
