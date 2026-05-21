import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const clientId = process.env.DISCORD_CLIENT_ID;

    // Preserve query params through the OAuth flow
    const plan = req.nextUrl.searchParams.get("plan") || "monthly";
    const ref = req.nextUrl.searchParams.get("ref") || "";
    const from = req.nextUrl.searchParams.get("from") || "";

    // Graceful fallback if Discord OAuth is not configured (e.g. preview env
    // without DISCORD_CLIENT_ID set): send the user straight to Stripe checkout
    // so the funnel doesn't dead-end on a raw JSON error.
    if (!clientId) {
        const checkoutUrl = new URL("/checkout", req.nextUrl.origin);
        checkoutUrl.searchParams.set("plan", plan);
        if (ref) checkoutUrl.searchParams.set("ref", ref);
        if (from) checkoutUrl.searchParams.set("from", from);
        return NextResponse.redirect(checkoutUrl);
    }

    const redirectUri = `${req.nextUrl.origin}/api/discord/callback`;
    const state = Buffer.from(JSON.stringify({ plan, ref, from })).toString("base64url");

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
