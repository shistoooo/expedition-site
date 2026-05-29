"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, MessageCircle, Sparkles, X, Quote, Users, Pencil } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import CompatBadge from "@/components/shared/CompatBadge";
import { getPartner } from "@/lib/partners";
import { setPartnerAttribution, trackPartnerAttribution } from "@/lib/partnerAttribution";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.com/invite/QuV3bYDEYT";

const features = [
  "Télécharge tes vidéos de référence directement dans Premiere & DaVinci",
  "Découpe l'extrait exact avant de télécharger — pas après",
  "Importe ton script, toutes les références se téléchargent en un clic",
] as const;

/**
 * Encart "À REMPLIR" — affiché à la place d'un élément de preuve vide quand le
 * partenaire est en mode brouillon (draft). Permet d'envoyer la démo au
 * partenaire pour qu'il voie où placer sa citation / ses chiffres.
 */
function DraftSlot({ label, hint }: { label: string; hint: string }) {
  return (
    <div
      className="rounded-xl border-2 border-dashed border-amber-400/40 bg-amber-400/[0.04] p-5 text-center"
      role="note"
    >
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200 text-[11px] font-bold uppercase tracking-wider mb-2">
        <Pencil className="w-3 h-3" />
        À remplir
      </div>
      <p className="text-white/70 text-sm font-semibold">{label}</p>
      <p className="text-white/40 text-xs mt-1">{hint}</p>
    </div>
  );
}

