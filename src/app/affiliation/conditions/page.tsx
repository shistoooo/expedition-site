import type { Metadata } from "next";
import Link from "next/link";
import { AFFILIATION_CONDITIONS, AFFILIATION_CONDITIONS_VERSION } from "@/lib/affiliation-conditions";

export const metadata: Metadata = {
    title: "Conditions du programme d'affiliation · Expédition",
    description:
        "Ce que touche un partenaire, comment une vente lui est attribuée, quand il est payé, et ce qu'il ne peut pas faire.",
    robots: { index: true, follow: true },
};

/**
 * Page publique, volontairement lisible : un partenaire doit pouvoir la lire
 * AVANT de cocher la case, et y revenir après. D'où l'URL stable et la version
 * affichée en clair — c'est elle qui est stockée en base à l'acceptation.
 */
export default function ConditionsAffiliation() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
            <div className="max-w-3xl mx-auto">
                <Link href="/account" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                    ← Retour au compte
                </Link>

                <h1 className="mt-8 text-4xl font-bold">Conditions du programme d&apos;affiliation</h1>
                <p className="mt-3 text-white/50 font-mono text-sm">
                    Version du {AFFILIATION_CONDITIONS_VERSION}
                </p>
                <p className="mt-6 text-white/70 leading-relaxed">
                    Ces conditions s&apos;appliquent dès que vous activez le programme. Elles disent ce que vous
                    touchez, à quelles conditions, et ce qui met fin à l&apos;accord. La date d&apos;acceptation et
                    la version acceptée sont conservées avec votre compte.
                </p>

                <div className="mt-12 space-y-10">
                    {AFFILIATION_CONDITIONS.map((clause, i) => (
                        <section key={clause.titre}>
                            <h2 className="text-xl font-semibold flex items-baseline gap-3">
                                <span className="font-mono text-sm text-white/30">{String(i + 1).padStart(2, "0")}</span>
                                {clause.titre}
                            </h2>
                            <p className="mt-3 text-white/70 leading-relaxed">{clause.corps}</p>
                        </section>
                    ))}
                </div>

                <p className="mt-16 pt-8 border-t border-white/10 text-sm text-white/40 leading-relaxed">
                    Une question sur un point précis, ou un désaccord sur une commission&nbsp;? Écrivez avant de
                    supposer&nbsp;: la plupart des écarts viennent d&apos;une vente attribuée à un autre lien ou
                    d&apos;un remboursement, et se vérifient en quelques minutes.
                </p>
            </div>
        </main>
    );
}
