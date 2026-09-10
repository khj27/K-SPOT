import { NextResponse } from "next/server";

import { getDemoSpots, type SpotQuery } from "@/lib/spots";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query: SpotQuery = {
    q: searchParams.get("q") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    region: searchParams.get("region") ?? undefined,
  };

  return NextResponse.json(getDemoSpots(query), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