export default function PartnerLandingPage() {
  const params = useParams();
  const slug = (params.slug as string) || "";
  // getPartner est synchrone + pur → résolu directement au render (pas de flash
  // de placeholder, contenu rendu dès le SSR).
  const partner = getPartner(slug);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Attribution — set le cookie + track (effets de bord client uniquement).
    if (partner) {
      setPartnerAttribution(partner.slug);
      trackPartnerAttribution(partner.slug);
    }
  }, [partner]);

  // Slug inconnu → message + retour home (pas de 404 brutal, le visiteur a peut-être
  // tapé un mauvais lien).
  if (!partner) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden relative text-white">
        <PageBackground />
        <Navbar />
        <main className="w-full relative z-10 pt-40 pb-32 container-main flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <X className="w-6 h-6 text-white/40" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-3">Ce lien partenaire n&apos;existe pas</h1>
          <p className="text-white/55 mb-8 max-w-md">
            Le lien que tu as suivi ne correspond &agrave; aucun partenaire. Pas de souci, tu peux
            d&eacute;couvrir Exp&eacute;dition directement.
          </p>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-black font-bold text-sm transition-all duration-200 hover:translate-y-[-1px]"
          >
            D&eacute;couvrir Exp&eacute;dition
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />

      <main className="w-full relative z-10">
        {/* ── HERO — handshake Fire Writing × Expédition ───────────────── */}
        <section className="pt-28 md:pt-36 pb-16 md:pb-20 relative">
          {/* Nebula bicolore — mélange l'accent partenaire et le purple Expédition */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px]"
              style={{
                background: `radial-gradient(ellipse 55% 50% at 35% 50%, ${partner.accentColor}33 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 65% 50%, rgba(139,92,246,0.22) 0%, transparent 65%)`,
                filter: "blur(8px)",
              }}
            />
          </div>

          <div className="container-main relative z-10 flex flex-col items-center text-center">
            {/* Eyebrow — partenariat */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-8 backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3" style={{ color: partner.accentColor2 }} />
              Partenariat {partner.name} &times; Exp&eacute;dition
            </motion.div>

            {/* Handshake logos — Fire Writing × Expédition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
              className="flex items-center justify-center gap-5 md:gap-7 mb-8"
            >
              {/* Logo partenaire */}
              <div
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0"
                style={{
                  boxShadow: `0 0 40px ${partner.accentColor}55, 0 8px 24px rgba(0,0,0,0.4)`,
                  border: `1px solid ${partner.accentColor}66`,
                }}
              >
                {!logoError ? (
                  <Image
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${partner.accentColor}, ${partner.accentColor2})` }}
                  >
                    {partner.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Connecteur × */}
              <span className="text-2xl md:text-3xl font-light text-white/30 select-none">&times;</span>

              {/* Logo Expédition */}
              <div
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0"
                style={{
                  border: "1px solid rgba(139,92,246,0.4)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.35), 0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src="/partners/expedition.png"
                  alt="Logo Expédition"
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* H1 — tagline partenaire */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
              className="text-3xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.1] tracking-[-0.02em] text-white max-w-4xl text-balance"
            >
              {partner.tagline}
            </motion.h1>

            {/* Intro — explique le partenariat (univers mélangé) */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
              className="text-base md:text-lg text-white/60 mb-7 max-w-2xl leading-relaxed"
            >
              {partner.intro}
            </motion.p>

            {/* Compat badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: easeOutExpo }}
              className="mb-9"
            >
              <CompatBadge />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <Link
                href="/checkout"
                className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Devenir Pionnier
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/demo"
                className="group px-7 py-4 rounded-xl bg-white/5 text-white/85 font-semibold text-base transition-all duration-200 flex items-center gap-2 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
              >
                <Play className="w-4 h-4" />
                Voir la d&eacute;mo
              </Link>
            </motion.div>

            {/* Prix — tarif communauté, angle privilège */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-sm text-white/70 mt-5"
            >
              Tarif Pionnier &mdash;{" "}
              <span className="font-bold text-white">8,03&euro;/mois, bloqu&eacute; &agrave; vie</span>.
              Le m&ecirc;me que pour la communaut&eacute;, ouvert aux {partner.community}.
            </motion.p>

            {/* Trust micro-row */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-xs text-white/40 mt-2"
            >
              Annulable 1 clic &middot; Sans engagement &middot; Sans code promo &agrave; saisir
            </motion.p>
          </div>
        </section>

        {/* ── PREUVE — mot du partenaire + social proof (placeholders si draft) ── */}
        <section className="py-12 md:py-16 relative">
          <div className="container-main max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="space-y-5"
            >
              {/* Compteur membres */}
              {partner.membersLabel ? (
                <div className="flex items-center justify-center gap-2 text-white/55 text-sm">
                  <Users className="w-4 h-4" style={{ color: partner.accentColor2 }} />
                  <span>
                    <strong className="text-white">{partner.membersLabel}</strong> font d&eacute;j&agrave; partie de {partner.name}
                  </span>
                </div>
              ) : partner.draft ? (
                <DraftSlot
                  label={`Nombre de membres ${partner.name}`}
                  hint='ex : "+2 400 copywriters, monteurs et youtubeurs" — affiché comme preuve sociale'
                />
              ) : null}

              {/* Citation du fondateur */}
              {partner.founderQuote ? (
                <figure
                  className="relative rounded-2xl p-6 md:p-7"
                  style={{
                    background: `linear-gradient(135deg, ${partner.accentColor}14, rgba(255,255,255,0.02))`,
                    border: `1px solid ${partner.accentColor}33`,
                  }}
                >
                  <Quote className="w-7 h-7 mb-3" style={{ color: `${partner.accentColor2}88` }} />
                  <blockquote className="text-white/85 text-base md:text-lg leading-relaxed italic mb-4">
                    {partner.founderQuote}
                  </blockquote>
                  <figcaption className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-white">{partner.founderName}</span>
                    {partner.founderRole && (
                      <>
                        <span className="text-white/20">&middot;</span>
                        <span className="text-white/45">{partner.founderRole}</span>
                      </>
                    )}
                  </figcaption>
                </figure>
              ) : partner.draft ? (
                <DraftSlot
                  label={`Mot du fondateur de ${partner.name}`}
                  hint="2 phrases : pourquoi tu recommandes Expédition à ta communauté. + ton nom + ton rôle."
                />
              ) : null}
            </motion.div>
          </div>
        </section>

        {/* ── PITCH — ce que fait Expédition ───────────────────────────── */}
        <section className="py-16 md:py-20 relative bg-[#06051a]/60">
          <div className="container-main max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="text-center mb-12"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">
                Ce que tu d&eacute;bloques
              </p>
              <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] leading-tight">
                Le plugin qui te fait{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: `linear-gradient(90deg, ${partner.accentColor}, ${partner.accentColor2})` }}
                >
                  gagner du temps et de l&apos;argent
                </span>
              </h2>
            </motion.div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: easeOutExpo }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.07]"
                >
                  <div
                    className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      background: `${partner.accentColor}22`,
                      border: `1px solid ${partner.accentColor}44`,
                      color: partner.accentColor2,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-white/75 leading-relaxed pt-0.5">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 relative">
          <div className="container-main max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] mb-4 leading-tight">
                Pr&ecirc;t &agrave; rejoindre l&apos;exp&eacute;dition, {partner.community}&nbsp;?
              </h2>
              <p className="text-white/55 mb-8 leading-relaxed">
                <strong className="text-white">8,03&euro;/mois, bloqu&eacute; &agrave; vie.</strong> Quand le catalogue grossit, ton prix ne bouge pas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/checkout"
                  className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 hover:translate-y-[-1px]"
                  style={{ boxShadow: `0 8px 24px ${partner.accentColor}40` }}
                >
                  Devenir Pionnier
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-6 py-4 rounded-xl bg-[#5865F2]/10 text-[#a5b4fc] font-semibold text-base border border-[#5865F2]/25 hover:bg-[#5865F2]/20 hover:text-white hover:border-[#5865F2]/40 transition-all duration-200 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Une question&nbsp;? Discord
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
