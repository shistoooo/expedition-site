"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoDownloadComparison from "@/components/tubeforge/VideoDownloadComparison";
import TubeForgePricingSection from "@/components/tubeforge/TubeForgePricingSection";
import FeaturesList from "@/components/tubeforge/FeaturesList";
import CompatBadge from "@/components/shared/CompatBadge";
import TubeForgeCreatorsMarquee from "@/components/tubeforge/TubeForgeCreatorsMarquee";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FAQ_ITEMS = [
  {
    q: "Ça marche avec quels sites ?",
    a: "Plus de 1500 : YouTube, TikTok, Vimeo, X, Twitch, Dailymotion, et la plupart des plateformes vidéo. Le geste est le même partout — tu colles le lien, tu choisis la qualité.",
  },
  {
    q: "Ça marche avec quel logiciel de montage ?",
    a: "Premiere Pro et DaVinci Resolve, via le plugin qui s'installe directement dans le logiciel. Mac et Windows.",
  },
  {
    q: "C'est un abonnement ?",
    a: "Non. Tu le paies une fois, 39,99€, et il est à toi. Les mises à jour sont comprises.",
  },
  {
    q: "Sur combien d'ordinateurs ?",
    a: "Deux en même temps, Mac ou Windows, avec le même compte. Ton fixe au studio et ton portable, par exemple.",
  },
  {
    q: "L'accès à vie, ça dure vraiment combien de temps ?",
    a: "Un seul paiement, puis accès illimité aussi longtemps que TubeForge existe : sans abonnement, sans renouvellement, même si nos tarifs augmentent plus tard. On ne peut pas promettre « l'éternité » (aucun logiciel ne le peut honnêtement), mais tant qu'on fait tourner TubeForge, c'est à toi. Les détails sont dans nos CGV.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-5">
      <button data-track="faq-open" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4">
        <span className="font-semibold text-white">{q}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="text-white/50 text-sm leading-relaxed mt-3 overflow-hidden"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

export default function TubeForgePage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      {/* Fond scopé TubeForge — charbon OPAQUE (couvre les étoiles globales de
          GlobalSpace) + lueurs ember + grille technique subtile (vibe éditeur de
          montage). Cohérent avec la DA ember, ne touche pas le reste du site. */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        {/* base charbon opaque — couvre les étoiles globales sur toute la page */}
        <div className="absolute inset-0" style={{ background: "#07060f" }} />
        {/* lueur ember haute */}
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1200px] h-[760px] rounded-full blur-[170px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,106,31,0.12), rgba(239,68,68,0.05) 42%, transparent 72%)" }}
        />
        {/* lueur ember basse à droite */}
        <div
          className="absolute bottom-[-25%] right-[-12%] w-[760px] h-[560px] rounded-full blur-[170px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(239,68,68,0.07), transparent 72%)" }}
        />
        {/* Touches VIOLET (couleur du wordmark) : en FLANCS, jamais au centre.
            Opacités relevées le 2026-08-03 (0,075→0,115 et 0,055→0,09), et une
            troisième lueur ajoutée en haut à droite pour que la couleur existe
            aussi dans le premier écran — auparavant elle n'apparaissait qu'à
            38 % de la page, donc après le hero.
            La règle ne change pas : le violet reste rare et signifiant. Il
            monte d'un cran, il ne devient pas décor — au-delà, il rentre en
            concurrence avec l'ember et on ne sait plus quelle est la couleur
            du produit. */}
        <div
          className="absolute top-[-6%] right-[-10%] w-[520px] h-[520px] rounded-full blur-[190px]"
          style={{ background: "radial-gradient(circle at center, rgba(139,61,255,0.085), transparent 70%)" }}
        />
        <div
          className="absolute top-[38%] left-[-18%] w-[620px] h-[620px] rounded-full blur-[180px]"
          style={{ background: "radial-gradient(circle at center, rgba(139,61,255,0.115), transparent 68%)" }}
        />
        <div
          className="absolute top-[68%] right-[-14%] w-[520px] h-[520px] rounded-full blur-[180px]"
          style={{ background: "radial-gradient(circle at center, rgba(139,61,255,0.09), transparent 68%)" }}
        />
      </div>
      {/* Grille technique — UNIQUEMENT en haut de page (derrière le hero), discrète
          et animée, s'efface en descendant + au scroll (absolute, pas fixed). */}
      <div
        className="absolute top-0 left-0 right-0 h-[115vh] pointer-events-none z-[2] opacity-[0.06] tf-grid-anim"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, #000 8%, rgba(0,0,0,0.5) 28%, rgba(0,0,0,0.18) 46%, rgba(0,0,0,0.05) 58%, transparent 72%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 8%, rgba(0,0,0,0.5) 28%, rgba(0,0,0,0.18) 46%, rgba(0,0,0,0.05) 58%, transparent 72%)",
        }}
      />

      <Navbar />

      <main className="w-full relative z-10">
        {/* ── HERO — plein écran, tout au centre, rien d'autre. La démo vit
            dans SA section en dessous (on descend → « le temps gagné » en grand). */}
        {/* pb > pt : biaise le centrage flex vers le HAUT (centre optique,
            pas géométrique — un hero strictement centré paraît toujours bas). */}
        <section data-section="hero" className="relative min-h-[92svh] flex items-center pt-12 pb-16">
          <div className="container-main w-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: "rgba(255,106,31,0.7)" }}>Expédition</p>
              <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-[-0.03em]">
                Tube<span className="tf-forge-flow">Forge</span>
              </h1>
              <p className="text-sm text-white/35 mb-8 font-mono uppercase tracking-wider">Du web à ta timeline, sans détour</p>
              {/* La promesse, adressée à la personne visée : le monteur qui perd son temps
                  à récupérer des extraits. Pas de tiret cadratin. */}
              <p className="text-xl md:text-2xl text-white/65 mb-12 leading-relaxed">
                Monteur, créateur : <span className="text-white">ne perds plus jamais 10 minutes par extrait.</span>{" "}
                Colle ton lien, il atterrit direct sur ta timeline Premiere ou DaVinci, en pleine qualité, depuis plus
                de 1500 sites.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  data-track="hero-essai"
                  href="/tubeforge/checkout?plan=lifetime"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-base border border-white/20 transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  Obtenir TubeForge <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5" />
                </Link>
                <a
                  data-track="hero-voir-demo"
                  href="#demo-tf"
                  className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/5 text-white/85 font-semibold text-base transition-all duration-200 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                >
                  Voir la démo
                  <ArrowRight className="w-4 h-4 rotate-90 group-hover:translate-y-1 transition-transform duration-200" />
                </a>
              </div>
              {/* Logos Premiere/DaVinci sous les CTA : la compatibilité est LA
                  question que se pose un monteur avant même le prix. */}
              <div className="mt-8">
                <CompatBadge delay={0.35} />
              </div>
              {/* Social proof intégrée au hero : les 9 chaînes, triées par
                  nombre d'abonnés (source unique lib/youtubers.ts). */}
              <div className="mt-12">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4">Ils l&apos;utilisent déjà</p>
                <TubeForgeCreatorsMarquee />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── LE TEMPS GAGNÉ — 2ᵉ section, en grand : la preuve vidéo réelle. ── */}
        <section id="demo-tf" data-section="demo" className="pb-20 md:pb-28 relative scroll-mt-24">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="relative"
            >
              <div
                className="absolute top-[-8%] left-1/2 -translate-x-1/2 w-[70%] h-[50%] rounded-full pointer-events-none opacity-70"
                style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.14) 0%, rgba(249,115,22,0.07) 35%, transparent 70%)", filter: "blur(80px)" }}
              />
              <VideoDownloadComparison />
            </motion.div>
          </div>
        </section>

        {/* ── FEATURES (éditorial + mini-illustration par ligne) ── */}
        <section id="features-tf" data-section="features" className="pb-16 md:pb-24 relative">
          <div className="container-main max-w-5xl">
            <FeaturesList />
          </div>
        </section>

        {/* ── PRIX ─────────────────────────────────────────────────────── */}
        <div data-section="pricing">
          <TubeForgePricingSection />
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section data-section="faq" className="pb-16 md:pb-24 relative">
          <div className="container-main max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-black tracking-[-0.02em] mb-8 text-center">Questions fréquentes</h2>
            <div>
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
