import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/me
 *
 * Retourne l'utilisateur connecté basé sur le cookie `expedition_session`.
 * Utilisé au boot de la page /account pour auto-restore la session si
 * l'utilisateur a déjà un cookie valide (vient de replays.* ou refresh page).
 *
 * Évite la friction "tu dois te re-logger à chaque visite".
 */

const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("expedition_session")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const workerRes = await fetch(`${WORKER_URL}/auth/web-me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `expedition_session=${token}`,
      },
    });

    if (!workerRes.ok) {
      // Token expiré / invalide → user:null mais HTTP 200 (le front traite
      // comme "non connecté" sans déclencher d'erreur)
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const data = await workerRes.json();
    return NextResponse.json(
      {
        user: data.user,
        // Retourne aussi le accessToken pour que la page account puisse le
        // réinjecter dans son state React et faire ses calls Bearer
        accessToken: token,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[api/auth/me]", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
