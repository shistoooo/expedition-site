# Bug Patterns — expedition-launcher worker

## Checkout 500 on first click (fixed 2026-02-27)

### Root cause
`createIncompleteSubscription` in `services/stripe.ts` did not clean up the subscription it created on Stripe when it couldn't extract the `client_secret`. This left an orphaned `incomplete` subscription on the Stripe customer.

On the next call to `/portal/subscribe`, `cancelIncompleteSubscriptions` attempts to DELETE the orphan. If the DELETE fails silently (caught and swallowed), the subsequent `POST /subscriptions` fails with a Stripe error → 500.

### Mechanism (click 1 vs click 2)
- Click 1: `POST /auth/register` → creates user + Stripe customer → `createIncompleteSubscription` fails to get `client_secret` → exception caught silently in `auth.ts:170` → returns HTTP 200 with `clientSecret: null` → client calls `POST /portal/subscribe` → `cancelIncompleteSubscriptions` tries to DELETE orphan → silently fails → `POST /subscriptions` hits Stripe error → **500**
- Click 2: `POST /auth/register` → 409 (user exists) → client calls login → `POST /portal/subscribe` → by now orphan is expired or cleaned → succeeds

### Fix applied
1. `stripe.ts:createIncompleteSubscription` — added cleanup: if `client_secret` is absent after creating the subscription, immediately DELETE the subscription before throwing
2. `stripe.ts:cancelIncompleteSubscriptions` — improved logging: failed DELETEs now log with subscription ID and customer ID instead of being silently swallowed
3. `auth.ts:register` — added `stripeSetupFailed: true` in response when Stripe fails, making the failure semantically explicit (though client behavior was already correct)

### Files
- `/Users/mohamed/.gemini/antigravity/scratch/expedition-launcher/licensing/src/services/stripe.ts` lines 77-136
- `/Users/mohamed/.gemini/antigravity/scratch/expedition-launcher/licensing/src/routes/auth.ts` lines 152-187

### Fragile pattern in this codebase
Silent `catch` blocks around Stripe calls in `auth/register` — they create partially-initialized state (user in DB, Stripe subscription exists, but worker doesn't know its ID). Always clean up Stripe resources before re-throwing.
