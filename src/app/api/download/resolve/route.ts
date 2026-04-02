import { NextRequest, NextResponse } from "next/server";

const COBALT_API = process.env.COBALT_API_URL || "http://204.168.158.84";
const COBALT_INTERNAL_HOST = "http://204.168.158.84:9000";
const COBALT_PUBLIC_HOST = "https://stream.clipapp.uk";

const DAILY_LIMIT = 15;

// In-memory rate limiting (resets on cold start — good enough for Vercel)
const rateLimitMap = new Map<string, { count: number; date: string }>();

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().slice(0, 10);
  const entry = rateLimitMap.get(key);

  if (!entry || entry.date !== today) {
    rateLimitMap.set(key, { count: 1, date: today });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

function isValidYouTubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const validHosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "music.youtube.com"];
    return validHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL requise" }, { status: 400 });
    }

    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json({ error: "URL YouTube invalide" }, { status: 400 });
    }

    // Rate limit check.
    // action=download is the second phase of the same operation (re-resolve at click time
    // to get a fresh 90s tunnel). We check the limit but do NOT increment — the counter
    // was already incremented during the initial resolve (action != "download").
    const action = body.action;
    const rateLimitKey = getRateLimitKey(req);
    const { allowed, remaining } =
      action === "download"
        ? // Peek without incrementing: simulate what checkRateLimit would return
          (() => {
            const today = new Date().toISOString().slice(0, 10);
            const entry = rateLimitMap.get(rateLimitKey);
            if (!entry || entry.date !== today) return { allowed: true, remaining: DAILY_LIMIT };
            return { allowed: entry.count < DAILY_LIMIT, remaining: Math.max(0, DAILY_LIMIT - entry.count) };
          })()
        : checkRateLimit(rateLimitKey);

    if (!allowed) {
      return NextResponse.json(
        { error: "Limite quotidienne atteinte (15/jour). Passez à TubeForge Pro pour des téléchargements illimités.", limitReached: true },
        { status: 429 }
      );
    }

    // Call Cobalt API
    const cobaltRes = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        videoQuality: "720",
        filenameStyle: "basic",
        downloadMode: "auto",
      }),
    });

    if (!cobaltRes.ok) {
      const errorText = await cobaltRes.text();
      console.error("Cobalt API error:", cobaltRes.status, errorText);
      return NextResponse.json(
        { error: "Impossible de résoudre cette vidéo. Vérifiez l'URL et réessayez." },
        { status: 502 }
      );
    }

    const cobaltData = await cobaltRes.json();

    if (cobaltData.status === "error") {
      return NextResponse.json(
        { error: cobaltData.error?.code === "content.video.unavailable"
          ? "Cette vidéo est privée ou indisponible."
          : "Impossible de traiter cette vidéo." },
        { status: 422 }
      );
    }

    // Cobalt returns a tunnel URL on the internal port — rewrite to public HTTPS host.
    // The tunnel TTL is 90s. We return the tunnel URL here only for the "stream" action
    // (immediate proxy download). For "resolve" (metadata preview), we skip Cobalt entirely
    // and only call it at download time via ?action=download.
    let downloadUrl: string = cobaltData.url || "";
    downloadUrl = downloadUrl.replace(COBALT_INTERNAL_HOST, COBALT_PUBLIC_HOST);
    const filename = cobaltData.filename || "video.mp4";

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Aucun lien de téléchargement trouvé pour cette vidéo." },
        { status: 422 }
      );
    }

    // action=download: skip oEmbed metadata fetch — we only need the fresh tunnel URL.
    // This path is called at download-click time so the 90s TTL starts as late as possible.
    if (action === "download") {
      return NextResponse.json({ downloadUrl, filename });
    }

    // Get video metadata from YouTube oEmbed (resolve/preview path only)
    let title = filename.replace(/\.[^.]+$/, "").replace(/_/g, " ");
    let thumbnail = "";
    let durationSeconds = 0;

    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        title = oembed.title || title;
        thumbnail = oembed.thumbnail_url || "";
      }
    } catch {
      // oEmbed failed — use filename as title
    }

    return NextResponse.json({
      title,
      thumbnail,
      duration: durationSeconds > 0 ? formatDuration(durationSeconds) : null,
      durationSeconds,
      filename,
      // Do NOT return downloadUrl here — tunnel TTL is 90s and the user may not
      // click download immediately. The frontend will re-resolve at click time.
      remaining,
    });
  } catch (err) {
    console.error("Download resolve error:", err);
    return NextResponse.json(
      { error: "Erreur interne. Réessayez dans quelques instants." },
      { status: 500 }
    );
  }
}
