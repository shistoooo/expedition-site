import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CGVPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <main className="pt-32 pb-24 container-main max-w-3xl mx-auto">
                <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">&larr; Retour</Link>

                <h1 className="text-3xl font-bold mt-8 mb-8">Conditions G&eacute;n&eacute;rales de Vente</h1>

                <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
                    <p><strong>Derni&egrave;re mise &agrave; jour :</strong> 5 mars 2026</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Objet</h2>
                    <p>
                        Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (CGV) r&eacute;gissent les relations contractuelles entre
                        Exp&eacute;dition Studio, micro-entreprise en cours d&apos;immatriculation dont le si&egrave;ge social sera situ&eacute;
                        &agrave; [&Agrave; COMPL&Eacute;TER] (&quot;nous&quot;, &quot;l&apos;&Eacute;diteur&quot;), et tout utilisateur (&quot;vous&quot;, &quot;le Client&quot;)
                        souscrivant &agrave; un abonnement aux services Exp&eacute;dition.
                    </p>
                    <p>
                        Les services incluent l&apos;acc&egrave;s au Launcher Exp&eacute;dition, aux logiciels ClipForge, TubeForge
                        et &agrave; tout outil futur inclus dans la formule souscrite.
                    </p>
                    <p>
                        Toute souscription implique l&apos;acceptation sans r&eacute;serve des pr&eacute;sentes CGV.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">2. Description des services</h2>
                    <p>
                        L&apos;abonnement Exp&eacute;dition donne acc&egrave;s &agrave; une suite d&apos;outils de cr&eacute;ation de contenu,
                        livr&eacute;e via le Launcher Exp&eacute;dition (application de bureau Mac/Windows).
                    </p>
                    <p>
                        Les outils sont fournis sous forme de contenu num&eacute;rique, accessible imm&eacute;diatement
                        apr&egrave;s la souscription. Le service est en &eacute;volution permanente : de nouvelles
                        fonctionnalit&eacute;s et de nouveaux outils sont ajout&eacute;s r&eacute;guli&egrave;rement.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Prix et paiement</h2>
                    <p>
                        Les prix sont affich&eacute;s en euros (EUR) toutes taxes comprises (TVA non applicable,
                        article 293 B du Code G&eacute;n&eacute;ral des Imp&ocirc;ts, sous r&eacute;serve de modification du r&eacute;gime fiscal).
                    </p>
                    <p>
                        Deux formules sont propos&eacute;es : mensuelle (9,99&euro;/mois) et annuelle (99,99&euro;/an).
                        Le paiement est g&eacute;r&eacute; exclusivement par le prestataire de paiement Stripe.
                        L&apos;abonnement est renouvel&eacute; automatiquement &agrave; chaque &eacute;ch&eacute;ance (mensuelle ou annuelle).
                    </p>
                    <p>
                        Le tarif souscrit lors de la premi&egrave;re inscription est garanti &agrave; vie
                        (&quot;grandfathering&quot;) tant que l&apos;abonnement reste actif et continu.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Droit de r&eacute;tractation — Renonciation</h2>
                    <p>
                        Conform&eacute;ment &agrave; l&apos;article L221-28, 13&deg; du Code de la consommation, le Client
                        reconna&icirc;t et accepte que :
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Le service souscrit constitue un <strong>contenu num&eacute;rique fourni sur un support immat&eacute;riel</strong> dont
                            l&apos;ex&eacute;cution commence imm&eacute;diatement apr&egrave;s la validation du paiement ;
                        </li>
                        <li>
                            Le Client a <strong>express&eacute;ment consenti</strong> &agrave; l&apos;ex&eacute;cution imm&eacute;diate du service
                            en proc&eacute;dant au paiement ;
                        </li>
                        <li>
                            Le Client <strong>renonce express&eacute;ment &agrave; son droit de r&eacute;tractation de 14 jours</strong> pr&eacute;vu
                            par l&apos;article L221-18 du Code de la consommation.
                        </li>
                    </ul>
                    <p>
                        En cons&eacute;quence, aucun remboursement ne sera effectu&eacute; apr&egrave;s la validation du paiement.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">5. R&eacute;siliation</h2>
                    <p>
                        Le Client peut annuler son abonnement &agrave; tout moment depuis son espace
                        &quot;Mon compte&quot; sur le site. L&apos;annulation prend effet &agrave; la fin de la
                        p&eacute;riode de facturation en cours. L&apos;acc&egrave;s aux services est maintenu
                        jusqu&apos;&agrave; cette date. Aucun remboursement au prorata ne sera effectu&eacute;.
                    </p>
                    <p>
                        En cas de r&eacute;siliation, une p&eacute;riode de gr&acirc;ce permet au Client de
                        revenir au tarif pr&eacute;f&eacute;rentiel : 3 mois de gr&acirc;ce apr&egrave;s 6 mois d&apos;abonnement
                        continu, 6 mois de gr&acirc;ce apr&egrave;s 12 mois d&apos;abonnement continu.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">6. Programme Ambassadeur</h2>
                    <p>
                        Le programme Ambassadeur permet aux abonn&eacute;s actifs de parrainer de nouveaux
                        utilisateurs. L&apos;ambassadeur per&ccedil;oit une commission de 50% sur les abonnements
                        g&eacute;n&eacute;r&eacute;s via son code de parrainage, pendant une dur&eacute;e de 6 mois par filleul.
                    </p>
                    <p>
                        Les commissions sont vers&eacute;es via Stripe Connect. L&apos;&Eacute;diteur se r&eacute;serve
                        le droit de suspendre ou de modifier les conditions du programme &agrave; tout moment,
                        sans effet r&eacute;troactif sur les commissions d&eacute;j&agrave; acquises.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">7. Responsabilit&eacute; et garanties</h2>
                    <p>
                        Les outils sont fournis &quot;en l&apos;&eacute;tat&quot;. Exp&eacute;dition est un projet
                        ind&eacute;pendant en d&eacute;veloppement actif. Le Client accepte que les logiciels
                        puissent contenir des imperfections ou des bugs.
                    </p>
                    <p>
                        Nous nous engageons &agrave; corriger les bugs signal&eacute;s dans des d&eacute;lais raisonnables
                        et &agrave; maintenir le service op&eacute;rationnel. Nous ne saurions &ecirc;tre tenus responsables
                        des dommages indirects li&eacute;s &agrave; l&apos;utilisation des outils.
                    </p>
                    <p>
                        Les logiciels Exp&eacute;dition ne disposent pas actuellement de certificat de signature
                        num&eacute;rique (code signing). Des avertissements de s&eacute;curit&eacute; peuvent appara&icirc;tre
                        lors de l&apos;installation sur Windows (Defender/SmartScreen) et macOS (Gatekeeper).
                        Cela n&apos;affecte en rien la s&eacute;curit&eacute; du logiciel.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">8. Propri&eacute;t&eacute; intellectuelle</h2>
                    <p>
                        L&apos;ensemble des logiciels, contenus, interfaces et &eacute;l&eacute;ments visuels du service
                        Exp&eacute;dition sont la propri&eacute;t&eacute; exclusive de l&apos;&Eacute;diteur. L&apos;abonnement
                        conf&egrave;re un droit d&apos;utilisation personnel, non exclusif et non transf&eacute;rable.
                        Toute reproduction, redistribution ou r&eacute;tro-ing&eacute;nierie est interdite.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">9. Droit applicable et litiges</h2>
                    <p>
                        Les pr&eacute;sentes CGV sont soumises au droit fran&ccedil;ais. En cas de litige, les parties
                        s&apos;engagent &agrave; rechercher une solution amiable. &Agrave; d&eacute;faut, les tribunaux
                        comp&eacute;tents seront ceux du lieu de domicile de l&apos;&Eacute;diteur.
                    </p>
                    <p>
                        Conform&eacute;ment &agrave; l&apos;article L612-1 du Code de la consommation, le Client peut
                        recourir gratuitement &agrave; un m&eacute;diateur de la consommation en vue de la r&eacute;solution
                        amiable de tout litige.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">10. Contact</h2>
                    <p>
                        Pour toute question relative aux pr&eacute;sentes CGV, contactez-nous via notre
                        serveur <a href="https://dsc.gg/expedition" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">Discord</a> ou
                        par email &agrave; [&Agrave; COMPL&Eacute;TER].
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
