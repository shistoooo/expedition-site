import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

export default function CGVPage() {
    return (
        <div className="min-h-screen bg-[#06051a] text-white">
            <PageBackground />
            <Navbar />
            <main className="pt-20 md:pt-32 pb-16 md:pb-24 container-main max-w-3xl mx-auto relative z-10">
                <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">&larr; Retour</Link>

                <h1 className="text-3xl font-bold mt-8 mb-8">Conditions G&eacute;n&eacute;rales de Vente</h1>

                <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
                    <p><strong>Derni&egrave;re mise &agrave; jour :</strong> 24 juillet 2026</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Objet</h2>
                    <p>
                        Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (CGV) r&eacute;gissent les relations contractuelles entre
                        Exp&eacute;dition Studio (&quot;nous&quot;, &quot;l&apos;&Eacute;diteur&quot;), projet &eacute;dit&eacute; par une personne physique
                        domicili&eacute;e en France, et tout utilisateur (&quot;vous&quot;, &quot;le Client&quot;)
                        souscrivant &agrave; un abonnement aux services Exp&eacute;dition. Les coordonn&eacute;es compl&egrave;tes
                        de l&apos;&Eacute;diteur figurent sur la page <a href="/mentions-legales" className="text-purple-400 hover:text-purple-300 transition-colors">Mentions l&eacute;gales</a>.
                    </p>
                    <p>
                        Les services incluent l&apos;acc&egrave;s au Launcher Exp&eacute;dition, au logiciel TubeForge
                        et &agrave; tout outil futur ajout&eacute; &agrave; la suite et inclus dans la formule souscrite.
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
                        Deux formules sont propos&eacute;es : mensuelle (11,99&euro;/mois) et annuelle (99,99&euro;/an). Un tarif r&eacute;duit (8,03&euro;/mois) est disponible pour les membres du serveur Discord Exp&eacute;dition.
                        Le paiement est g&eacute;r&eacute; exclusivement par le prestataire de paiement Stripe.
                        L&apos;abonnement est renouvel&eacute; automatiquement &agrave; chaque &eacute;ch&eacute;ance (mensuelle ou annuelle).
                    </p>
                    <p>
                        Le tarif souscrit lors de la premi&egrave;re inscription est garanti
                        (&quot;grandfathering&quot;) tant que l&apos;abonnement reste actif et continu.
                        En cas de modification tarifaire rendue n&eacute;cessaire par une &eacute;volution fiscale
                        ou r&eacute;glementaire ind&eacute;pendante de la volont&eacute; de l&apos;&Eacute;diteur (notamment un changement
                        de r&eacute;gime de TVA), le Client en sera inform&eacute; au moins 30 jours avant l&apos;entr&eacute;e
                        en vigueur du nouveau tarif et pourra r&eacute;silier son abonnement sans p&eacute;nalit&eacute;
                        avant cette date.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">3 bis. Formules TubeForge</h2>
                    <p>
                        Pour le logiciel TubeForge, l&apos;&Eacute;diteur propose un abonnement par paliers d&apos;engagement,
                        pr&eacute;c&eacute;d&eacute; d&apos;un essai gratuit, ainsi qu&apos;une formule &agrave; paiement unique :
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Essai gratuit de 14 jours :</strong> la souscription requiert l&apos;enregistrement d&apos;une
                            carte bancaire valide, mais <strong>aucun montant n&apos;est pr&eacute;lev&eacute; pendant l&apos;essai</strong>.
                            Le Client peut r&eacute;silier &agrave; tout moment durant ces 14 jours depuis &quot;Mon compte&quot; :
                            aucun d&eacute;bit n&apos;est alors effectu&eacute;. &Agrave; d&eacute;faut de r&eacute;siliation, le plan choisi est
                            factur&eacute; automatiquement &agrave; la fin de l&apos;essai.
                        </li>
                        <li>
                            <strong>Abonnement mensuel :</strong> 4,99&euro;/mois, sans engagement. Reconduction automatique
                            chaque mois, r&eacute;siliable &agrave; tout moment (effet en fin de p&eacute;riode, articles 3 et 5).
                        </li>
                        <li>
                            <strong>Abonnement annuel :</strong> 41,88&euro;/an (soit 3,49&euro;/mois, &minus;30&nbsp;% par rapport
                            au tarif mensuel), <strong>factur&eacute; en une seule fois par an</strong> et reconduit automatiquement
                            &agrave; chaque &eacute;ch&eacute;ance annuelle. R&eacute;siliable &agrave; tout moment, avec effet &agrave; la fin de la
                            p&eacute;riode d&eacute;j&agrave; factur&eacute;e ; aucun remboursement au prorata.
                        </li>
                        <li>
                            <strong>Acc&egrave;s &agrave; vie :</strong> 89,99&euro;, paiement unique, donnant acc&egrave;s &agrave; TubeForge dans les
                            conditions de l&apos;article 3 ter ci-dessous.
                        </li>
                    </ul>
                    <p>
                        <strong>Cl&eacute;s cadeau et cl&eacute;s boost :</strong> certaines formules donnent droit &agrave; des cl&eacute;s d&apos;acc&egrave;s
                        offertes au Client afin qu&apos;il les distribue &agrave; des tiers. Chaque cl&eacute; donne un acc&egrave;s limit&eacute; &agrave;
                        <strong> TubeForge uniquement</strong> (&agrave; l&apos;exclusion des autres outils de la suite), pour la dur&eacute;e indiqu&eacute;e,
                        et doit &ecirc;tre activ&eacute;e avant sa date d&apos;expiration. Les cl&eacute;s non activ&eacute;es &agrave; cette date sont
                        d&eacute;finitivement caduques, sans compensation ni prolongation.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">3 ter. D&eacute;finition et limites de l&apos;acc&egrave;s &laquo;&nbsp;&agrave; vie&nbsp;&raquo;</h2>
                    <p>
                        La formule &laquo;&nbsp;Acc&egrave;s &agrave; vie&nbsp;&raquo; s&apos;entend de la <strong>dur&eacute;e de vie commerciale du logiciel
                        TubeForge</strong>, et non d&apos;une garantie perp&eacute;tuelle et illimit&eacute;e dans le temps. Le Client reconna&icirc;t
                        et accepte que :
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            L&apos;acc&egrave;s est accord&eacute; sans limite de dur&eacute;e <strong>tant que l&apos;&Eacute;diteur exploite et maintient
                            TubeForge</strong>, dans les conditions de l&apos;article 7 (obligation de moyens, absence de garantie
                            de disponibilit&eacute;) ;
                        </li>
                        <li>
                            L&apos;acc&egrave;s &agrave; vie est <strong>personnel, nominatif et non transf&eacute;rable</strong> ; il ne peut &ecirc;tre
                            revendu, pr&ecirc;t&eacute; ni c&eacute;d&eacute; ;
                        </li>
                        <li>
                            L&apos;&Eacute;diteur se r&eacute;serve le droit de faire &eacute;voluer TubeForge, d&apos;en modifier les fonctionnalit&eacute;s
                            ou de le remplacer par un outil &eacute;quivalent, sans que cela remette en cause l&apos;acc&egrave;s &agrave; vie,
                            d&egrave;s lors que la valeur globale du service n&apos;est pas substantiellement diminu&eacute;e ;
                        </li>
                        <li>
                            En cas de <strong>cessation d&eacute;finitive de l&apos;exploitation de TubeForge</strong> &mdash; notamment pour
                            un motif ind&eacute;pendant de la volont&eacute; de l&apos;&Eacute;diteur (force majeure au sens de l&apos;article 1218
                            du Code civil, cessation d&apos;activit&eacute;, contrainte technique ou l&eacute;gale majeure) &mdash; l&apos;acc&egrave;s
                            pourra prendre fin. Le paiement unique ayant donn&eacute; lieu &agrave; une ex&eacute;cution imm&eacute;diate et continue
                            du service pendant toute sa p&eacute;riode de disponibilit&eacute;, sa cessation pour ces motifs n&apos;ouvre pas
                            droit &agrave; remboursement, <strong>sous r&eacute;serve des droits imp&eacute;ratifs reconnus au consommateur par la
                            loi</strong> (notamment la garantie l&eacute;gale de conformit&eacute;, article 7 bis) ;
                        </li>
                        <li>
                            L&apos;&Eacute;diteur s&apos;engage, dans la mesure du possible, &agrave; informer les d&eacute;tenteurs d&apos;un acc&egrave;s &agrave; vie
                            au moins 30 jours avant toute cessation d&eacute;finitive planifi&eacute;e du service.
                        </li>
                    </ul>

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
                            Le Client <strong>reconna&icirc;t que ce commencement d&apos;ex&eacute;cution entra&icirc;ne la perte de son droit de r&eacute;tractation de 14 jours</strong> pr&eacute;vu
                            par l&apos;article L221-18 du Code de la consommation.
                        </li>
                    </ul>
                    <p>
                        En cons&eacute;quence, aucun remboursement pour simple changement d&apos;avis ne sera effectu&eacute; apr&egrave;s la validation du paiement.
                        La garantie l&eacute;gale de conformit&eacute; pr&eacute;vue aux articles L224-25-12 et suivants du Code de la consommation reste pleinement applicable (voir article 7 bis ci-dessous).
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">5. R&eacute;siliation</h2>
                    <p>
                        Le Client peut annuler son abonnement &agrave; tout moment depuis son espace
                        &quot;Mon compte&quot; sur le site. L&apos;annulation prend effet &agrave; la fin de la
                        p&eacute;riode de facturation en cours. L&apos;acc&egrave;s aux services est maintenu
                        jusqu&apos;&agrave; cette date. Aucun remboursement au prorata ne sera effectu&eacute;.
                    </p>
                    <p>
                        En cas de r&eacute;siliation, le tarif pr&eacute;f&eacute;rentiel est perdu. Le tarif en vigueur au moment de la r&eacute;inscription s&apos;appliquera.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">6. Programme Ambassadeur</h2>
                    <p>
                        Le programme Ambassadeur permet aux abonn&eacute;s actifs de parrainer de nouveaux
                        utilisateurs. L&apos;ambassadeur per&ccedil;oit une commission de 42% sur les abonnements
                        g&eacute;n&eacute;r&eacute;s via son code de parrainage, pendant une dur&eacute;e de 6 mois par filleul.
                    </p>
                    <p>
                        Les commissions sont vers&eacute;es via Stripe Connect. L&apos;&Eacute;diteur se r&eacute;serve
                        le droit de suspendre ou de modifier les conditions du programme &agrave; tout moment,
                        sans effet r&eacute;troactif sur les commissions d&eacute;j&agrave; acquises.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">7. Responsabilit&eacute; et garanties</h2>
                    <p>
                        Exp&eacute;dition est un projet ind&eacute;pendant en d&eacute;veloppement actif. Le Client accepte
                        que les logiciels puissent contenir des imperfections, bugs ou limitations temporaires
                        inh&eacute;rentes &agrave; un service en &eacute;volution continue.
                    </p>
                    <p>
                        <strong>Obligation de moyens :</strong> L&apos;&Eacute;diteur s&apos;engage &agrave; fournir ses meilleurs efforts
                        pour maintenir le service op&eacute;rationnel et corriger les bugs signal&eacute;s dans des d&eacute;lais raisonnables.
                        Il ne s&apos;agit en aucun cas d&apos;une obligation de r&eacute;sultat. Aucune garantie
                        de disponibilit&eacute; (SLA), de performance ou de fonctionnement ininterrompu n&apos;est accord&eacute;e.
                    </p>
                    <p>
                        <strong>Mises &agrave; jour :</strong> L&apos;&Eacute;diteur ne prend aucun engagement sur un calendrier
                        de mises &agrave; jour, de correctifs ou d&apos;ajout de fonctionnalit&eacute;s. Les mises &agrave; jour sont
                        fournies au fil du d&eacute;veloppement, sans fr&eacute;quence garantie.
                    </p>
                    <p>
                        <strong>&Eacute;volution de la suite :</strong> L&apos;&Eacute;diteur se r&eacute;serve le droit de modifier,
                        remplacer ou retirer des outils de la suite, &agrave; condition que la valeur globale
                        du service ne soit pas substantiellement diminu&eacute;e.
                    </p>
                    <p>
                        <strong>Responsabilit&eacute; :</strong> L&apos;&Eacute;diteur est responsable des dommages caus&eacute;s au Client
                        r&eacute;sultant d&apos;un manquement &agrave; ses obligations contractuelles, dans les conditions
                        du droit commun. La responsabilit&eacute; de l&apos;&Eacute;diteur ne pourra &ecirc;tre engag&eacute;e en cas
                        de force majeure au sens de l&apos;article 1218 du Code civil, ni en cas de mauvaise utilisation
                        du service par le Client.
                    </p>
                    <p>
                        Les logiciels Exp&eacute;dition ne disposent pas actuellement de certificat de signature
                        num&eacute;rique (code signing). Des avertissements de s&eacute;curit&eacute; peuvent appara&icirc;tre
                        lors de l&apos;installation sur Windows (Defender/SmartScreen) et macOS (Gatekeeper).
                        Cela n&apos;affecte en rien la s&eacute;curit&eacute; du logiciel.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">7 bis. Garantie l&eacute;gale de conformit&eacute;</h2>

                    <div className="border border-white/20 rounded-xl p-5 my-4 bg-white/5 text-white/70 text-sm leading-relaxed space-y-3">
                        <p>
                            Le consommateur b&eacute;n&eacute;ficie d&apos;un d&eacute;lai de deux ans &agrave; compter de la fourniture
                            du contenu num&eacute;rique ou du service num&eacute;rique pour obtenir la mise en &oelig;uvre
                            de la garantie l&eacute;gale de conformit&eacute; en cas d&apos;apparition d&apos;un d&eacute;faut de conformit&eacute;.
                            Durant ce d&eacute;lai, le consommateur n&apos;est tenu d&apos;&eacute;tablir que l&apos;existence
                            du d&eacute;faut de conformit&eacute; et non la date d&apos;apparition de celui-ci.
                        </p>
                        <p>
                            Lorsque le contrat pr&eacute;voit la fourniture continue du contenu num&eacute;rique ou du service
                            num&eacute;rique pendant une dur&eacute;e sup&eacute;rieure &agrave; deux ans, la garantie l&eacute;gale est applicable
                            pendant toute la p&eacute;riode de fourniture pr&eacute;vue. Durant ce d&eacute;lai, le consommateur
                            n&apos;est tenu d&apos;&eacute;tablir que l&apos;existence du d&eacute;faut de conformit&eacute; et non la date
                            d&apos;apparition de celui-ci.
                        </p>
                        <p>
                            La garantie l&eacute;gale de conformit&eacute; emporte obligation de fournir toutes les mises &agrave; jour
                            n&eacute;cessaires au maintien de la conformit&eacute; du contenu num&eacute;rique ou du service num&eacute;rique
                            durant la p&eacute;riode de fourniture.
                        </p>
                        <p>
                            La garantie l&eacute;gale de conformit&eacute; donne au consommateur droit &agrave; la mise en conformit&eacute;
                            du contenu num&eacute;rique ou du service num&eacute;rique sans retard injustifi&eacute; suivant sa demande,
                            sans frais et sans inconv&eacute;nient majeur pour lui.
                        </p>
                        <p>
                            Le consommateur peut obtenir une r&eacute;duction du prix en conservant le contenu num&eacute;rique
                            ou le service num&eacute;rique, ou il peut mettre fin au contrat en se faisant rembourser
                            int&eacute;gralement contre renoncement au contenu num&eacute;rique ou au service num&eacute;rique, si :
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Le professionnel refuse de mettre le contenu num&eacute;rique ou le service num&eacute;rique en conformit&eacute; ;</li>
                            <li>La mise en conformit&eacute; est retard&eacute;e de mani&egrave;re injustifi&eacute;e ;</li>
                            <li>La mise en conformit&eacute; ne peut intervenir sans frais impos&eacute;s au consommateur ;</li>
                            <li>La mise en conformit&eacute; occasionne un inconv&eacute;nient majeur pour le consommateur ;</li>
                            <li>Le d&eacute;faut de conformit&eacute; n&apos;est pas corrig&eacute; apr&egrave;s tentative de mise en conformit&eacute;.</li>
                        </ul>
                        <p>
                            Le consommateur a &eacute;galement droit &agrave; une r&eacute;duction de prix ou &agrave; la r&eacute;solution du contrat
                            lorsque le d&eacute;faut de conformit&eacute; est si grave qu&apos;il justifie que la r&eacute;duction de prix
                            ou la r&eacute;solution du contrat soit imm&eacute;diate. Le consommateur n&apos;est alors pas tenu
                            de demander la mise en conformit&eacute; au pr&eacute;alable.
                        </p>
                        <p className="text-white/50 italic">
                            Articles L224-25-12 &agrave; L224-25-26 du Code de la consommation.
                        </p>
                    </div>

                    <p>
                        Cette garantie est ind&eacute;pendante de toute garantie commerciale &eacute;ventuellement propos&eacute;e
                        et ne peut &ecirc;tre exclue ou limit&eacute;e par les pr&eacute;sentes CGV.
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
                        s&apos;engagent &agrave; rechercher une solution amiable. &Agrave; d&eacute;faut, le Client peut saisir
                        le tribunal du lieu de son domicile ou celui du si&egrave;ge de l&apos;&Eacute;diteur,
                        conform&eacute;ment &agrave; l&apos;article R631-3 du Code de la consommation.
                    </p>
                    <p>
                        Conform&eacute;ment &agrave; l&apos;article L612-1 du Code de la consommation, le Client peut
                        recourir gratuitement &agrave; un m&eacute;diateur de la consommation en vue de la r&eacute;solution
                        amiable de tout litige.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8">10. Contact</h2>
                    <p>
                        Pour toute question relative aux pr&eacute;sentes CGV, contactez-nous via notre
                        serveur <a href="https://discord.com/invite/QuV3bYDEYT" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">Discord</a> ou
                        par email &agrave; contact@expeditionlauncher.store.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
