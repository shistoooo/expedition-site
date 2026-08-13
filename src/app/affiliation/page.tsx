"use client";

/**
 * OÙ ATTERRIT UN LIEN D'INVITATION AU PROGRAMME D'AFFILIATION.
 *
 * Le parcours voulu, en une phrase : tu envoies un lien, la personne se
 * connecte avec son compte Expédition, elle est affiliée.
 *
 * ⚠️ POURQUOI CETTE PAGE ET PAS `/ambassador`.
 * `/ambassador` est dans `CHEMINS_SUITE` : sur `expeditionlauncher.store`, le
 * middleware la renvoie vers TubeForge en 307 (vérifié en production). Un lien
 * d'invitation qui pointe dessus est un lien mort. `/affiliation` n'est pas
 * dans cette liste — qui énumère ce qu'on REFUSE, pas ce qu'on autorise — donc
 * elle est servie sans rien changer au middleware.
 *
 * Le jeton reste dans l'URL tant qu'il n'est pas consommé : quelqu'un qui
 * arrive déconnecté va se connecter, revient, et le lien fonctionne encore.
 */

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AFFILIATION_CONDITIONS, AFFILIATION_CONDITIONS_VERSION } from "@/lib/affiliation-conditions";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";
const AMBRE = "#ff6a1f";

type Etat =
  | { phase: "chargement" }
  | { phase: "sans-jeton" }
  | { phase: "connexion-requise" }
  // La charte s'affiche AVANT de consommer le lien : tant que la personne n'a
  // pas validé, l'invitation reste intacte et elle peut revenir.
  | { phase: "charte"; accessToken: string }
  | { phase: "en-cours" }
  | { phase: "ok"; code: string; deja: boolean }
  | { phase: "erreur"; message: string };

