import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    if (!clientId) {
        return NextResponse.json({ error: "Discord not configured" }, { status: 500 });
    }

    // Preserve the plan query param through the OAuth flow
    const plan = req.nextUrl.searchParams.get("plan") || "monthly";
    const ref = req.nextUrl.searchParams.get("ref") || "";

    const redirectUri = `${req.nextUrl.origin}/api/discord/callback`;
    const state = Buffer.from(JSON.stringify({ plan, ref })).toString("base64url");

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "identify guilds",
        state,
        prompt: "none",
    });

    return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
}
