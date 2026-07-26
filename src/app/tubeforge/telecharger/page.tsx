"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Download, Loader2, LogOut, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  clearToken, download, fetchMe, getToken, loginUrl, readTokenFromHash, resolve, warmSession,
  type Me, type Progress, type Resolved, type Upsell,
} from "@/lib/webdl";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PLATFORMS = [
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "twitter", label: "X" },
  { key: "twitch", label: "Twitch" },
];

function DiscordMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.3 1.5A19.8 19.8 0 0 0 15.4 0l-.3.5c1.6.4 3 1 4.4 1.9a16.9 16.9 0 0 0-14.9 0A17 17 0 0 1 9 .5L8.7 0A19.8 19.8 0 0 0 3.7 1.5C.6 6.1-.2 10.6.2 15a19.9 19.9 0 0 0 6 3l1.2-1.9c-.7-.3-1.3-.6-1.9-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.2.7-1.9 1L18 18a19.9 19.9 0 0 0 6-3c.5-5.1-.8-9.6-3.7-13.5ZM8 12.3c-1.2 0-2.1-1.1-2.1-2.4S6.8 7.5 8 7.5s2.2 1.1 2.2 2.4S9.2 12.3 8 12.3Zm8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
    </svg>
  );
}

/** Rouge exact du wordmark TubeForge — celui qui clôt le dégradé du logo. */
const RED = "#ef3a24";
const AMBER = "#ff6a1f";

/**
 * Les deux reserves du jour : la sienne, et celle partagee par le serveur.
 *
 * Le piege d'ergonomie qu'on a corrige : afficher « 25/25 » avec une barre
 * pleine se lit spontanement « 25 consommes sur 25 », donc « c'est fini » —
 * l'inverse exact du sens voulu. Un lecteur decode une barre remplie comme de
 * la consommation, pas comme une reserve. D'ou le mot « restants » ecrit en
 * clair, et une barre qui se VIDE en descendant, comme une jauge de carburant.
 *
 * Montrer la reserve collective n'est pas cosmetique : sans elle, un blocage
 * ressemble a une panne ; avec elle, on comprend qu'on partage un outil gratuit
 * avec des centaines de personnes.
 */
