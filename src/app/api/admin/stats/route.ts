import { NextRequest, NextResponse } from "next/server";

const WORKER = "https://expedition-licensing.expedition-studio.workers.dev";
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(req: NextRequest) {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ error: "ADMIN_SECRET non configuré." }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "7d";
  const site = searchParams.get("site") || "";

  const params = new URLSearchParams({ period });
  if (site) params.set("site", site);

  const res = await fetch(`${WORKER}/analytics/stats?${params}`, {
    headers: { "X-Admin-Secret": ADMIN_SECRET },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