function Contenu() {
  const jeton = useSearchParams().get("invitation")?.trim() ?? "";
  const [etat, setEtat] = useState<Etat>({ phase: "chargement" });
  const [copie, setCopie] = useState(false);
  const [accepte, setAccepte] = useState(false);

  useEffect(() => {
    if (!jeton) { setEtat({ phase: "sans-jeton" }); return; }
    let vivant = true;

    (async () => {
      try {
        // Le cookie `expedition_session` est la source de vérité du login côté
        // site ; `/api/auth/me` le convertit en jeton d'accès pour le worker.
        const me = await fetch("/api/auth/me", { credentials: "include" });
        const { accessToken } = (await me.json()) as { accessToken?: string };
        if (!vivant) return;
        if (!accessToken) { setEtat({ phase: "connexion-requise" }); return; }

        /**
         * On S'ARRÊTE ici. Avant, ouvrir le lien en étant connecté rendait
         * affilié sur-le-champ : aucune charte, rien à valider, rien de tracé.
         * La personne devenait partenaire d'un programme dont elle n'avait lu
         * aucune règle, sur un simple clic dans un message.
         */
        setEtat({ phase: "charte", accessToken });
      } catch {
        if (vivant) setEtat({ phase: "erreur", message: "Connexion impossible. Réessaie dans un instant." });
      }
    })();

    return () => { vivant = false; };
  }, [jeton]);

  /** Consomme l'invitation. Appelée UNIQUEMENT après validation de la charte. */
  const rejoindre = async (accessToken: string) => {
    setEtat({ phase: "en-cours" });
    try {
      const r = await fetch(`${WORKER_URL}/ambassador/invitation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ token: jeton, conditionsVersion: AFFILIATION_CONDITIONS_VERSION }),
      });
      const d = (await r.json()) as { referralCode?: string; deja?: boolean; error?: string; message?: string };
      if (!r.ok || !d.referralCode) {
        setEtat({ phase: "erreur", message: d.message ?? d.error ?? "Ce lien n'a pas pu être utilisé." });
        return;
      }
      setEtat({ phase: "ok", code: d.referralCode, deja: !!d.deja });
    } catch {
      setEtat({ phase: "erreur", message: "Connexion impossible. Réessaie dans un instant." });
    }
  };

  // On renvoie vers la connexion en GARDANT le jeton dans l'adresse de retour :
  // sans ça, la personne se connecte et retombe sur une page qui ne sait plus
  // pourquoi elle est là.
  const retour = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/affiliation";
  const lienConnexion = `/account?next=${encodeURIComponent(retour)}`;

  const Cadre = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-lg mx-auto w-full rounded-2xl border p-8 md:p-10 text-center"
         style={{ borderColor: "rgba(255,106,31,0.28)", background: "rgba(255,106,31,0.04)" }}>
      {children}
    </div>
  );

  if (etat.phase === "chargement" || etat.phase === "en-cours") {
    return <Cadre><p className="text-white/50">On vérifie ton invitation…</p></Cadre>;
  }

  if (etat.phase === "sans-jeton") {
    return (
      <Cadre>
        <h1 className="text-2xl font-black mb-3">Programme d&apos;affiliation</h1>
        <p className="text-white/55 mb-6">
          Cette page s&apos;ouvre avec un lien d&apos;invitation. Si tu en as reçu un, ouvre-le : il contient ton accès.
        </p>
        <Link href="/tubeforge" className="text-sm font-semibold" style={{ color: AMBRE }}>
          Découvrir TubeForge →
        </Link>
      </Cadre>
    );
  }

  if (etat.phase === "connexion-requise") {
    return (
      <Cadre>
        <h1 className="text-2xl font-black mb-3">Connecte-toi pour accepter</h1>
        <p className="text-white/55 mb-7">
          Ton invitation est valable. Connecte-toi avec ton compte Expédition, ou crée-en un :
          tu reviendras ici automatiquement.
        </p>
        <Link href={lienConnexion}
              className="inline-flex items-center justify-center w-full py-3.5 rounded-xl font-semibold text-sm"
              style={{ background: AMBRE, color: "#0a0a0a" }}>
          Se connecter
        </Link>
      </Cadre>
    );
  }

  if (etat.phase === "charte") {
    return (
      <div className="max-w-2xl mx-auto w-full rounded-2xl border p-8 md:p-10"
           style={{ borderColor: "rgba(255,106,31,0.28)", background: "rgba(255,106,31,0.04)" }}>
        <p className="font-mono text-xs tracking-[0.2em] mb-3" style={{ color: AMBRE }}>INVITATION VALIDE</p>
        <h1 className="text-2xl md:text-3xl font-black mb-2">Avant de rejoindre, l&apos;essentiel</h1>
        <p className="text-white/55 mb-7">
          Version du {AFFILIATION_CONDITIONS_VERSION}. Le texte complet tient en neuf points. Ces cinq-là sont ceux qui t&apos;engagent.
        </p>

        <div className="space-y-4 mb-7">
          {AFFILIATION_CONDITIONS.slice(0, 5).map((clause, i) => (
            <div key={clause.titre} className="flex gap-3">
              <span className="font-mono text-xs text-white/25 pt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-semibold text-sm text-white/90">{clause.titre}</p>
                <p className="text-sm text-white/50 leading-relaxed">{clause.corps}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href="/affiliation/conditions" target="_blank"
              className="inline-block text-sm font-semibold mb-7" style={{ color: AMBRE }}>
          Lire les conditions complètes →
        </Link>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input type="checkbox" checked={accepte} onChange={(e) => setAccepte(e.target.checked)}
                 className="mt-1 w-4 h-4 shrink-0 cursor-pointer" style={{ accentColor: AMBRE }} />
          <span className="text-sm text-white/60 leading-relaxed">
            J&apos;ai lu et j&apos;accepte les conditions du programme d&apos;affiliation, version du {AFFILIATION_CONDITIONS_VERSION}.
            <span className="block mt-2 text-white/75">
              En cochant, <b className="text-white">Expédition s&apos;engage à me rémunérer selon ces règles</b>&nbsp;: 43 % de chaque vente attribuée à mon code, versés 30 jours après.
            </span>
          </span>
        </label>

        <button onClick={() => rejoindre(etat.accessToken)} disabled={!accepte}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
                style={{ background: AMBRE, color: "#0a0a0a" }}>
          J&apos;accepte et je rejoins le programme
        </button>
        <p className="text-xs text-white/30 mt-4 text-center">
          Ton invitation reste valable tant que tu n&apos;as pas validé.
        </p>
      </div>
    );
  }

  if (etat.phase === "erreur") {
    return (
      <Cadre>
        <h1 className="text-2xl font-black mb-3">Ce lien ne fonctionne pas</h1>
        <p className="text-white/55 mb-6">{etat.message}</p>
        <p className="text-xs text-white/35">
          Un lien d&apos;invitation ne sert qu&apos;une fois. Si tu penses que c&apos;est une erreur,
          demande-en un nouveau.
        </p>
      </Cadre>
    );
  }

  const lienParrainage = `https://expeditionlauncher.store/tubeforge?ref=${etat.code}`;
  return (
    <Cadre>
      <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,106,31,0.75)" }}>
        {etat.deja ? "Déjà affilié" : "Bienvenue"}
      </p>
      <h1 className="text-2xl md:text-3xl font-black mb-3">Tu es dans le programme</h1>
      <p className="text-white/55 mb-7">
        Voici ton lien. Chaque achat qui passe par là t&apos;est attribué.
      </p>

      <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 mb-3 text-left">
        <p className="font-mono text-xs text-white/35 mb-1">Ton code</p>
        <p className="font-mono text-lg font-bold" style={{ color: AMBRE }}>{etat.code}</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 mb-6 text-left">
        <p className="font-mono text-xs text-white/35 mb-1">Ton lien</p>
        <p className="font-mono text-xs text-white/70 break-all">{lienParrainage}</p>
      </div>

      <button
        onClick={() => {
          void navigator.clipboard.writeText(lienParrainage).then(() => {
            setCopie(true);
            setTimeout(() => setCopie(false), 2000);
          });
        }}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
        style={{ background: AMBRE, color: "#0a0a0a" }}
      >
        {copie ? "Copié" : "Copier mon lien"}
      </button>

      <p className="text-xs text-white/35 mt-5">
        Pour être payé, il reste à relier ton compte bancaire depuis{" "}
        <Link href="/account" className="underline hover:text-white/60">Mon compte</Link>.
      </p>
    </Cadre>
  );
}

export default function PageAffiliation() {
  return (
    <div className="w-full min-h-screen text-white relative" style={{ background: "#07060f" }}>
      <Navbar />
      <main className="container-main py-24 md:py-32 relative z-10">
        <Suspense fallback={<p className="text-center text-white/40">Chargement…</p>}>
          <Contenu />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
