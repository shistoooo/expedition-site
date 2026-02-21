"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

const ParticlesBackground = dynamic(
    () => import("@/components/ParticlesBackground"),
    { ssr: false }
);

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 overflow-x-hidden">
            <ParticlesBackground />
            <CursorGlow />
            <Navbar />

            <main className="pt-32 pb-24 container-main flex items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-lg mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Bienvenue dans l&apos;Expédition !
                    </h1>
                    <p className="text-white/60 text-lg mb-3">
                        Votre paiement a été confirmé avec succès.
                    </p>
                    <p className="text-white/40 text-sm mb-10">
                        Vous faites désormais partie de la Vague Pionnier. Votre tarif de 9,99€/mois est bloqué à vie.
                    </p>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 text-left">
                        <h3 className="font-bold text-white mb-4">Prochaine étape :</h3>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/20 shrink-0">
                                <Download className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white/80 font-medium mb-1">Téléchargez le Launcher</p>
                                <p className="text-white/50 text-sm">
                                    Connectez-vous avec l&apos;email et le mot de passe que vous venez de créer pour accéder à tous vos outils.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/launcher"
                        className="inline-flex items-center gap-2 py-4 px-8 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
                    >
                        Télécharger le Launcher
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <p className="text-white/30 text-xs mt-6">
                        Un email de confirmation vous a été envoyé par Stripe.
                    </p>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
