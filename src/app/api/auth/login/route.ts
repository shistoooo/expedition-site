import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 *
 * Proxy login pour le site principal expeditionlauncher.store.
 *
 * Pose le cookie `expedition_session` sur `.expeditionlauncher.store` (Domain
 * cookie partagé entre expeditionlauncher.store ET replays.expeditionlauncher.store
 * → SSO unifié).
 *
 * Pourquoi ce proxy au lieu d'appeler directement le worker :
 *  - Le worker (api.clipapp.uk) ne peut PAS Set-Cookie pour
 *    .expeditionlauncher.store : le browser refuse les cookies cross-domain
 *    avec Domain= externe.
 *  - Cette route Next.js tourne sur expeditionlauncher.store → elle PEUT
 *    poser le cookie sur .expeditionlauncher.store (parent du current origin).
 *  - Le cookie posé ici est lu/réutilisé par replays.expeditionlauncher.store
 *    automatiquement (browser envoie le cookie sur tous les sous-domaines).
 */

const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const workerRes = await fetch(`${WORKER_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await workerRes.json();

    if (!workerRes.ok) {
      return NextResponse.json(data, { status: workerRes.status });
    }

    const res = NextResponse.json({
      success: true,
      user: data.user,
      subscription: data.subscription,
      // accessToken renvoyé en clair aussi pour que la page account puisse
      // garder son flow existant (Bearer dans Authorization header).
      // Le cookie est ce qui fait le SSO cross-subdomain pour replays.
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    res.cookies.set("expedition_session", data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: ".expeditionlauncher.store",
      path: "/",
      maxAge: 30 * 24 * 3600, // 30 jours — matche JWT côté worker
    });

    return res;
  } catch (err) {
    console.error("[api/auth/login]", err);
    return NextResponse.json(
      { error: "Erreur de connexion au serveur d'auth" },
      { status: 500 },
    );
  }
}
