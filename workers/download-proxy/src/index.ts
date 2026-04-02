/**
 * Download Proxy Worker
 *
 * Validates HMAC-signed tokens from the Vercel API route,
 * fetches the upstream video, and streams it to the client
 * at half the upstream speed (÷2 throttle).
 */

interface Env {
  HMAC_SECRET: string;
  ALLOWED_ORIGIN: string;
}

interface TokenPayload {
  url: string;
  title: string;
  filename: string;
  exp: number;
}

async function verifyToken(token: string, secret: string): Promise<TokenPayload | null> {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    // Verify HMAC
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(encoded)
    );

    const expectedB64 = btoa(String.fromCharCode(...new Uint8Array(expectedSig)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (expectedB64 !== signature) return null;

    // Decode payload
    const json = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
    const payload: TokenPayload = JSON.parse(json);

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ALLOWED_ORIGINS = [
  "https://expedition.so",
  "https://expeditionlauncher.store",
  "http://localhost:3000",
];

function getCorsOrigin(request: Request, env: Env): string {
  const origin = request.headers.get("Origin") || "";
  const allowed = [...ALLOWED_ORIGINS, env.ALLOWED_ORIGIN];
  if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
    return origin;
  }
  return "";
}

function corsHeaders(origin: string): Record<string, string> {
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Expose-Headers": "Content-Length, Content-Disposition",
  };
}

function corsResponse(body: string, status: number, origin: string): Response {
  return new Response(body, { status, headers: corsHeaders(origin) });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = getCorsOrigin(request, env);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin || env.ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (url.pathname !== "/stream") {
      return corsResponse("Not found", 404, origin);
    }

    if (request.method !== "GET") {
      return corsResponse("Method not allowed", 405, origin);
    }

    // Verify token
    const token = url.searchParams.get("token");
    if (!token) {
      return corsResponse("Missing token", 400, origin);
    }

    const payload = await verifyToken(token, env.HMAC_SECRET);
    if (!payload) {
      return corsResponse("Invalid or expired token", 403, origin);
    }

    // Fetch upstream
    const upstreamRes = await fetch(payload.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return corsResponse("Upstream fetch failed", 502, origin);
    }

    const contentLength = upstreamRes.headers.get("content-length");
    const contentType = upstreamRes.headers.get("content-type") || "video/mp4";
    const safeFilename = payload.filename.replace(/[^a-zA-Z0-9À-ÿ\s\-_.]/g, "");

    // Throttled stream: divide speed by 2
    const reader = upstreamRes.body.getReader();
    const CHUNK_TARGET = 64 * 1024; // 64KB target chunks

    const throttledStream = new ReadableStream({
      async pull(controller) {
        const startTime = Date.now();
        let buffer = new Uint8Array(0);

        while (buffer.length < CHUNK_TARGET) {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer.length > 0) {
              controller.enqueue(buffer);
            }
            controller.close();
            return;
          }

          const merged = new Uint8Array(buffer.length + value.length);
          merged.set(buffer);
          merged.set(value, buffer.length);
          buffer = merged;
        }

        const receiveTime = Date.now() - startTime;
        const throttleDelay = Math.max(receiveTime, 30);
        await sleep(throttleDelay);

        controller.enqueue(buffer);
      },
    });

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "no-cache",
      "X-Throttle": "web-free",
      ...corsHeaders(origin),
    };

    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }

    return new Response(throttledStream, {
      status: 200,
      headers: responseHeaders,
    });
  },
};
