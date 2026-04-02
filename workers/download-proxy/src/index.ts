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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    const preflightOrigin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      const preflightAllowed = [
        env.ALLOWED_ORIGIN,
        "https://expeditionlauncher.store",
        "http://localhost:3000",
      ];
      const allowOrigin = preflightAllowed.includes(preflightOrigin) || preflightOrigin.endsWith(".vercel.app")
        ? preflightOrigin
        : env.ALLOWED_ORIGIN;
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (url.pathname !== "/stream") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Verify origin
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = [
      env.ALLOWED_ORIGIN,
      "https://expeditionlauncher.store",
      "http://localhost:3000",
    ];
    const isAllowedOrigin =
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app");

    // Verify token
    const token = url.searchParams.get("token");
    if (!token) {
      return new Response("Missing token", { status: 400 });
    }

    const payload = await verifyToken(token, env.HMAC_SECRET);
    if (!payload) {
      return new Response("Invalid or expired token", { status: 403 });
    }

    // Fetch upstream
    const upstreamRes = await fetch(payload.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return new Response("Upstream fetch failed", { status: 502 });
    }

    const contentLength = upstreamRes.headers.get("content-length");
    const contentType = upstreamRes.headers.get("content-type") || "video/mp4";
    const safeFilename = payload.filename.replace(/[^a-zA-Z0-9À-ÿ\s\-_.]/g, "");

    // Throttled stream: divide speed by 2
    // Strategy: for each chunk received, measure how long it took to receive,
    // then add the same delay before forwarding — resulting in ÷2 speed
    const reader = upstreamRes.body.getReader();
    const CHUNK_TARGET = 64 * 1024; // 64KB target chunks

    const throttledStream = new ReadableStream({
      async pull(controller) {
        const startTime = Date.now();
        let buffer = new Uint8Array(0);

        // Read until we have ~64KB or stream ends
        while (buffer.length < CHUNK_TARGET) {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer.length > 0) {
              controller.enqueue(buffer);
            }
            controller.close();
            return;
          }

          // Merge into buffer
          const merged = new Uint8Array(buffer.length + value.length);
          merged.set(buffer);
          merged.set(value, buffer.length);
          buffer = merged;
        }

        const receiveTime = Date.now() - startTime;
        // Add equal delay to halve the speed
        const throttleDelay = Math.max(receiveTime, 30); // minimum 30ms delay
        await sleep(throttleDelay);

        controller.enqueue(buffer);
      },
    });

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "no-cache",
      "X-Throttle": "web-free",
    };

    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }

    if (isAllowedOrigin) {
      responseHeaders["Access-Control-Allow-Origin"] = origin || env.ALLOWED_ORIGIN;
      responseHeaders["Access-Control-Expose-Headers"] = "Content-Length, Content-Disposition";
    }

    return new Response(throttledStream, {
      status: 200,
      headers: responseHeaders,
    });
  },
};
