import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Clear le cookie `expedition_session` posé sur .expeditionlauncher.store.
 * Le logout depuis le site principal déconnecte AUSSI replays automatiquement
 * (puisque le cookie est partagé sur le domaine parent).
 */

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("expedition_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: ".expeditionlauncher.store",
    path: "/",
    maxAge: 0, // expire immédiatement
  });
  return res;
}
