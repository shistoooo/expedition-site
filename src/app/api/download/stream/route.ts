import { NextRequest, NextResponse } from "next/server";

// Redirect to the actual tunnel URL
// This makes the download same-origin from the browser's perspective
export async function GET(req: NextRequest) {
  const tunnelUrl = req.nextUrl.searchParams.get("url");

  if (!tunnelUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Only allow redirects to our tunnel server
  try {
    const parsed = new URL(tunnelUrl);
    if (parsed.hostname !== "stream.clipapp.uk") {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  return NextResponse.redirect(tunnelUrl, 302);
}
