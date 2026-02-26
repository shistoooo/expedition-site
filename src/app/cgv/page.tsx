import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CGVPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <main className="pt-32 pb-24 container-main max-w-3xl mx-auto">
                <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">&larr; Retour</Link>

                <h1 className="text-3xl font-bold mt-8 mb-8">Conditions Générales de Vente</h1>

                <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
                    <p><strong>Dernière mise à jour :</strong> 26 février 2026</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Objet</h2>
                    <p>
                        Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
                        Expédition Studio (&quot;nous&quot;, &quot;notre&quot;) et tout utilisateur (&quot;vous&quot;, &quot;l&apos;abonné&quot;) souscrivant
                        à un abonnement aux services Expédition, incluant l&apos;accès au Launcher, ClipForge, TubeForge
                        et tout outil futur inclus dans la formule souscrite.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">2. Services</h2>
                    <p>
                        L&apos;abonnement Expédition donne accès à une suite d&apos;outils de création de contenu, livrée
                        via le Launcher Expédition (application de bureau Mac/Windows). Les outils inclus dépendent
                        de la vague d&apos;inscription (Pionnier, Expansion, Ultime).
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Prix et paiement</h2>
                    <p>
                        Les prix sont affichés en euros (EUR) TTC. Le paiement est géré par Stripe.
                        L&apos;abonnement est renouvelé automatiquement (mensuellement ou annuellement selon le plan choisi).
                        Le tarif souscrit est garanti à vie (&quot;grandfathering&quot;) tant que l&apos;abonnement reste actif.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Droit de rétractation</h2>
                    <p>
                        Conformément à la réglementation en vigueur, vous disposez d&apos;un délai de 14 jours à compter
                        de la souscription pour exercer votre droit de rétractation et obtenir un remboursement intégral,
                        sans avoir à justifier de motif.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">5. Résiliation</h2>
                    <p>
                        Vous pouvez annuler votre abonnement à tout moment depuis votre espace &quot;Mon compte&quot;.
                        L&apos;annulation prend effet à la fin de la période de facturation en cours.
                        Aucun remboursement au prorata ne sera effectué pour la période restante.
                    </p>
                    <p>
                        En cas de résiliation, une période de grâce vous permet de revenir au tarif préférentiel :
                        3 mois de grâce après 6 mois d&apos;abonnement, 6 mois de grâce après 12 mois d&apos;abonnement.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">6. Responsabilité</h2>
                    <p>
                        Les outils sont fournis &quot;en l&apos;état&quot;. Nous nous engageons à maintenir le service
                        opérationnel et à corriger les bugs signalés dans des délais raisonnables.
                        Nous ne saurions être tenus responsables des dommages indirects liés à l&apos;utilisation des outils.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">7. Contact</h2>
                    <p>
                        Pour toute question relative aux présentes CGV, contactez-nous via notre
                        serveur <a href="https://dsc.gg/expedition" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">Discord</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
