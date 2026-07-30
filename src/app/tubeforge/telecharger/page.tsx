"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Download, Loader2, LogOut, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompatBadge from "@/components/shared/CompatBadge";
import {
  clearToken, download, EchecReseau, fetchMe, getToken, loginUrl, readHashResult, resolve, warmSession,
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
 * ⚠️ LA RESERVE COLLECTIVE NE S'AFFICHE PLUS QUAND ELLE VA BIEN.
 *
 * Elle etait rendue en permanence, en jauge, avec son chiffre : « 491 Go
 * restants sur 492 ». Ca ne veut rien dire pour la personne qui vient
 * telecharger une video — c'est un indicateur d'exploitation, et le mettre a cote
 * de son propre quota donne l'impression d'un tableau de bord interne laisse
 * ouvert par erreur.
 *
 * La raison de l'afficher tenait pourtant : sans elle, un refus ressemble a une
 * panne, alors qu'il s'agit d'une reserve partagee. Mais cette raison ne vaut
 * QU'AU MOMENT OU la reserve baisse. On la garde donc, en phrase et sans
 * gigaoctets, et seulement sous le seuil.
 */
/** Sous ce reste, la reserve partagee devient une information utile. Au-dessus,
 *  c'est du bruit. */
const SEUIL_RESERVE = 0.25;
function Compteurs({
  perso, total, serveur, octetsParUnite,
}: {
  perso: number | null;
  total: number | null;
  serveur: { used: number; limit: number } | null;
  /** Taille d'une unite de relais, fournie par le Worker. Absent tant que
   *  /api/me n'a pas repondu : on retombe sur la valeur de reference. */
  octetsParUnite?: number;
}) {
  if (perso === null || total === null) return null;
  const srvLeft = serveur ? Math.max(0, serveur.limit - serveur.used) : null;

  /**
   * Les compteurs sont en UNITES DE RELAIS cote Worker (~16 Mo chacune) depuis le
   * 30/07/2026. Personne ne sait ce qu'est une unite : on affiche des gigaoctets.
   *
   * C'est aussi plus honnete que l'ancien « 25 telechargements » : ce chiffre
   * etait le meme pour un TikTok de 3 Mo et un film de 500 Mo, donc il mentait
   * dans les deux sens.
   */
  const enGo = (unites: number) => {
    const go = (unites * (octetsParUnite ?? 16_000_000)) / 1073741824;
    return go >= 10 ? go.toFixed(0) : go.toFixed(1);
  };

  const Jauge = ({ reste, sur, libelle }: { reste: number; sur: number; libelle: string }) => {
    const p = sur > 0 ? Math.min(100, Math.max(0, (reste / sur) * 100)) : 0;
    const bas = p <= 20;
    const vide = reste === 0;
    return (
      <div className="min-w-0 flex-1">
        <p className="text-[11px] md:text-[10px] font-mono uppercase tracking-wider text-white/50 whitespace-nowrap mb-1">
          {libelle}
        </p>
        <p className="text-[13px] mb-2 whitespace-nowrap">
          <span className="font-mono tabular-nums font-semibold" style={{ color: vide ? RED : bas ? AMBER : "#fff" }}>
            {enGo(reste)}&nbsp;Go
          </span>
          <span className="text-white/40"> {vide ? "restant" : "restants"} sur {enGo(sur)}</span>
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
    /* Une seule jauge desormais : la mise en page a deux colonnes qui debordait a
       320 px n'a plus de raison d'exister. Elle avait ete calculee pour deux
       libelles en `whitespace-nowrap` cote a cote — a supprimer proprement plutot
       qu'a garder « au cas ou ». */
    <div>
      <Jauge reste={perso} sur={total} libelle="Ton quota du jour" />
      {/* Une phrase, pas une jauge, et seulement quand ca compte. Le chiffre
          exact n'aiderait personne : ce qui aide, c'est de savoir que ca vient
          d'un partage et que ca repart demain. */}
      {srvLeft !== null && serveur && serveur.limit > 0 && srvLeft / serveur.limit <= SEUIL_RESERVE && (
        <p className="text-[13px] md:text-[12px] text-white/45 leading-relaxed mt-3.5">
          {srvLeft === 0
            ? "La réserve partagée du jour est épuisée. Elle repart demain matin."
            : "La réserve partagée par tout le monde touche à sa fin aujourd’hui. Elle repart demain matin."}
        </p>
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
/** Une seule echelle de texte pour tout le bloc : c'est ce qui donne la grille
 *  de lecture. Trois niveaux (titre / secondaire / « ici ») plus la legende. */
const TITRE = "text-[15px] text-white leading-relaxed";
const SECONDAIRE = "text-sm text-white/52 leading-relaxed mt-1.5";
const ICI = "text-sm text-white/32 leading-relaxed mt-3";
const LEGENDE = "text-[12px] md:text-[11px] font-mono uppercase tracking-wider text-white/50 mt-2.5";

/** Une capacite : la preuve en image, le chiffre qui frappe, puis le texte. */
function Feature({
  src, w, h, alt, legende, chiffre, unite, titre, texte, ici,
}: {
  src: string; w: number; h: number; alt: string; legende: string;
  chiffre: string; unite: string; titre: string; texte: string; ici: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* eslint-disable-next-line @next/next/no-img-element -- capture locale */}
      <img src={src} alt={alt} className="w-full h-auto rounded-lg border border-white/10" loading="lazy" width={w} height={h} />
      <p className={legende ? LEGENDE : ""}>{legende}</p>

      <div className="flex items-baseline gap-2.5 mt-5">
        <span className="text-4xl font-black tracking-[-0.03em] leading-none" style={{ color: AMBER }}>{chiffre}</span>
        <span className="text-[12px] md:text-[11px] font-mono uppercase tracking-wider text-white/50">{unite}</span>
      </div>

      <p className={TITRE + " mt-3"}>{titre}</p>
      <p className={SECONDAIRE}>{texte}</p>
      <p className={ICI + " mt-auto pt-3"}>{ici}</p>
    </div>
  );
}

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
        <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-2">
          L’application payante d’Expédition
        </p>
        {/* L'accroche de section porte la PROMESSE, pas le detail d'une carte.
            La question chiffree (« combien vas-tu en garder ? ») a rejoint la
            carte qu'elle interroge : elle y a un sens, ici elle n'en avait que
            pour un tiers du bloc. */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-3">
          {/* Le nom du produit dans le titre, avec le wordmark anime de la
              one-page : sans ca, la page parlait de TubeForge sans jamais le
              presenter, et le lecteur ne comprenait pas qu'un autre produit
              existe. */}
          <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] max-w-2xl">
            <span className="tf-forge-flow">TubeForge</span> pose tes extraits sur ta
            timeline pendant que tu montes<span style={{ color: RED }}>.</span>
          </h2>
          {/* Les logos ici plutot qu'ailleurs : le titre parle de « ta timeline »,
              et la premiere question d'un monteur est de savoir si ca marche avec
              SON logiciel. Composant deja utilise dans le hero de la one-page. */}
          <div className="shrink-0">
            <CompatBadge />
          </div>
        </div>

        <p className="text-base text-white/52 leading-relaxed mb-6 max-w-2xl">
          Le téléchargement, la recherche du fichier dans un dossier, le glisser-déposer, la
          relecture pour retrouver le bon passage : les quatre gestes que TubeForge raccourcit.
        </p>

        {/* Le gain de temps remonte AVANT les preuves : c'est ce qu'on achete, et
            l'hypothese du calcul est ecrite a cote pour que le chiffre reste
            verifiable au lieu d'etre assene. */}
        <div
          className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border px-6 py-5 mb-8"
          style={{ borderColor: "rgba(239,58,36,0.28)", background: "rgba(239,58,36,0.05)" }}
        >
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-none" style={{ color: RED }}>2 h</span>
            <span className="text-sm text-white/52">par vidéo</span>
          </div>
          <span className="hidden sm:block w-px self-stretch bg-white/10" aria-hidden="true" />
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-none text-white">12 journées</span>
            <span className="text-sm text-white/52">de travail par an</span>
          </div>
          <p className="text-[13px] text-white/50 leading-relaxed sm:ml-auto sm:max-w-[290px]">
            Le temps que tu passes à récupérer des fichiers. Compté sur dix minutes par extrait,
            douze extraits par vidéo, une vidéo par semaine.
          </p>
        </div>
      </motion.div>

      {/* ── L'argument massue : le gaspillage, en proportions reelles ── */}
      <Carte r="24px 10px 22px 12px" tilt="-0.5deg" delay={0}>
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 items-center">
          <div>
            {/* La question vit ici, collee aux deux barres qui y repondent. Le
                lecteur ne peut pas deviner la reponse avant de les regarder :
                c'est ce qui lui fait descendre l'oeil. */}
            <p className="text-lg md:text-xl font-bold text-white leading-snug mb-6">
              {vecu
                ? `Tu viens de télécharger ${poids} Mo. Combien vas-tu en garder\u00A0?`
                : `Une vidéo de 15 minutes pèse ${poids} Mo. Combien vas-tu en garder\u00A0?`}
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
                Tu as attendu le reste pour rien.
              </p>
            </div>

            <p className={TITRE + " mt-8"}>
              Dans TubeForge, tu poses ton point d’entrée et ton point de sortie
              <span className="text-white/52"> avant </span>
              de télécharger. Sur une vidéo de deux heures, tu récupères tes trente
              secondes et tu passes à la suite.
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
            <p className={LEGENDE + " text-center"}>capture réelle · TubeForge</p>
          </div>
        </div>
      </Carte>

      {/* ── Le volume : deux cartes qui se repondent. Meme rapport de forme
             pour les deux captures (1,60 et 1,54) afin que la rangee se lise
             comme une grille et pas comme deux blocs empiles au hasard. ── */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Carte r="12px 24px 10px 22px" tilt="0.5deg" delay={0.06}>
          <Feature
            src="/tubeforge/real-multi-2.jpg"
            w={903}
            h={555}
            alt="TubeForge : recherche par mot-clé, neuf vidéos cochées, boutons MP4 (9) et MP3 (9)"
            legende="capture réelle · TubeForge"
            chiffre="9"
            unite="d’un coup"
            titre="Neuf vidéos, un seul clic."
            texte="Tu tapes un mot-clé, tu coches les vidéos qui t’intéressent, tout part ensemble. Tu n’as même pas besoin des liens."
            ici="Sur cette page : un lien, puis le suivant, et tu attends chaque fichier."
          />
        </Carte>

        <Carte r="22px 12px 24px 10px" tilt="-0.6deg" delay={0.12}>
          <Feature
            src="/tubeforge/real-playlist-2.jpg"
            w={902}
            h={632}
            alt="TubeForge : playlist de 53 vidéos, toutes sélectionnées, boutons MP4 (53) et MP3 (53)"
            legende="capture réelle · TubeForge"
            chiffre="53"
            unite="en un clic"
            titre="Cinquante-trois vidéos d’affilée."
            texte="Tu colles le lien de la playlist, elle descend au complet. L’option « Numéroter » garde l’ordre dans les noms de fichiers."
            ici="Sur cette page : les playlists ne passent pas."
          />
        </Carte>
      </div>

      {/* ── La destination : bande large, la capture de timeline s'y prete
             (rapport 2,86) et les chiffres tiennent a cote sans se serrer. ── */}
      <Carte r="24px 12px 10px 22px" tilt="0.45deg" delay={0.18} className="mt-4">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 md:gap-10 items-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element -- capture locale */}
            <img
              src="/tubeforge/real-timeline.jpg"
              alt="L’extrait posé sur une timeline Premiere Pro"
              className="w-full h-[124px] object-cover rounded-lg border border-white/10"
              style={{ objectPosition: "50% 35%" }}
              loading="lazy"
              width={830}
              height={290}
            />
            <p className={LEGENDE}>capture réelle · Premiere Pro</p>
          </div>
          <div>
            <p className={TITRE}>Le fichier arrive dans ton chutier, nommé, prêt à poser.</p>
            <p className={SECONDAIRE}>
              Tu restes dans Premiere ou DaVinci du début à la fin.
            </p>
            <p className={ICI}>
              Sur cette page : il atterrit dans tes Téléchargements, et tu vas le chercher.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-7 pt-6 border-t border-white/[0.07]">
          {[
            { n: "1500+", l: "sites" },
            { n: "4K", l: "maximum" },
            { n: "∞", l: "par jour" },
          ].map((st) => (
            <div key={st.l}>
              <p className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-none" style={{ color: AMBER }}>
                {st.n}
              </p>
              <p className={LEGENDE + " mt-1.5"}>{st.l}</p>
            </div>
          ))}
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
        {/* LE CHOC : la mise en regard. Douze journees de travail d'un cote,
            41,88 euros de l'autre. Les deux chiffres sortent du meme calcul,
            ecrit plus haut dans la bande de cout, donc la comparaison est
            verifiable et pas un effet de manche. C'est ce moment-la qui manquait :
            la page parlait de gain de temps sans jamais le mettre en face d'un
            prix, donc sans jamais donner a arbitrer. */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-8 mb-8">
          <div>
            <p className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95]" style={{ color: RED }}>
              12 journées
            </p>
            <p className="text-sm text-white/52 mt-2.5 leading-snug">
              de travail par an, passées à<br className="hidden sm:block" /> récupérer des fichiers
            </p>
          </div>

          <div className="flex sm:flex-col items-center gap-3">
            <span className="hidden sm:block w-px h-8 bg-white/12" aria-hidden="true" />
            <span className="text-[12px] md:text-[11px] font-mono uppercase tracking-widest text-white/50">contre</span>
            <span className="hidden sm:block w-px h-8 bg-white/12" aria-hidden="true" />
          </div>

          <div>
            <p className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-white">
              41,88&nbsp;€
            </p>
            <p className="text-sm text-white/52 mt-2.5 leading-snug">
              par an, soit 3,49&nbsp;€ par mois<br className="hidden sm:block" /> pour{" "}
              <span className="tf-forge-flow font-bold">TubeForge</span>
            </p>
          </div>
        </div>

        <p className="text-lg md:text-xl font-bold text-white leading-snug mb-6 max-w-xl">
          Quatorze jours pour voir si ça change ta façon de monter.
        </p>

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
        <p className="text-[13px] md:text-[11px] text-white/50 mt-3.5 leading-relaxed">
          3,49&nbsp;€ par mois à l&apos;année. On demande ta carte, on ne prélève rien avant le
          quinzième jour, et tu annules en un clic.
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Poids d'un fichier, dans l'unite qui se lit.
 *
 * « 1821 Mo » etait exact et illisible : personne ne convertit de tete, et
 * surtout ca ne se comparait pas au quota, qui est en gigaoctets. Deux nombres
 * cote a cote dans deux unites differentes, c'est le lecteur qui fait le calcul.
 */
function fmtPoids(octets: number): string {
  const go = octets / 1073741824;
  if (go >= 1) return (go >= 10 ? go.toFixed(0) : go.toFixed(1)) + " Go";
  return (octets / 1048576).toFixed(0) + " Mo";
}

function fmtDuration(s: number | null) {
  if (!s) return null;
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m}:${sec}`;
}

export default function TelechargerPage() {
  const [me, setMe] = useState<Me | null>(null);
  // Distinct de `me === null` : « pas encore lu » et « impossible de lire » ne
  // meritent pas le meme ecran, et surtout pas la meme hypothese sur la porte.
  const [echecMe, setEchecMe] = useState(false);
  /** Ce qui a REELLEMENT echoue en lisant /api/me. Sans ca, l'ecran d'echec
   *  disait « Impossible de vérifier ton accès » — un probleme de droits, alors
   *  qu'il s'agit d'un domaine injoignable. */
  const [causeEchec, setCauseEchec] = useState<{ message: string; detail: string | null } | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Resolved | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Verdict du secours anti-robot, joint au refus. Discret mais present : c'est
  // la seule information qui distingue trois causes de refus identiques a l'ecran.
  const [detailTechnique, setDetailTechnique] = useState<string | null>(null);
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

  /**
   * ⚠️ Le repli d'echec est le point sensible de tout ce fichier.
   *
   * Avant, un `/api/me` en echec faisait `setMe({ auth: false })`. Consequence :
   * `gated` passait a FAUX — donc la page cachait le bouton Discord et affichait
   * le champ de saisie, alors que le Worker, lui, exigeait toujours Discord.
   * Chaque collage repartait avec « Connecte-toi avec Discord » et aucun moyen de
   * le faire. C'est exactement le symptome rapporte : « le bouton Discord ne
   * s'affiche pas, et quand je colle un lien ça ne marche pas ».
   *
   * La porte est une decision du serveur. Quand on n'a pas pu la lire, on ne
   * DEVINE pas qu'elle est ouverte : on le dit et on propose de reessayer.
   */
  /**
   * Marque la visite dans Clarity selon que le telechargeur repond ou non.
   *
   * Objectif : remplacer « ca casse peut-etre chez certains » par un TAUX, avec
   * la repartition par pays que Clarity fournit deja. On passe par Clarity plutot
   * que par une route a nous pour deux raisons : le site est a 12 fonctions
   * serverless, soit le plafond du plan Vercel, et surtout une route a nous ne
   * dirait rien du pays.
   *
   * Le fragment Clarity du layout definit `window.clarity` de facon SYNCHRONE (il
   * empile les appels en attendant le script), donc appeler tot est sans risque.
   * Enveloppe quand meme : Clarity est lui-meme bloque par certains bloqueurs, et
   * un outil de mesure ne doit jamais casser ce qu'il mesure.
   */
  /** Vrai quand le dernier telechargement a echoue sur un refus d'octets : c'est
   *  le seul cas ou lancer le diagnostic tout de suite apporte quelque chose. */
  const [echecTelechargement, setEchecTelechargement] = useState(false);

  /** Meme mecanique que `marquerEtat`, mais pour n'importe quelle cle. Enveloppe
   *  pour la meme raison : un outil de mesure ne doit jamais casser ce qu'il mesure. */
  const marquerEtat2 = useCallback((cle: string, valeur: string) => {
    try {
      (window as Window & { clarity?: (...a: unknown[]) => void }).clarity?.("set", cle, valeur);
    } catch { /* mesure absente : sans consequence */ }
  }, []);

  const marquerEtat = useCallback((etat: "joignable" | "injoignable" | "erreur") => {
    try {
      (window as Window & { clarity?: (...a: unknown[]) => void }).clarity?.("set", "webdl_worker", etat);
    } catch { /* mesure absente : sans consequence */ }
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const r = await fetchMe();
      setMe(r);
      setEchecMe(false);
      marquerEtat("joignable");
    } catch (e) {
      setMe(null);
      setEchecMe(true);
      setCauseEchec({
        message: e instanceof Error ? e.message : "Le téléchargeur n’a pas pu être joint.",
        detail: e instanceof EchecReseau ? e.detail : null,
      });
      // On distingue « bloque avant d'atteindre le serveur » (filtrage reseau) de
      // « le serveur a repondu quelque chose de faux » : deux causes, deux
      // reparations, et les confondre dans la mesure la rendrait inutile.
      marquerEtat(e instanceof EchecReseau ? "injoignable" : "erreur");
    }
  }, [marquerEtat]);

  useEffect(() => {
    setAuthHref(loginUrl());
    // Un retour de Discord qui a echoue depose sa raison dans le fragment. Sans
    // ca, la personne revenait sur une page d'apparence normale qui refusait de
    // fonctionner sans jamais dire pourquoi.
    const retour = readHashResult();
    if (retour.erreur) setError(retour.erreur);
    refreshMe();
    // On prechauffe la session YouTube (quelques Ko) pendant que la personne
    // colle son lien. Le calcul BotGuard, lui, n'a plus lieu ici : il ne sert
    // qu'en secours si YouTube nous refuse (cf. lib/potoken.ts).
    warmSession();
  }, [refreshMe]);

  const onResolve = async () => {
    setError(null); setDetailTechnique(null); setUpsell(null); setResult(null); setDone(false); setProgress(null);
    if (!url.trim()) return;
    setBusy(true);
    try {
      const r = await resolve(url.trim());
      if (!r.ok) {
        setError(r.err);
        // Verdict du secours anti-robot. Sans lui, « YouTube nous a pris pour un
        // robot » ne dit pas si le secours a ete tente, s'il a echoue, ou s'il a
        // reussi et que YouTube refuse quand meme — trois causes qui appellent
        // trois corrections differentes.
        setDetailTechnique(r.attestation ?? null);
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
    setError(null); setDone(false); setEchecTelechargement(false);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setProgress({ phase: "download", pct: 0, label: "Démarrage" });
    try {
      await download(result, setProgress, ctrl.signal);
      setDone(true);
      /**
       * Le compteur affiche ne bougeait plus apres un telechargement.
       *
       * Effet de bord du deplacement du debit : il se fait maintenant dans le
       * relais, pas dans la reponse de resolution — donc plus rien ne rafraichit
       * le chiffre a l'ecran. On lisait « 8,9 Go restants » avant ET apres avoir
       * telecharge, ce qui donne l'impression d'un compteur decoratif.
       *
       * Le delai n'est pas une precaution vague : la base cle-valeur est a
       * coherence differee, et relire tout de suite renverrait l'ancienne valeur.
       * Mesure du jour : il faut une vingtaine de secondes pour qu'une ecriture
       * soit visible partout. On attend, puis on relit.
       */
      setTimeout(() => { refreshMe(); }, 20_000);
    } catch (e) {
      if (!ctrl.signal.aborted) {
        const msg = e instanceof Error ? e.message : "Le téléchargement a échoué.";
        setError(msg);
        /**
         * L'ECHEC SE SIGNALE TOUT SEUL.
         *
         * Jusqu'ici je dependais d'une personne pour lancer une page de
         * diagnostic AU MOMENT ou ca casse. Vecu le 30/07/2026 : deux
         * diagnostics recus, tous les deux verts — parce qu'ils ont ete lances
         * quand ca marchait, et l'un dans un autre navigateur que celui qui
         * echouait. Une mesure qui depend du bon timing d'un tiers n'est pas
         * une mesure.
         *
         * Le marqueur Clarity porte la NATURE de l'echec, et Clarity fournit
         * deja le pays et le navigateur. Le taux et sa geographie se liront donc
         * sans que personne n'ait rien a faire.
         */
        const nature = /code 403/.test(msg) ? "octets-403"
          : /coupée pendant le téléchargement/.test(msg) ? "coupure-reseau"
          : /mémoire|4 Go|500 Mo/.test(msg) ? "trop-lourd"
          : "autre";
        marquerEtat2("webdl_dl_echec", nature);
        // Ce drapeau fait apparaitre l'invitation a lancer le diagnostic
        // MAINTENANT, pendant que la panne est encore la.
        setEchecTelechargement(nature === "octets-403");
      }
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
  /** Poids du fichier resolu, quelle que soit la plateforme. Calcule une fois :
   *  l'expression etait dupliquee dans la fiche et dans l'argumentaire. */
  const octetsResultat = result
    ? result.video
      ? (result.video.size ?? 0) + (result.audio?.size ?? 0)
      : result.file?.size ?? 0
    : 0;
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
            "Tu as utilisé ton quota du jour. TubeForge n’a pas de compteur : " +
            "autant de vidéos que tu veux, en 4K, déposées dans ton chutier Premiere ou DaVinci.",
        }
      : srvLeft === 0
        ? {
            titre: "Ne plus dépendre d’un quota partagé",
            // « tous les membres » nommait le Discord, dont la porte est ouverte
            // depuis le 28/07/2026 : le message tombait sur des gens qui n'en
            // font pas partie et ne comprenaient pas de quels membres on parle.
            texte:
              "Le téléchargeur a épuisé sa réserve du jour. Il est gratuit, donc tout le monde " +
              "se partage la même réserve. TubeForge n’a ni compteur ni file d’attente.",
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
              {/* Cette ligne ne parle plus de la porte Discord, et c'est voulu.
                  Elle disait « Gratuit, sans compte » tant que /api/me n'avait pas
                  repondu, puis se corrigeait : la premiere phrase de la page etait
                  donc fausse pendant deux cents millisecondes, et sautait sous les
                  yeux. On garde ici la seule promesse vraie dans tous les cas ; la
                  condition d'acces est dite dans la carte, a l'endroit ou elle
                  s'applique. */}
              <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: "rgba(255,106,31,0.7)" }}>
                Gratuit, sans publicité
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-[-0.03em] mb-5">
                Télécharge une vidéo<span style={{ color: RED }}>.</span>
              </h1>
              {/* Ne dit plus « rien ne passe par nos serveurs » : c'est vrai pour X
                  et Twitch, faux pour YouTube dont le CDN interdit au navigateur de
                  lire les octets. On garde ce qui est vrai partout. */}
              <p className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
                Colle un lien, récupère le fichier. Pas de publicité, pas de recompression.
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
                  "Aucune publicité",
                  "Aucun pop-up",
                  "Rien à installer",
                  "Le fichier d’origine, sans filigrane",
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
              {/* Tant que le worker n'a pas dit si la porte est fermee, aucune des
                  trois branches ci-dessous ne rendait quoi que ce soit : la carte
                  restait un rectangle vide, puis le bouton Discord apparaissait
                  d'un coup. Vu de l'autre cote, l'outil avait l'air casse. On
                  occupe la place avec la forme de ce qui arrive, aux memes
                  dimensions, pour que rien ne saute. */}
              {me === null && !echecMe && (
                <div className="text-center" aria-busy="true" aria-label="Vérification de l’accès">
                  <div className="h-4 w-64 max-w-full mx-auto rounded bg-white/[0.07] animate-pulse" />
                  <div className="h-3 w-44 max-w-full mx-auto rounded bg-white/[0.05] animate-pulse mt-3.5" />
                  <div className="h-[50px] w-[266px] max-w-full mx-auto rounded-xl bg-white/[0.06] animate-pulse mt-7" />
                </div>
              )}

              {/* Echec de lecture de la porte. On ne montre PAS le champ de saisie :
                  il ne servirait qu'a produire un refus incomprehensible. */}
              {echecMe && (
                <div className="text-center">
                  {/* Ne dit plus « ton accès » : ce mot designe des droits, et
                      envoyait chercher un probleme de compte alors que le
                      domaine du service est simplement injoignable. */}
                  <p className="text-white/80 mb-1">Le téléchargeur est injoignable.</p>
                  <p className="text-[14px] md:text-[13px] text-white/45 mb-6 max-w-md mx-auto leading-relaxed">
                    {causeEchec?.message ??
                      "Ta connexion fonctionne — c’est notre service qui n’est pas accessible depuis ton réseau."}
                  </p>
                  <button
                    onClick={() => { setEchecMe(false); setCauseEchec(null); refreshMe(); }}
                    className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold hover:bg-white/10 transition-colors"
                  >
                    Réessayer
                  </button>
                  {/* Le detail technique, discret mais present : c'est la seule
                      chose qui permet de trancher a distance entre « notre
                      service est tombé » et « ce réseau bloque ce domaine ». */}
                  {causeEchec?.detail && (
                    <p className="mt-5 pt-4 border-t border-white/[0.07] text-[12px] font-mono text-white/30 max-w-md mx-auto break-words">
                      {causeEchec.detail}
                    </p>
                  )}
                </div>
              )}

              {gated && !connected && (
                <div className="text-center">
                  {/* Les DEUX etapes, dites avant le clic.
                      Manque corrige : le bouton disait « se connecter », ce qui
                      suppose qu'on a deja acces. Quelqu'un qui n'est pas encore
                      sur le serveur autorisait donc Discord, revenait, et
                      decouvrait SEULEMENT LA qu'il fallait d'abord rejoindre —
                      un aller-retour inutile, au pire moment. On annonce la
                      sequence complete des le depart. */}
                  <p className="text-white/80 mb-1.5">
                    Le téléchargeur est réservé aux membres du Discord Expédition.
                  </p>
                  <p className="text-sm text-white/50 mb-6">
                    Deux étapes : rejoindre le serveur, puis se connecter ici pour qu’on vérifie.
                    C’est gratuit et ça prend dix secondes.
                  </p>

                  {/* Deux actions reellement differentes, donc deux boutons —
                      mais UN SEUL plein. La connexion est la seule etape que tout
                      le monde fait (un membre saute la premiere), c'est donc elle
                      qui porte le poids visuel. */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-3 mb-3">
                    <a
                      href={me?.invite || "https://discord.com/invite/QuV3bYDEYT"}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white/85 bg-white/[0.06] border border-white/15 hover:bg-white/[0.1] transition-colors"
                    >
                      <span className="font-mono text-xs text-white/45">1</span>
                      Rejoindre le Discord
                    </a>

                    {/* ORDRE : les deux boutons D'ABORD, les explications ensuite.
                        Mesure qui a impose ce choix : en placant la presentation
                        d'Expedition avant eux, la carte montait a 1062 px (131 %
                        de l'ecran) et le bouton tombait a 948 px, donc SOUS LE PLI
                        a 812 px. On enterrait l'action principale derriere un mur
                        de texte. Qui connait deja Expedition agit tout de suite ;
                        qui ne connait pas lit juste en dessous. */}
                    <a
                      href={authHref}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white transition-transform duration-200 hover:translate-y-[-1px]"
                      style={{ background: "#5865F2" }}
                    >
                      <span className="font-mono text-xs text-white/60">2</span>
                      <DiscordMark className="w-5 h-4" />
                      Se connecter
                    </a>
                  </div>

                  <p className="text-[13px] text-white/50 mb-1">
                    Déjà sur le serveur ? L’étape 2 suffit.
                  </p>

                  {/* Ce qu'on demande de rejoindre.
                      Trou d'entonnoir corrige : la page exigeait l'adhesion a un
                      serveur sans jamais dire ce qu'on y trouve. « Reserve aux
                      membres du Discord » se lisait alors comme un peage, pas
                      comme une porte. Trois usages concrets valent mieux qu'une
                      phrase sur une « communaute active » : on nomme ce qu'on y
                      FAIT.

                      « Plus de 600 » plutot que le compte exact (635 au 27/07) :
                      un chiffre fige perime tout seul, et un chiffre faux sur la
                      page qui promet de l'honnetete couterait plus qu'il ne
                      rapporte. Un compteur en direct reste possible via l'API
                      d'invitation, si on veut. */}
                  <div className="mt-8 pt-7 border-t border-white/[0.07] text-left max-w-md mx-auto">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-white/50 mb-3">
                      Expédition, c’est quoi
                    </p>
                    <p className="text-[14px] md:text-[13px] text-white/75 leading-relaxed mb-3.5">
                      Un serveur de plus de 600 monteurs et vidéastes francophones.
                    </p>
                    <ul className="space-y-1.5">
                      {[
                        ["Poser ses questions", "montage, YouTube, business, et obtenir une réponse"],
                        ["Trouver une mission, ou un monteur", "les offres et les portfolios y circulent"],
                        ["Les outils de la maison", "TubeForge, ClipForge, et ce téléchargeur"],
                      ].map(([quoi, detail]) => (
                        <li key={quoi} className="flex items-start gap-2 text-[14px] md:text-[13px] leading-relaxed">
                          <Check className="w-3.5 h-3.5 shrink-0 mt-[4px]" style={{ color: RED }} />
                          <span className="text-white/75">
                            {quoi} <span className="text-white/50">— {detail}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Levee de doute.
                      « Se connecter avec Discord » sur un site tiers declenche le
                      meme reflexe qu'un lien de phishing, et c'est un reflexe SAIN :
                      c'est exactement la forme que prend le vol de compte. On ne
                      repond donc pas « fais-nous confiance », on annonce a l'avance
                      ce que l'ecran suivant va montrer. Quand Discord affiche
                      ensuite les memes autorisations, l'ecran CONFIRME au lieu de
                      surprendre — et l'e-mail est nomme ici plutot que decouvert
                      la-bas, ou il ressemblerait a une prise en traitre.

                      Ecrit en PROSE et sans coches, deliberement : une seconde
                      liste a coches juste apres celle du dessus se lisait comme
                      une repetition et ajoutait 90 px pour rien. */}
                  <div className="mt-7 pt-6 border-t border-white/[0.07] text-left max-w-md mx-auto">
                    <p className="text-[14px] md:text-[13px] text-white/55 leading-relaxed">
                      C’est la connexion officielle de Discord, la même que sur n’importe quel site
                      qui l’utilise. <span className="text-white/75">Ton mot de passe se tape sur
                      discord.com</span>, jamais ici : on ne le voit à aucun moment.
                    </p>
                    <p className="text-[14px] md:text-[13px] text-white/55 leading-relaxed mt-3">
                      Discord te demandera <span className="text-white/75">ton pseudo, la liste de tes
                      serveurs et ton e-mail</span> : de quoi t’afficher ici, vérifier que tu es bien
                      sur Expédition, et te prévenir si l’outil change. On ne peut ni lire tes
                      messages, ni écrire à ta place. Tu retires l’accès quand tu veux depuis les
                      réglages de ton compte Discord.
                    </p>
                  </div>
                </div>
              )}

              {gated && connected && !member && (
                <div className="text-center">
                  <p className="text-white/80 mb-1">
                    Salut {me?.user?.name}. Tu n&apos;es pas encore sur le serveur.
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
                    <Compteurs perso={left} total={me?.quota?.limit ?? null} serveur={srv} octetsParUnite={me?.quota?.octetsParUnite} />
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
                {detailTechnique && (
                  <p className="mt-2.5 pt-2.5 border-t border-red-500/20 text-[12px] font-mono text-red-200/60">
                    {detailTechnique}
                  </p>
                )}
                {/**
                  * SECOURS : le lien direct, quand le relais a refuse les octets.
                  *
                  * Ce lien ne passe PAS par nos serveurs — les octets vont de
                  * YouTube a la machine du visiteur. Il contourne donc par
                  * construction tout ce qui bloque notre relais, quelle que soit
                  * la cause : adresse de sortie signalee, filtrage, vague de
                  * refus. On n'a pas besoin de connaitre le probleme pour que ce
                  * chemin fonctionne.
                  *
                  * Il existait deja mais n'apparaissait QUE si aucun flux haute
                  * qualite n'etait disponible. Consequence vecue le 30/07/2026 :
                  * une personne voyait un echec total alors qu'un chemin
                  * fonctionnel etait a cote, invisible.
                  *
                  * Place AVANT la demande de diagnostic, deliberement : la
                  * personne veut sa video, pas nous aider. On lui donne d'abord
                  * ce qui marche.
                  */}
                {echecTelechargement && result?.lienDirect && (
                  <div className="mt-3.5 pt-3.5 border-t border-red-500/20">
                    <p className="text-[13px] text-red-100/80 leading-relaxed mb-3">
                      Il reste un chemin qui ne passe pas par nos serveurs, donc que ce blocage
                      n’atteint pas. La qualité est plus basse, mais tu repars avec la vidéo.
                    </p>
                    <a
                      href={result.lienDirect.url}
                      {...(result.lienDirect.forceTelechargement
                        ? { download: "" }
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-bold text-sm transition-transform duration-200 hover:translate-y-[-1px]"
                    >
                      <Download className="w-4 h-4" />
                      {result.lienDirect.forceTelechargement
                        ? `Récupérer en ${result.lienDirect.height}p à la place`
                        : `Ouvrir en ${result.lienDirect.height}p à la place`}
                    </a>
                    {/* Meme piege que sur le chemin principal : sans en-tete
                        d'attachement, le navigateur LIT la video au lieu de
                        l'enregistrer. On ne peut pas le forcer, on le dit. */}
                    {!result.lienDirect.forceTelechargement && (
                      <p className="text-[12px] text-red-200/55 leading-relaxed mt-2.5">
                        YouTube l’ouvrira dans un onglet. Clic droit dessus puis
                        «&nbsp;Enregistrer la vidéo sous…&nbsp;».
                      </p>
                    )}
                  </div>
                )}

                {/* Le diagnostic ne vaut quelque chose que lance PENDANT la panne.
                    Le proposer ici, dans la seconde qui suit l'echec, est le seul
                    moment ou la personne a une raison de le faire — et ou le
                    resultat sera exploitable. */}
                {echecTelechargement && (
                  <p className="mt-2.5 pt-2.5 border-t border-red-500/20 text-[13px] text-red-200/70 leading-relaxed">
                    Ça nous aiderait beaucoup :{" "}
                    <Link
                      href="/tubeforge/telecharger/diagnostic"
                      className="underline decoration-red-300/40 hover:decoration-red-300"
                    >
                      lance ce test maintenant
                    </Link>{" "}
                    — dans le même navigateur, pendant que la panne est là — et envoie-nous le résultat.
                  </p>
                )}
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
                <p className="text-[13px] md:text-[11px] text-white/50 mt-3 leading-relaxed">
                  On demande ta carte à l&apos;inscription et on ne prélève rien avant le quinzième
                  jour. Tu annules en un clic depuis Mon compte.
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
                        octetsResultat ? fmtPoids(octetsResultat) : null,
                      ].filter(Boolean).join("  ·  ")}
                    </p>
                    {/* Ce que ce fichier laisse du quota du jour.
                        Le poids seul ne repond pas a la question que la personne
                        se pose vraiment — « est-ce que je peux, et apres ? ».
                        Le quota est deja debite a la resolution cote Worker, donc
                        `left` reflete l'etat APRES cette video : on l'annonce tel
                        quel plutot que de refaire le calcul et risquer l'ecart. */}
                    {octetsResultat > 0 && left !== null && me?.quota?.octetsParUnite && (
                      <p className="text-[13px] md:text-[11px] text-white/40 mt-2">
                        {left > 0
                          ? `Il te reste ${fmtPoids(left * me.quota.octetsParUnite)} aujourd’hui.`
                          : "C’était ton dernier téléchargement du jour."}
                      </p>
                    )}
                    {result.downgraded && (
                      <p className="text-[13px] md:text-[11px] text-white/50 mt-2 leading-relaxed">
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
                          {" · "}{progress.label}
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
                  ) : result.lienDirect && (!result.video || (result.lienDirect.height ?? 0) > result.video.height) ? (
                    /**
                     * ⛔ NE PAS PROPOSER LE PIRE DES DEUX CHEMINS.
                     *
                     * Ce bloc ne s'affichait QUE si aucun flux adaptatif n'existait.
                     * Or quand YouTube nous rabat sur un client plafonne a 25 Mo,
                     * le chemin « principal » tombe a 240p — pendant que le lien
                     * direct offre 360p ET ne passe pas par notre relais.
                     *
                     * Vecu le 31/07/2026 sur `BYHkFkWxebg` : on proposait 240p par
                     * le relais, puis le telechargement echouait en 403 sur la
                     * deuxieme tranche. Le 360p direct etait la, meilleur et plus
                     * fiable, et on ne le montrait pas.
                     *
                     * Regle : des que le lien direct fait MIEUX que le chemin
                     * adaptatif, c'est lui le chemin principal.
                     */
                    /**
                     * YouTube : LIEN DIRECT, sans passer par nos serveurs.
                     *
                     * SECOURS uniquement, quand aucun flux adaptatif n'est
                     * disponible. Le chemin normal reste le 1080p par le relais
                     * puis fusion dans le navigateur.
                     *
                     * ⚠️ Ce bloc a failli devenir le chemin principal sur une
                     * conclusion FAUSSE. Le 27/07 j'ai mesure 13 refus sur 13 du
                     * relais et j'en ai deduit que googlevideo refusait les
                     * octets a toute adresse de datacenter. C'etait mon propre
                     * volume de tests qui avait grille l'IP de sortie : remesure
                     * quelques heures plus tard, le meme relais sert 9 tranches
                     * sur 9, dont une a 424 Mo d'offset sur une video de 427 Mo.
                     * Une mesure repetee treize fois d'affilee sur une ressource
                     * partagee ne mesure plus la ressource, elle mesure l'effet
                     * de la mesure.
                     *
                     * Ce que ce chemin garde d'utile : les octets passent par la
                     * connexion du visiteur, donc il fonctionne meme si le relais
                     * venait a etre refuse. Son prix est la qualite — 360p au
                     * mieux, aucun client YouTube ne servant de fichier unique
                     * au-dela (verifie sur 23 clients).
                     */
                    <div>
                      <a
                        href={result.lienDirect.url}
                        {...(result.lienDirect.forceTelechargement
                          ? { download: "" }
                          : { target: "_blank", rel: "noopener noreferrer" })}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-bold transition-transform duration-200 hover:translate-y-[-1px]"
                      >
                        <Download className="w-4 h-4" />
                        {result.lienDirect.forceTelechargement
                          ? `Télécharger en ${result.lienDirect.height}p`
                          : `Ouvrir la vidéo en ${result.lienDirect.height}p`}
                      </a>
                      {/* Cas `gir=yes` : le serveur de YouTube n'envoie pas
                          d'en-tete d'attachement, donc le navigateur LIT la video
                          au lieu de l'enregistrer. On ne peut pas le forcer — on
                          le dit, plutot que de laisser la personne devant un
                          onglet qu'elle n'attendait pas. */}
                      {!result.lienDirect.forceTelechargement && (
                        <p className="text-[13px] text-white/50 leading-relaxed mt-3">
                          Sur cette vidéo, YouTube l&apos;ouvre dans un onglet au lieu de
                          l&apos;enregistrer. Fais un clic droit dessus puis
                          «&nbsp;Enregistrer la vidéo sous…&nbsp;».
                        </p>
                      )}
                      {/* Deux situations tres differentes menent ici, et elles
                          n'appellent pas la meme explication. */}
                      {result.video && (
                        <p className="text-[13px] text-white/50 leading-relaxed mt-3">
                          YouTube limite en ce moment ce qu&apos;il nous laisse relayer — il ne nous
                          laisserait passer que du {result.video.height}p. Ce lien-ci te donne mieux,
                          et il ne passe pas par nos serveurs : c&apos;est aussi le plus fiable des
                          deux en ce moment.
                        </p>
                      )}
                      <p className="text-[13px] text-white/50 leading-relaxed mt-3">
                        {result.lienDirect.height}p, c&apos;est le maximum qu&apos;un navigateur peut
                        récupérer sur YouTube sans rien installer : au-delà, YouTube sépare
                        l&apos;image et le son et refuse de nous les laisser réunir.
                        <span className="text-white/70"> TubeForge télécharge depuis ta connexion</span>,
                        donc il n&apos;a pas cette limite — jusqu&apos;à la 4K, image et son réunis.
                      </p>
                    </div>
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
