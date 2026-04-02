import { NextRequest } from "next/server";

const COBALT_API = process.env.COBALT_API_URL || "http://204.168.158.84";
const COBALT_INTERNAL_HOST = "http://204.168.158.84:9000";
// Use port 80 (nginx catch-all → cobalt) so Vercel can reach it
const COBALT_TUNNEL_HOST = "http://204.168.158.84";

export const maxDuration = 60;

function isValidYouTubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const validHosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "music.youtube.com"];
    return validHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}

// GET /api/download/go?url=YOUTUBE_URL
// Same-origin proxy: resolves Cobalt, fetches the tunnel, streams back
// with Content-Disposition. Chrome blocks cross-origin 302 downloads,
// so we MUST proxy the bytes through our own origin.
export async function GET(req: NextRequest) {
  const ytUrl = req.nextUrl.searchParams.get("url");

  if (!ytUrl || !isValidYouTubeUrl(ytUrl)) {
    return new Response("Invalid YouTube URL", { status: 400 });
  }

  try {
    // 1. Call Cobalt to get a fresh tunnel URL
    const cobaltRes = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: ytUrl,
        videoQuality: "720",
        filenameStyle: "basic",
        downloadMode: "auto",
      }),
    });

    if (!cobaltRes.ok) {
      return new Response("Cobalt API error", { status: 502 });
    }

    const cobaltData = await cobaltRes.json();
    const filename = cobaltData.filename || "video.mp4";

    let tunnelUrl: string = cobaltData.url || "";
    if (!tunnelUrl) {
      return new Response("No download URL", { status: 422 });
    }

    // 2. Rewrite tunnel URL to port 80 (nginx catch-all → cobalt:9000)
    // Vercel can reach port 80 but not port 9000 or stream.clipapp.uk
    tunnelUrl = tunnelUrl.replace(COBALT_INTERNAL_HOST, COBALT_TUNNEL_HOST);

    // 3. Fetch the tunnel content server-side
    const upstream = await fetch(tunnelUrl);

    if (!upstream.ok) {
      return new Response(`Tunnel error: ${upstream.status}`, { status: 502 });
    }

    // 4. Buffer the full response to get Content-Length
    const buffer = await upstream.arrayBuffer();

    if (buffer.byteLength === 0) {
      return new Response("Empty tunnel response", { status: 502 });
    }

    // 5. Send to browser as same-origin download
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
    console.error("Download go error:", err);
    return new Response("Internal error", { status: 500 });
  }
}
