import { NextRequest } from "next/server";

export const runtime = "edge"; // Edge runtime = no timeout, supports streaming

export async function GET(req: NextRequest) {
  const tunnelUrl = req.nextUrl.searchParams.get("url");

  if (!tunnelUrl) {
    return new Response("Missing url", { status: 400 });
  }

  // Only allow proxying to our tunnel server
  try {
    const parsed = new URL(tunnelUrl);
    if (parsed.hostname !== "stream.clipapp.uk") {
      return new Response("Invalid url", { status: 400 });
    }
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  // Fetch the video from the tunnel server and stream it to the browser
  const upstream = await fetch(tunnelUrl);

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream failed", { status: 502 });
  }

  // Pass through the response with download headers
  const filename = upstream.headers.get("content-disposition")
    ?.match(/filename="(.+)"/)?.[1] || "video.mp4";

  const headers = new Headers({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-cache",
  });

  // Pass content-length if available
  const contentLength = upstream.headers.get("content-length");
  const estimatedLength = upstream.headers.get("estimated-content-length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  } else if (estimatedLength) {
    headers.set("Content-Length", estimatedLength);
  }

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
