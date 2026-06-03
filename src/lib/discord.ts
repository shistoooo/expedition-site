/**
 * Reconstruction de l'URL d'avatar Discord à partir du user id + du HASH stocké
 * en D1 (users.discord_avatar). On NE stocke jamais l'URL : le hash change quand
 * l'user change sa PP (rafraîchi à chaque login Discord côté worker), et le CDN
 * accepte plusieurs formats/tailles via l'extension + ?size=.
 *
 * - hash null  → avatar Discord par défaut (index = (id >> 22) % 6 sur le nouveau
 *   système de pseudo). Pas besoin du hash.
 * - hash "a_…" → avatar animé (Nitro) → .gif.
 * - sinon      → .png.
 *
 * Réf : https://discord.com/developers/docs/reference (CDN endpoints).
 */
export function discordAvatarUrl(
  discordUserId: string | null | undefined,
  avatarHash: string | null | undefined,
  size = 128,
): string | null {
  if (!discordUserId) return null;
  if (!avatarHash) {
    // Avatar par défaut (nouveau système de pseudo Discord) : (id >> 22) % 6.
    // BigInt() en fonction (pas de littéral `n`) pour rester compatible cibles < ES2020.
    let index = 0;
    try {
      index = Number((BigInt(discordUserId) >> BigInt(22)) % BigInt(6));
    } catch {
      index = 0;
    }
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
  const ext = avatarHash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${discordUserId}/${avatarHash}.${ext}?size=${size}`;
}
