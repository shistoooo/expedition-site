import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const COBALT_API = process.env.COBALT_API_URL || "http://204.168.158.84:9000";
const HMAC_SECRET = process.env.DOWNLOAD_HMAC_SECRET || "expedition-download-secret-change-me";
const PROXY_WORKER_URL = process.env.NEXT_PUBLIC_DOWNLOAD_PROXY_URL || "https://download-proxy.expedition-studio.workers.dev";

const DAILY_LIMIT = 15;
const TOKEN_EXPIRY_SECONDS = 300; // 5 minutes

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

function signToken(data: { url: string; title: string; filename: string }): string {
  const payload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", HMAC_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
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

    // Rate limit check
    const rateLimitKey = getRateLimitKey(req);
    const { allowed, remaining } = checkRateLimit(rateLimitKey);
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

    // Cobalt returns either a redirect URL or a tunnel URL
    // Rewrite tunnel URLs from port 9000 to port 80 (nginx proxy)
    // so Cloudflare Workers can fetch them (Workers block non-standard ports)
    let downloadUrl: string = cobaltData.url;
    if (downloadUrl) {
      downloadUrl = downloadUrl.replace("http://204.168.158.84:9000/", "http://204.168.158.84/");
    }
    const filename = cobaltData.filename || "video.mp4";

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Aucun lien de téléchargement trouvé pour cette vidéo." },
        { status: 422 }
      );
    }

    // Try to get video metadata from YouTube oEmbed
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

    // Sign the download token
    const token = signToken({ url: downloadUrl, title, filename });
    const proxyUrl = `${PROXY_WORKER_URL}/stream?token=${token}`;

    return NextResponse.json({
      title,
      thumbnail,
      duration: durationSeconds > 0 ? formatDuration(durationSeconds) : null,
      durationSeconds,
      filename,
      downloadUrl: proxyUrl,
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
