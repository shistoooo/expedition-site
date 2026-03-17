# Deep Auditor — Agent Memory

## Key architectural facts
- Worker source: `/Users/mohamed/.gemini/antigravity/scratch/expedition-launcher/licensing/src/`
- Routes: `routes/auth.ts`, `routes/portal.ts`, `routes/webhooks.ts`
- Stripe service: `services/stripe.ts`
- DB queries: `db/queries.ts`
- No Next.js API routes — all backend logic is in the Cloudflare Worker

## Known bugs fixed
- **Checkout 500 on first click** (`stripe.ts`, `auth.ts`) — see `patterns.md` for full analysis

## Patterns and conventions
- See `patterns.md` for detailed bug patterns found in this codebase
