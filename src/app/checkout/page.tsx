"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, CreditCard, CheckCircle2, ChevronLeft, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

const ParticlesBackground = dynamic(
    () => import("@/components/ParticlesBackground"),
    { ssr: false }
);

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 overflow-x-hidden">
            <ParticlesBackground />
            <CursorGlow />
            <Navbar />

            <main className="pt-32 pb-24 container-main">
                {/* Back Link */}
                <Link href="/pricing" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    Retour aux offres
                </Link>

                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">

                    {/* Left Column: Recap */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Récapitulatif de votre commande</h1>
                        <p className="text-white/60 mb-8">Vous êtes sur le point de rejoindre l&apos;élite des créateurs.</p>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                            <div className="flex justify-between items-start border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Vague Pionnier (Mensuel)</h3>
                                    <p className="text-purple-400 text-sm font-medium mt-1">Accès Anticipé • Prix Bloqué à Vie</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">9,99€</div>
                                    <div className="text-white/40 text-xs text-right">/ mois</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Inclus immédiatement :</h4>
                                <ul className="space-y-2">
                                    {[
                                        "Expedition Launcher (Mac/Windows)",
                                        "Licence ClipForge Illimitée",
                                        "Licence TubeForge Pro (8K/No-Ads)",
                                        "Badge Discord Exclusif 'Pionnier'",
                                        "Accès aux mises à jour Vague 1",
                                        "Accès garanti à TOUTES les futures vagues (sans surcoût)"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm flex flex-col gap-3 text-purple-200">
                                <div className="flex gap-3">
                                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="mb-2">
                                            <strong>Garantie &quot;Early Adopter&quot; & Droit au Retour :</strong><br />
                                            Votre tarif de 9,99€ est maintenu à vie tant que l&apos;abonnement est actif.
                                        </p>
                                        <p className="text-xs opacity-80 mb-1">En cas de désabonnement, vous conservez votre tarif préférentiel pendant une période de grâce :</p>
                                        <ul className="text-xs opacity-70 list-disc pl-4 space-y-1">
                                            <li>Abonné +6 mois : <strong>3 mois</strong> pour revenir à 9,99€.</li>
                                            <li>Abonné +12 mois : <strong>6 mois</strong> pour revenir à 9,99€.</li>
                                            <li>Délai maximum de récupération : 6 mois.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Payment Dummy */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-[450px]"
                    >
                        <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl sticky top-32">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Paiement Sécurisé</h2>
                                <Lock className="w-4 h-4 text-white/40" />
                            </div>

                            {/* Simulated Payment Form */}
                            <div className="space-y-4 opacity-50 pointer-events-none filter blur-[1px]">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-white/40">EMAIL</label>
                                    <div className="h-10 bg-white/5 rounded border border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-white/40">CARTE BANCAIRE</label>
                                    <div className="h-10 bg-white/5 rounded border border-white/10 flex items-center px-3 gap-2">
                                        <CreditCard className="w-4 h-4 text-white/20" />
                                    </div>
                                </div>
                            </div>

                            {/* Overlay for "Coming Soon" or "Connect API" */}
                            <div className="my-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                                <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                <h3 className="font-bold text-yellow-200 mb-1">Mode Préparation</h3>
                                <p className="text-xs text-yellow-200/60 leading-relaxed">
                                    L&apos;intégration API Stripe est prête à être connectée.
                                    Aucun débit ne sera effectué lors de ce test.
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-6 mt-6">
                                <div className="flex justify-between items-center mb-4 text-lg font-bold">
                                    <span>Total à payer</span>
                                    <span>9,99€</span>
                                </div>

                                <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Confirmer la commande
                                </button>

                                <p className="text-center text-[10px] text-white/30 mt-4 leading-normal">
                                    Paiement sécurisé par Stripe (Simulation). En cliquant, vous acceptez les CGV et la politique de confidentialité d&apos;Expédition.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