function Compteurs({
  perso, total, serveur,
}: {
  perso: number | null;
  total: number | null;
  serveur: { used: number; limit: number } | null;
}) {
  if (perso === null || total === null) return null;
  const srvLeft = serveur ? Math.max(0, serveur.limit - serveur.used) : null;

  const Jauge = ({ reste, sur, libelle }: { reste: number; sur: number; libelle: string }) => {
    const p = sur > 0 ? Math.min(100, Math.max(0, (reste / sur) * 100)) : 0;
    const bas = p <= 20;
    const vide = reste === 0;
    return (
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 whitespace-nowrap mb-1">
          {libelle}
        </p>
        <p className="text-[13px] mb-2 whitespace-nowrap">
          <span className="font-mono tabular-nums font-semibold" style={{ color: vide ? RED : bas ? AMBER : "#fff" }}>
            {reste}
          </span>
          <span className="text-white/40"> {vide ? "restant" : reste === 1 ? "restant" : "restants"} sur {sur}</span>
        </p>
        <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${p}%`, background: bas ? RED : `linear-gradient(90deg, ${AMBER}, ${RED})` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-start gap-8 sm:gap-12">
      <Jauge reste={perso} sur={total} libelle="Tes téléchargements" />
      {srvLeft !== null && serveur && (
        <Jauge reste={srvLeft} sur={serveur.limit} libelle="Réserve du serveur" />
      )}
    </div>
  );
}

/**
 * Ce qui separe cette page de TubeForge, montre plutot que raconte.
 *
 * Ce qu'on a de plus fort ici, c'est un CHIFFRE que la personne vient de vivre :
 * le poids du fichier qu'elle a attendu. On le transforme en comparaison de
 * proportions — la meme piste, une fois pleine, une fois presque vide. Le
 * contraste porte le sens avant meme qu'on lise le texte.
 *
 * Les visuels sont les captures REELLES de la one-page (module de decoupe,
 * timeline Premiere) : pas d'icones decoratives, conformement a la direction
 * artistique — un outil se montre en fonctionnement. Les trois premieres cartes
 * reprennent `.tf-cell` (rayons asymetriques, legere inclinaison) ; la carte de
 * cloture suit deliberement le langage des encarts d'alerte deja presents plus
 * haut sur cette page, pas celui du bento.
 */
function PromoTubeForge({ poidsMo, dureeSec }: { poidsMo: number | null; dureeSec: number | null }) {
  const EXTRAIT_S = 20;
  // A defaut de mesure vecue, l'exemple par defaut est lui aussi mesure :
  // une video de 15 min en 1080p pese ~440 Mo (releve du 26/07/2026).
  const poids = poidsMo ?? 440;
  const duree = dureeSec && dureeSec > EXTRAIT_S ? dureeSec : 904;
  const part = Math.min(1, EXTRAIT_S / duree);
  const utileMo = Math.max(1, Math.round(poids * part));
  const vecu = poidsMo !== null;

  /**
   * Le chiffre affiche est le VRAI, sans plancher.
   *
   * Piege corrige apres audit : un plancher applique au pourcentage servait a la
   * fois a la largeur de la barre ET au texte. Sur une video de deux heures — le
   * cas que ce bloc cherche justement a dramatiser — la vraie valeur (0,28 %)
   * etait remplacee en silence par 0,6 % dans le texte. Un chiffre gonfle de
   * deux fois, sur la page qui prone l'honnetete des chiffres.
   *
   * La lisibilite de la barre se regle donc en PIXELS (`minWidth`), ce qui ne
   * touche pas au nombre annonce.
   */
  const pourcentReel = part * 100;
  const pourcentTexte = pourcentReel
    .toFixed(pourcentReel < 1 ? 2 : 1)
    .replace(".", ",")
    .replace(/,0$/, "");

  const Carte = ({
    r, tilt, delay, className = "", children,
  }: {
    r: string; tilt: string; delay: number; className?: string; children: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: easeOutExpo }}
      className={`group ${className}`}
    >
      <div className="tf-cell h-full p-6 md:p-7" style={{ "--r": r, "--tilt": tilt } as React.CSSProperties}>
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
          Ce que ça change au montage
        </p>
        <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] mb-8">
          Le téléchargement n’est pas le travail<span style={{ color: RED }}>.</span>
        </h2>
      </motion.div>

      {/* ── L'argument massue : le gaspillage, en proportions reelles ── */}
      <Carte r="24px 10px 22px 12px" tilt="-0.5deg" delay={0}>
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 items-center">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/32 mb-7">
              {vecu ? "Le fichier que tu viens de récupérer" : "Une vidéo de 15 minutes en 1080p"}
            </p>

            <div className="mb-7">
              <div className="flex items-baseline justify-between gap-3 mb-2.5">
                <span className="text-[15px] text-white/52">Téléchargé</span>
                <span className="font-mono text-sm text-white/52 tabular-nums whitespace-nowrap">{poids} Mo</span>
              </div>
              <div className="h-3 rounded-full bg-white/[0.09]" />
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="text-[15px] text-white">
                  Utile pour <span className="whitespace-nowrap">{EXTRAIT_S} s</span>
                </span>
                <span className="font-mono text-sm tabular-nums font-semibold whitespace-nowrap" style={{ color: RED }}>
                  {utileMo} Mo
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pourcentReel}%`,
                    minWidth: "6px",
                    background: `linear-gradient(90deg, ${AMBER}, ${RED})`,
                  }}
                />
              </div>
              <p className="text-sm text-white/52 mt-3.5 leading-relaxed">
                Soit <span className="text-white font-semibold">{pourcentTexte} %</span> du fichier.
                Le reste, tu l’as attendu pour rien.
              </p>
            </div>

            <p className="text-[15px] text-white leading-relaxed mt-8">
              TubeForge te fait poser ton point d’entrée et ton point de sortie
              <span className="text-white/52"> avant </span>
              de télécharger. Trente secondes utiles dans une vidéo de deux heures ?
              Tu ne récupères que ces trente secondes.
            </p>
          </div>

          <div>
            {/* Capture fournie par le user, cadree exactement sur le module de
                decoupe : libelle « Couper un extrait », apercu, curseur a deux
                poignees, Debut/Fin/Duree, mode de coupe. C'est tout ce qui prouve
                l'argument du paragraphe d'a cote, et rien de plus. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- capture locale, aucun gain a passer par next/image */}
            <img
              src="/tubeforge/real-cut-2.jpg"
              alt="TubeForge : curseurs de début et de fin, durée de l’extrait et mode de coupe, avant téléchargement"
              className="w-full h-auto rounded-lg border border-white/10 max-w-[400px] mx-auto"
              loading="lazy"
              width={647}
              height={716}
            />
            <p className="text-[11px] font-mono text-white/32 mt-3 text-center">capture réelle · TubeForge</p>
          </div>
        </div>
      </Carte>

      {/* ── Une seule carte pour les deux angles restants : ou ca arrive,
             et a quel rythme. Quatre cartes d'affilee, c'etait trop haut. ── */}
      <Carte r="12px 24px 10px 22px" tilt="0.55deg" delay={0.08} className="mt-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element -- capture locale */}
            <img
              src="/tubeforge/real-timeline.jpg"
              alt="L’extrait posé sur une timeline Premiere Pro"
              className="w-full h-[128px] object-cover rounded-lg border border-white/10"
              style={{ objectPosition: "50% 35%" }}
              loading="lazy"
              width={830}
              height={290}
            />
            <p className="text-[11px] font-mono text-white/32 mt-2.5">capture réelle · Premiere Pro</p>
            <p className="text-[15px] text-white leading-relaxed mt-4">
              Il arrive dans ton chutier, nommé, prêt à poser.
            </p>
            <p className="text-sm text-white/52 leading-relaxed mt-1.5">
              Ici, le fichier atterrit dans tes Téléchargements et c’est à toi d’aller le chercher.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { n: "1500+", l: "sites" },
                { n: "4K", l: "maximum" },
                { n: "∞", l: "par jour" },
              ].map((st) => (
                <div key={st.l}>
                  <p className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-none" style={{ color: AMBER }}>
                    {st.n}
                  </p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-white/32 mt-1.5">{st.l}</p>
                </div>
              ))}
            </div>
            <p className="text-[15px] text-white leading-relaxed">
              Tu colles tes liens à la chaîne et tu continues à monter pendant qu’ils arrivent.
            </p>
            <p className="text-sm text-white/52 leading-relaxed mt-1.5">
              Ici : un lien à la fois, 25 par jour, 1080p, quatre plateformes — Instagram et Facebook
              exigent d’être connecté, ce qu’une page web ne peut pas faire.
            </p>
          </div>
        </div>
      </Carte>

      {/* ── La cloture : le temps, en gros, parce que c'est ca qu'on achete ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: 0.16, ease: easeOutExpo }}
        className="mt-4 rounded-2xl border p-6 md:p-8"
        style={{ borderColor: "rgba(239,58,36,0.3)", background: "rgba(239,58,36,0.055)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10 mb-7">
          <div>
            <p className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-none" style={{ color: RED }}>2 h</p>
            <p className="text-[13px] text-white/52 mt-2 leading-snug">
              par vidéo, à récupérer<br />des fichiers au lieu de monter
            </p>
          </div>
          <div className="hidden sm:block w-px self-stretch bg-white/10" />
          <div>
            <p className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-none text-white">8 h</p>
            <p className="text-[13px] text-white/52 mt-2 leading-snug">
              par mois, si tu sors<br />une vidéo par semaine
            </p>
          </div>
          <div className="hidden md:block w-px self-stretch bg-white/10" />
          <p className="text-[13px] text-white/32 leading-relaxed max-w-[210px]">
            Sur la base de dix minutes par extrait et douze extraits par vidéo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link
            data-track="webdl-promo-essai"
            href="/tubeforge/checkout?plan=sub&months=12"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-black text-[15px] transition-transform duration-200 hover:translate-y-[-1px]"
            style={{ background: `linear-gradient(118deg, ${AMBER} 0%, ${RED} 58%, #8b3dff 155%)` }}
          >
            Essayer 14 jours gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            data-track="webdl-promo-voir"
            href="/tubeforge"
            className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Voir TubeForge en action
          </Link>
        </div>
        <p className="text-[11px] text-white/32 mt-3.5">
          3,49&nbsp;€ par mois à l&apos;année. La carte est demandée, rien n&apos;est prélevé avant la fin
          des 14 jours, et tu annules en un clic.
        </p>
      </motion.div>
    </div>
  );
}

function fmtDuration(s: number | null) {
  if (!s) return null;
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m}:${sec}`;
}

export default function TelechargerPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Resolved | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Quand le refus vient d'un quota, le Worker joint de quoi expliquer ce que
  // TubeForge fait differemment. C'est le seul moment ou la personne a une
  // raison concrete de s'y interesser : elle vient de buter sur une limite.
  const [upsell, setUpsell] = useState<Upsell | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [done, setDone] = useState(false);
  // L'URL de connexion depend de window.location : la calculer au rendu
  // provoquerait un ecart entre le HTML du serveur et celui du client.
  const [authHref, setAuthHref] = useState("");
  // Poids du dernier fichier resolu : sert a personnaliser l'argumentaire avec
  // un chiffre que la personne vient reellement de vivre.
  const [dernierPoidsMo, setDernierPoidsMo] = useState<number | null>(null);
  const [dernierDureeSec, setDernierDureeSec] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const refreshMe = useCallback(async () => {
    try {
      setMe(await fetchMe());
    } catch {
      setMe({ auth: false });
    }
  }, []);

  useEffect(() => {
    setAuthHref(loginUrl());
    readTokenFromHash();
    refreshMe();
    // On prechauffe la session YouTube (quelques Ko) pendant que la personne
    // colle son lien. Le calcul BotGuard, lui, n'a plus lieu ici : il ne sert
    // qu'en secours si YouTube nous refuse (cf. lib/potoken.ts).
    warmSession();
  }, [refreshMe]);

  const onResolve = async () => {
    setError(null); setUpsell(null); setResult(null); setDone(false); setProgress(null);
    if (!url.trim()) return;
    setBusy(true);
    try {
      const r = await resolve(url.trim());
      if (!r.ok) {
        setError(r.err);
        setUpsell(r.upsell ?? null);
        if (r.needAuth) clearToken();
        await refreshMe();
      } else {
        setResult(r);
        setMe((m) => (m ? { ...m, quota: r.quota, serveur: r.serveur ?? m.serveur } : m));
        const octets = r.video ? (r.video.size ?? 0) + (r.audio?.size ?? 0) : r.file?.size ?? 0;
        if (octets > 0) setDernierPoidsMo(Math.round(octets / 1048576));
        if (r.meta?.durationSec) setDernierDureeSec(r.meta.durationSec);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async () => {
    if (!result) return;
    setError(null); setDone(false);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setProgress({ phase: "download", pct: 0, label: "Démarrage" });
    try {
      await download(result, setProgress, ctrl.signal);
      setDone(true);
    } catch (e) {
      if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : "Le téléchargement a échoué.");
    } finally {
      setProgress(null);
      abortRef.current = null;
    }
  };

  const connected = !!me?.auth && !!getToken();
  const member = connected && me?.member;
  // Le Worker decide seul s'il exige Discord ou non (constante REQUIRE_DISCORD).
  // La page suit : elle n'a pas sa propre notion de la porte, sinon les deux
  // finiraient par diverger. Tant que /api/me n'a pas repondu, on n'affiche rien.
  const gated = me?.gate === true;
  const toolOpen = me !== null && (gated ? member : true);
  const left = me?.quota ? Math.max(0, me.quota.limit - me.quota.used) : null;
  const srv = me?.serveur ?? null;
  const srvLeft = srv ? Math.max(0, srv.limit - srv.used) : null;

  /**
   * Quand une des deux reserves est vide, on ne laisse pas la personne cliquer
   * pour rien : on lui dit tout de suite, et on lui montre l'alternative. C'est
   * le moment le plus honnete pour parler de TubeForge — elle vient de se
   * cogner a une limite, pas au milieu d'un bandeau publicitaire.
   */
  const epuise: Upsell | null =
    left === 0
      ? {
          titre: "Tu télécharges assez pour que ça vaille le coup",
          texte:
            "Tes " + (me?.quota?.limit ?? 25) + " téléchargements du jour sont passés. TubeForge n’a pas de compteur : " +
            "autant de vidéos que tu veux, en 4K, déposées directement dans ta timeline Premiere ou DaVinci.",
        }
      : srvLeft === 0
        ? {
            titre: "Ne plus dépendre d’un quota partagé",
            texte:
              "Le serveur a épuisé sa réserve du jour — l’outil est gratuit, donc partagé entre tout le monde. " +
              "TubeForge télécharge sans limite et sans file d’attente.",
          }
        : null;

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "#07060f" }} />
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full blur-[170px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,106,31,0.12), rgba(239,68,68,0.05) 42%, transparent 72%)" }}
        />
        <div
          className="absolute top-[55%] right-[-14%] w-[520px] h-[520px] rounded-full blur-[180px]"
          style={{ background: "radial-gradient(circle at center, rgba(139,61,255,0.06), transparent 68%)" }}
        />
      </div>

      <Navbar />

      <main className="w-full relative z-10">
        <section className="pt-16 pb-20 md:pt-24 md:pb-28">
          {/* Pas de `max-w-*` ici : `.container-main` (globals.css) est declaree hors
                de tout @layer et l'emporte sur les utilitaires Tailwind v4 — la classe
                serait morte, et deviendrait un piege si le CSS global etait range un jour. */}
            <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="text-center"
            >
              {/* L'accroche suit l'etat reel de la porte : annoncer « sans compte »
                  alors qu'on demande Discord serait un mensonge des la premiere ligne. */}
              <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: "rgba(255,106,31,0.7)" }}>
                {gated ? "Gratuit pour les membres du Discord" : "Gratuit, sans compte"}
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-[-0.03em] mb-5">
                Télécharge une vidéo<span style={{ color: RED }}>.</span>
              </h1>
              {/* Ne dit plus « rien ne passe par nos serveurs » : c'est vrai pour X
                  et Twitch, faux pour YouTube dont le CDN interdit au navigateur de
                  lire les octets. On garde ce qui est vrai partout. */}
              <p className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
                Colle un lien, récupère le fichier. À pleine vitesse, sans recompression, et
                sans une seule publicité.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
                {PLATFORMS.map((p) => (
                  <span key={p.key} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/55">
                    {p.label}
                  </span>
                ))}
              </div>

              {/* Le vrai argument de cette page. Tout le monde a deja essaye un
                  telechargeur en ligne : faux boutons « Download », pop-up qui
                  s'ouvrent dans le dos, redirections, fichier recompresse en
                  480p avec un filigrane. Dire ce qu'on ne fait PAS est ici plus
                  convaincant que n'importe quelle liste de fonctionnalites. */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 mt-8">
                {[
                  "Zéro publicité",
                  "Zéro pop-up",
                  "Rien à installer",
                  "Aucune recompression",
                  "Sans filigrane",
                ].map((m) => (
                  <span key={m} className="inline-flex items-center gap-1.5 text-[13px] text-white/50">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: RED }} />
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ── Porte Discord ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: easeOutExpo }}
              className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >
              {gated && !connected && (
                <div className="text-center">
                  <p className="text-white/70 mb-1">Le téléchargeur est réservé aux membres du Discord.</p>
                  <p className="text-sm text-white/40 mb-6">C&apos;est gratuit, et ça prend dix secondes.</p>
                  <a
                    href={authHref}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white transition-transform duration-200 hover:translate-y-[-1px]"
                    style={{ background: "#5865F2" }}
                  >
                    <DiscordMark className="w-5 h-4" />
                    Se connecter avec Discord
                  </a>
                </div>
              )}

              {gated && connected && !member && (
                <div className="text-center">
                  <p className="text-white/80 mb-1">
                    Salut {me?.user?.name} — tu n&apos;es pas encore sur le serveur.
                  </p>
                  <p className="text-sm text-white/40 mb-6">Rejoins-le, puis reviens vérifier.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={me?.invite || "https://discord.com/invite/QuV3bYDEYT"}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white"
                      style={{ background: "#5865F2" }}
                    >
                      <DiscordMark className="w-5 h-4" />
                      Rejoindre le Discord
                    </a>
                    <a
                      href={authHref}
                      className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold hover:bg-white/10 transition-colors"
                    >
                      J&apos;ai rejoint, vérifier
                    </a>
                  </div>
                </div>
              )}

              {toolOpen && (
                <>
                  {/* Bandeau d'identite : n'a de sens que si la porte Discord est
                      active. Ouverte, on garde juste le compteur du jour. */}
                  {/* Identite sur sa ligne, compteurs sur la leur : entassés
                      cote a cote, les libelles passaient a la ligne et les
                      chiffres se retrouvaient loin de ce qu'ils comptent. */}
                  {gated && (
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {me?.user?.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element -- avatar Discord, domaine externe non liste dans next/image
                          <img src={me.user.avatar} alt="" className="w-7 h-7 rounded-full" />
                        )}
                        <p className="text-sm font-semibold truncate">{me?.user?.name}</p>
                      </div>
                      <button
                        onClick={() => { clearToken(); setMe({ auth: false }); setResult(null); }}
                        className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                        aria-label="Se déconnecter"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="mb-5 pb-5 border-b border-white/10">
                    <Compteurs perso={left} total={me?.quota?.limit ?? null} serveur={srv} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !busy && onResolve()}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 min-w-0 px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/25 font-mono text-sm focus:outline-none focus:border-[rgba(239,58,36,0.55)] transition-colors"
                    />
                    <button
                      onClick={onResolve}
                      disabled={busy || !url.trim()}
                      className="px-7 py-3.5 rounded-xl font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed transition-transform duration-200 enabled:hover:translate-y-[-1px] inline-flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(118deg, #ff6a1f 0%, #ef3a24 58%, #8b3dff 155%)" }}
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {busy ? "Analyse" : "Récupérer"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-5 py-4 text-sm text-red-200/90 leading-relaxed">
                {error}
              </div>
            )}

            {(upsell || epuise) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="mt-3 rounded-2xl border p-5 md:p-6"
                style={{ borderColor: "rgba(239,58,36,0.32)", background: "rgba(239,58,36,0.055)" }}
              >
                <p className="font-bold text-white mb-1.5">{(upsell || epuise)!.titre}</p>
                <p className="text-sm text-white/60 leading-relaxed">{(upsell || epuise)!.texte}</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-5">
                  <Link
                    data-track="webdl-upsell-essai"
                    href="/tubeforge/checkout?plan=sub&months=12"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-black transition-transform duration-200 hover:translate-y-[-1px]"
                    style={{ background: "linear-gradient(118deg, #ff6a1f 0%, #ef3a24 58%, #8b3dff 155%)" }}
                  >
                    Essayer 14 jours gratuitement
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    data-track="webdl-upsell-voir"
                    href="/tubeforge"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold text-sm hover:bg-white/10 transition-colors"
                  >
                    Voir ce que fait TubeForge
                  </Link>
                </div>
                <p className="text-[11px] text-white/30 mt-3">
                  Sans carte pendant l&apos;essai ? Non : la carte est demandée, mais rien n&apos;est prélevé
                  avant la fin des 14 jours, et tu annules en un clic.
                </p>
              </motion.div>
            )}

            {/* ── Resultat ──────────────────────────────────────────── */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                <div className="flex gap-4 p-5">
                  {result.meta.thumb && (
                    // eslint-disable-next-line @next/next/no-img-element -- miniatures multi-domaines (ytimg, tiktokcdn, twimg)
                    <img
                      src={result.meta.thumb}
                      alt=""
                      className="w-32 h-20 object-cover rounded-lg shrink-0 bg-black/40"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug line-clamp-2">{result.meta.title}</p>
                    <p className="text-xs text-white/40 mt-1.5 font-mono">
                      {[
                        result.meta.author,
                        fmtDuration(result.meta.durationSec),
                        result.video ? `${result.video.height}p` : result.file?.label,
                        result.video
                          ? `${(((result.video.size ?? 0) + (result.audio?.size ?? 0)) / 1048576).toFixed(0)} Mo`
                          : result.file?.size
                            ? `${(result.file.size / 1048576).toFixed(0)} Mo`
                            : null,
                      ].filter(Boolean).join("  ·  ")}
                    </p>
                    {result.downgraded && (
                      <p className="text-[11px] text-white/35 mt-2 leading-relaxed">
                        {result.downgradeReason === "plafond-youtube"
                          ? `Qualité réduite : YouTube limite en ce moment ce qu'il nous laisse récupérer${result.bestHeight ? ` (le ${result.bestHeight}p existe)` : ""}. Réessaie dans quelques minutes.`
                          : "Qualité réduite volontairement : en pleine résolution, cette vidéo dépasserait ce qu'un navigateur peut assembler en mémoire."}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  {progress ? (
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2">
                        <span>
                          {progress.phase === "download" ? "Téléchargement" : progress.phase === "merge" ? "Assemblage image + son" : "Enregistrement"}
                          {" — "}{progress.label}
                        </span>
                        <button
                          onClick={() => abortRef.current?.abort()}
                          className="inline-flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
                        >
                          <X className="w-3 h-3" /> annuler
                        </button>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-300"
                          style={{ width: `${progress.pct}%`, background: `linear-gradient(90deg, ${AMBER}, ${RED})` }}
                        />
                      </div>
                    </div>
                  ) : done ? (
                    <p className="inline-flex items-center gap-2 text-sm text-green-300/90">
                      <Check className="w-4 h-4" /> Fichier enregistré dans tes téléchargements.
                    </p>
                  ) : (
                    <button
                      onClick={onDownload}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-bold transition-transform duration-200 hover:translate-y-[-1px]"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger {result.video ? `en ${result.video.height}p` : ""}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            <PromoTubeForge poidsMo={dernierPoidsMo} dureeSec={dernierDureeSec} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
