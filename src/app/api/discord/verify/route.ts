import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("discord_member");

    if (!cookie?.value) {
        return NextResponse.json({ verified: false });
    }

    const [timestamp, signature] = cookie.value.split(".");
    if (!timestamp || !signature) {
        return NextResponse.json({ verified: false });
    }

    const secret = process.env.DISCORD_SIGN_SECRET || process.env.DISCORD_CLIENT_SECRET || "";
    const payload = `discord_verified:${timestamp}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    if (signature !== expected) {
        return NextResponse.json({ verified: false });
    }

    // Check expiry (30 minutes)
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 30 * 60 * 1000) {
        return NextResponse.json({ verified: false });
    }

    return NextResponse.json({ verified: true });
}
