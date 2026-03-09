import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConfidentialitePage() {
    return (
        <div className="min-h-screen bg-[#06051a] text-white">
            <Navbar />
            <main className="pt-32 pb-24 container-main max-w-3xl mx-auto">
                <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">&larr; Retour</Link>

                <h1 className="text-3xl font-bold mt-8 mb-8">Politique de Confidentialité</h1>

                <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
                    <p><strong>Dernière mise à jour :</strong> 26 février 2026</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Données collectées</h2>
                    <p>
                        Nous collectons uniquement les données nécessaires au fonctionnement du service :
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Adresse email (pour l&apos;authentification et la communication)</li>
                        <li>Mot de passe (stocké de manière chiffrée, jamais en clair)</li>
                        <li>Identifiant machine (empreinte anonyme pour la gestion des licences)</li>
                        <li>Données de paiement (gérées exclusivement par Stripe — nous ne stockons aucun numéro de carte)</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8">2. Utilisation des données</h2>
                    <p>Vos données sont utilisées exclusivement pour :</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Gérer votre compte et votre abonnement</li>
                        <li>Vérifier votre licence sur vos appareils</li>
                        <li>Vous envoyer des communications liées au service (facturation, mises à jour critiques)</li>
                    </ul>
                    <p>
                        Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des tiers
                        à des fins commerciales ou publicitaires.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Stockage et sécurité</h2>
                    <p>
                        Les données sont stockées sur l&apos;infrastructure Cloudflare (D1 Database).
                        Les mots de passe sont chiffrés. Les communications sont sécurisées via HTTPS.
                        Les paiements sont traités par Stripe, certifié PCI-DSS.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Vos droits (RGPD)</h2>
                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Accès :</strong> obtenir une copie de vos données personnelles</li>
                        <li><strong>Rectification :</strong> corriger vos données inexactes</li>
                        <li><strong>Suppression :</strong> demander la suppression de votre compte et de vos données</li>
                        <li><strong>Portabilité :</strong> recevoir vos données dans un format exploitable</li>
                    </ul>
                    <p>
                        Pour exercer ces droits, contactez-nous via notre
                        serveur <a href="https://dsc.gg/expedition" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">Discord</a>.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">5. Cookies</h2>
                    <p>
                        Le site Expédition n&apos;utilise aucun cookie de tracking ni cookie publicitaire.
                        Seuls les cookies strictement nécessaires au fonctionnement du paiement (Stripe) sont utilisés.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
