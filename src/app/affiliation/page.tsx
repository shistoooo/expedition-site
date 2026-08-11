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

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";
const AMBRE = "#ff6a1f";

type Etat =
  | { phase: "chargement" }
  | { phase: "sans-jeton" }
  | { phase: "connexion-requise" }
  | { phase: "en-cours" }
  | { phase: "ok"; code: string; deja: boolean }
  | { phase: "erreur"; message: string };

function Contenu() {
  const jeton = useSearchParams().get("invitation")?.trim() ?? "";
  const [etat, setEtat] = useState<Etat>({ phase: "chargement" });
  const [copie, setCopie] = useState(false);

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

        setEtat({ phase: "en-cours" });
        const r = await fetch(`${WORKER_URL}/ambassador/invitation`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ token: jeton }),
        });
        const d = (await r.json()) as { referralCode?: string; deja?: boolean; error?: string };
        if (!vivant) return;

        if (!r.ok || !d.referralCode) {
          setEtat({ phase: "erreur", message: d.error ?? "Ce lien n'a pas pu être utilisé." });
          return;
        }
        setEtat({ phase: "ok", code: d.referralCode, deja: !!d.deja });
      } catch {
        if (vivant) setEtat({ phase: "erreur", message: "Connexion impossible. Réessaie dans un instant." });
      }
    })();

    return () => { vivant = false; };
  }, [jeton]);

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
          Cette page s&apos;ouvre avec un lien d&apos;invitation. Si tu en as reçu un, ouvre-le
          directement — il contient ton accès.
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
