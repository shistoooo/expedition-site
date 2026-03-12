import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    const sanitized = email.trim().toLowerCase();

    // Log to Vercel function logs — persistent and exportable
    console.log(`WAITLIST_EMAIL: ${sanitized} | ${new Date().toISOString()}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
