import { NextRequest, NextResponse } from "next/server";

// Same constants as resolve route
const COBALT_API = process.env.COBALT_API_URL || "http://204.168.158.84";
const COBALT_INTERNAL_HOST = "http://204.168.158.84:9000";
const COBALT_PUBLIC_HOST = "https://stream.clipapp.uk";

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
// Called as a direct <a href> click — no JavaScript involved.
// Resolves Cobalt, gets fresh tunnel URL, redirects browser to it.
export async function GET(req: NextRequest) {
  const ytUrl = req.nextUrl.searchParams.get("url");

  if (!ytUrl || !isValidYouTubeUrl(ytUrl)) {
    return new Response("Invalid YouTube URL", { status: 400 });
  }

  try {
    // Call Cobalt to get a fresh tunnel URL
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
    let downloadUrl: string = cobaltData.url || "";
    downloadUrl = downloadUrl.replace(COBALT_INTERNAL_HOST, COBALT_PUBLIC_HOST);

    if (!downloadUrl) {
      return new Response("No download URL", { status: 422 });
    }

    // 302 redirect to the tunnel URL.
    // The browser follows this redirect as a normal navigation.
    // The tunnel server responds with Content-Disposition: attachment → download starts.
    return NextResponse.redirect(downloadUrl, 302);
  } catch {
    return new Response("Internal error", { status: 500 });
  }
}
