import { NextRequest } from "next/server";

// Node.js runtime (default) — buffers upstream then sends to client
// Edge runtime silently empties chunked responses, so we avoid it
export const maxDuration = 60; // 60s max for hobby plan

export async function GET(req: NextRequest) {
  try {
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

    if (!upstream.ok) {
      console.error("Upstream failed:", upstream.status, upstream.statusText);
      return new Response("Upstream failed", { status: 502 });
    }

    // Buffer the full response (avoids Node.js runtime ReadableStream issues)
    const buffer = await upstream.arrayBuffer();

    if (buffer.byteLength === 0) {
      console.error("Upstream returned empty body");
      return new Response("Empty upstream response", { status: 502 });
    }

    // Determine filename
    const upstreamFilename = upstream.headers.get("content-disposition")
      ?.match(/filename="(.+)"/)?.[1];
    const filename = requestedFilename || upstreamFilename || "video.mp4";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Stream proxy error:", err);
    return new Response("Internal error", { status: 500 });
  }
}
