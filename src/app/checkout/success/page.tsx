"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, Apple, Monitor } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-hidden">
            <PageBackground />
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
                        Vous faites désormais partie de la Vague Pionnier. Votre tarif est bloqué tant que votre abonnement reste actif.
                    </p>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 text-left">
                        <h3 className="font-bold text-white mb-4">Prochaine étape : Installer le Launcher</h3>
                        <p className="text-white/50 text-sm mb-6">
                            Connectez-vous avec l&apos;email et le mot de passe que vous venez de créer pour accéder à tous vos outils.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="https://expedition-licensing.expedition-studio.workers.dev/downloads/launcher-install/macos"
                                download
                                className="flex-1 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                            >
                                <Apple className="w-5 h-5" />
                                Mac
                            </a>
                            <a
                                href="https://expedition-licensing.expedition-studio.workers.dev/downloads/launcher-install/windows"
                                download
                                className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-2 transition-all"
                            >
                                <Monitor className="w-5 h-5" />
                                Windows
                            </a>
                        </div>

                        <p className="text-white/30 text-xs mt-4">
                            Mac : double-cliquez sur le fichier téléchargé pour lancer l&apos;installation automatique.
                        </p>
                    </div>

                    <p className="text-white/30 text-xs">
                        Un email de confirmation vous a été envoyé par Stripe.
                    </p>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
