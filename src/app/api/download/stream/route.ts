import { NextRequest } from "next/server";

// Node.js runtime (default) — supports streaming chunked bodies correctly
// Edge runtime silently empties chunked responses from external fetch
export const maxDuration = 60; // 60s max for hobby plan

export async function GET(req: NextRequest) {
  const tunnelUrl = req.nextUrl.searchParams.get("url");
  const requestedFilename = req.nextUrl.searchParams.get("filename");

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

  // Fetch the video from the tunnel server
  const upstream = await fetch(tunnelUrl);

  if (!upstream.ok || !upstream.body) {
    console.error("Upstream failed:", upstream.status, upstream.statusText);
    return new Response("Upstream failed", { status: 502 });
  }

  // Determine filename
  const upstreamFilename = upstream.headers.get("content-disposition")
    ?.match(/filename="(.+)"/)?.[1];
  const filename = requestedFilename || upstreamFilename || "video.mp4";

  const headers = new Headers({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-cache",
  });

  // Pass content-length if available (important for download progress)
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
