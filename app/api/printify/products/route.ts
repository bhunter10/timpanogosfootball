import { NextResponse } from "next/server";
import { getPrintifyCatalog } from "@/lib/printify/catalog";

export const runtime = "nodejs";

export async function GET() {
  const catalog = await getPrintifyCatalog();
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
