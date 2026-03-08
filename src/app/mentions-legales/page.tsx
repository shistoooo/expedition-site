import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <main className="pt-32 pb-24 container-main max-w-3xl mx-auto">
                <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">&larr; Retour</Link>

                <h1 className="text-3xl font-bold mt-8 mb-8">Mentions L&eacute;gales</h1>

                <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
                    <p><strong>Derni&egrave;re mise &agrave; jour :</strong> 5 mars 2026</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. &Eacute;diteur du site</h2>
                    <p>
                        Le site <strong>expeditionlauncher.store</strong> est &eacute;dit&eacute; par :
                    </p>
                    <ul className="list-none space-y-1">
                        <li><strong>Nom :</strong> Exp&eacute;dition Studio</li>
                        <li><strong>Statut :</strong> Personne physique — Entrepreneur individuel</li>
                        <li><strong>Email :</strong> contact@expeditionlauncher.store</li>
                        <li><strong>Discord :</strong> <a href="https://dsc.gg/expedition" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">dsc.gg/expedition</a></li>
                    </ul>
                    <p>
                        TVA non applicable, article 293 B du Code G&eacute;n&eacute;ral des Imp&ocirc;ts
                        (sous r&eacute;serve de modification du r&eacute;gime fiscal).
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">2. Directeur de la publication</h2>
                    <p>Le responsable de la publication est le g&eacute;rant d&apos;Exp&eacute;dition Studio.</p>

                    <h2 className="text-xl font-bold text-white mt-8">3. H&eacute;bergeur</h2>
                    <p>Le site est h&eacute;berg&eacute; par :</p>
                    <ul className="list-none space-y-1">
                        <li><strong>Vercel Inc.</strong></li>
                        <li>440 N Barranca Ave #4133, Covina, CA 91723, &Eacute;tats-Unis</li>
                        <li>Site : <a href="https://vercel.com" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
                    </ul>
                    <p>Les donn&eacute;es applicatives (base de donn&eacute;es, API) sont h&eacute;berg&eacute;es par :</p>
                    <ul className="list-none space-y-1">
                        <li><strong>Cloudflare Inc.</strong></li>
                        <li>101 Townsend St, San Francisco, CA 94107, &Eacute;tats-Unis</li>
                        <li>Site : <a href="https://cloudflare.com" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">cloudflare.com</a></li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8">4. Propri&eacute;t&eacute; intellectuelle</h2>
                    <p>
                        L&apos;ensemble du contenu du site (textes, images, logos, interfaces, logiciels)
                        est la propri&eacute;t&eacute; exclusive de l&apos;&Eacute;diteur ou de ses partenaires.
                        Toute reproduction, repr&eacute;sentation ou diffusion, m&ecirc;me partielle, est
                        interdite sans autorisation pr&eacute;alable &eacute;crite.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">5. Donn&eacute;es personnelles</h2>
                    <p>
                        Les donn&eacute;es personnelles collect&eacute;es sur ce site sont trait&eacute;es
                        conform&eacute;ment &agrave; notre{" "}
                        <Link href="/confidentialite" className="text-purple-400 hover:text-purple-300 transition-colors">
                            Politique de Confidentialit&eacute;
                        </Link>.
                    </p>
                    <p>
                        Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD)
                        et &agrave; la loi Informatique et Libert&eacute;s, vous disposez d&apos;un droit d&apos;acc&egrave;s,
                        de rectification, de suppression et de portabilit&eacute; de vos donn&eacute;es.
                        Pour exercer ces droits, contactez-nous &agrave; l&apos;adresse email indiqu&eacute;e ci-dessus
                        ou via notre serveur{" "}
                        <a href="https://dsc.gg/expedition" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">Discord</a>.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">6. Cookies</h2>
                    <p>
                        Ce site n&apos;utilise aucun cookie de tracking, publicitaire ou analytique.
                        Seuls les cookies strictement n&eacute;cessaires au fonctionnement du service
                        de paiement (Stripe) sont utilis&eacute;s. Ces cookies sont exempt&eacute;s de
                        consentement au titre de l&apos;article 82 de la loi Informatique et Libert&eacute;s.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">7. M&eacute;diation</h2>
                    <p>
                        Conform&eacute;ment aux articles L611-1 et suivants du Code de la consommation,
                        en cas de litige non r&eacute;solu, vous pouvez recourir gratuitement &agrave; un
                        m&eacute;diateur de la consommation. Le m&eacute;diateur comp&eacute;tent sera communiqu&eacute;
                        sur simple demande &agrave; l&apos;adresse email de l&apos;&Eacute;diteur.
                    </p>
                    <p>
                        Vous pouvez &eacute;galement d&eacute;poser votre r&eacute;clamation sur la plateforme europ&eacute;enne
                        de r&egrave;glement en ligne des litiges :{" "}
                        <a href="https://ec.europa.eu/consumers/odr" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">
                            ec.europa.eu/consumers/odr
                        </a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
