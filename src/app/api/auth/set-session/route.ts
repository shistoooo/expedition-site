import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/set-session   { token: string }
 *
 * v2026-06-03 — Pose le cookie `expedition_session` à partir d'un JWT worker.
 * Utilisé par le retour du login Discord : le worker (api.clipapp.uk) ne peut
 * PAS Set-Cookie pour `.expeditionlauncher.store` (cross-domain), donc il
 * renvoie le JWT au SPA via fragment (#access_token=…). Le SPA POST le token
 * ici → cette route Next.js (sur expeditionlauncher.store) pose le cookie SSO,
 * lu ensuite par expeditionlauncher.store ET replays.* (cookie sous-domaine).
 *
 * Sécurité : on VALIDE le token auprès du worker (/auth/web-me) AVANT de poser
 * le cookie — on ne fait jamais confiance à un token arbitraire envoyé par le
 * client. Le token provient du fragment d'une redirection worker, mais on
 * revérifie côté serveur (defense in depth).
 */

const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json().catch(() => ({ token: null }));
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "token requis" }, { status: 400 });
    }

    // Valide le token auprès du worker avant de poser le cookie.
    // ⚠️ /auth/web-me lit le token depuis le header COOKIE (expedition_session),
    // PAS depuis Authorization. On envoie les deux par sécurité.
    const meRes = await fetch(`${WORKER_URL}/auth/web-me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `expedition_session=${token}`,
      },
    });
    if (!meRes.ok) {
      return NextResponse.json({ error: "token invalide" }, { status: 401 });
    }
    const data = await meRes.json();

    const res = NextResponse.json({ success: true, user: data.user });
    res.cookies.set("expedition_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: ".expeditionlauncher.store",
      path: "/",
      maxAge: 30 * 24 * 3600,
    });
    return res;
  } catch (err) {
    console.error("[api/auth/set-session]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
