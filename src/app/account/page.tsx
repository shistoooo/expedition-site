"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock, Mail, KeyRound, AlertCircle, Loader2, ChevronLeft,
    CreditCard, Calendar, Shield, XCircle, RotateCcw, CheckCircle2, LogOut
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import { useState } from "react";

const ParticlesBackground = dynamic(
    () => import("@/components/ParticlesBackground"),
    { ssr: false }
);

const WORKER_URL = "https://expedition-licensing.expedition-studio.workers.dev";

type AccountStep = "login" | "dashboard";

interface SubscriptionInfo {
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

export default function AccountPage() {
    const [step, setStep] = useState<AccountStep>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${WORKER_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Email ou mot de passe incorrect");
            }

            setAccessToken(data.accessToken);

            // Fetch subscription info
            const subRes = await fetch(`${WORKER_URL}/portal/subscription`, {
                headers: { "Authorization": `Bearer ${data.accessToken}` },
            });
            const subData = await subRes.json();

            if (subData.subscription) {
                setSubscription(subData.subscription);
            }
            setStep("dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!accessToken) return;
        setActionLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch(`${WORKER_URL}/portal/cancel`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
            setSuccessMessage("Abonnement annul\u00e9. Il restera actif jusqu'\u00e0 la fin de la p\u00e9riode.");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'annulation");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReactivate = async () => {
        if (!accessToken) return;
        setActionLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch(`${WORKER_URL}/portal/reactivate`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: false } : null);
            setSuccessMessage("Abonnement r\u00e9activ\u00e9 avec succ\u00e8s !");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors de la r\u00e9activation");
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getStatusLabel = (status: string, cancelAtPeriodEnd: boolean) => {
        if (cancelAtPeriodEnd) return { text: "Annulation programm\u00e9e", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" };
        if (status === "active") return { text: "Actif", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" };
        if (status === "trialing") return { text: "Essai", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" };
        if (status === "past_due") return { text: "Paiement en retard", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" };
        return { text: status, color: "text-white/60", bg: "bg-white/5 border-white/10" };
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 overflow-x-hidden">
            <ParticlesBackground />
            <CursorGlow />
            <Navbar />

            <main className="pt-32 pb-24 container-main">
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                </Link>

                <div className="max-w-lg mx-auto">
                    <AnimatePresence mode="wait">

                        {/* Login Step */}
                        {step === "login" && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleLogin}
                                className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-bold">Mon compte</h1>
                                    <Lock className="w-5 h-5 text-white/40" />
                                </div>

                                <p className="text-white/50 text-sm mb-6">
                                    Connectez-vous pour g&eacute;rer votre abonnement Exp&eacute;dition.
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-mono text-white/40 uppercase">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="vous@email.com"
                                                className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-xs font-mono text-white/40 uppercase">Mot de passe</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="Votre mot de passe"
                                                className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Se connecter"
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {/* Dashboard Step */}
                        {step === "dashboard" && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Header */}
                                <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <h1 className="text-2xl font-bold">Mon compte</h1>
                                        <button
                                            onClick={() => { setStep("login"); setAccessToken(null); setSubscription(null); setError(null); setSuccessMessage(null); }}
                                            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            D&eacute;connexion
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50 text-sm">
                                        <Mail className="w-4 h-4" />
                                        {email}
                                    </div>
                                </div>

                                {/* Subscription Card */}
                                {subscription ? (
                                    <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-lg font-bold flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-purple-400" />
                                                Abonnement
                                            </h2>
                                            {(() => {
                                                const status = getStatusLabel(subscription.status, subscription.cancelAtPeriodEnd);
                                                return (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                );
                                            })()}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-5 h-5 text-purple-400" />
                                                    <div>
                                                        <div className="font-semibold">Vague Pionnier</div>
                                                        <div className="text-sm text-white/40">Expedition Creative Suite</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold">9,99&euro;</div>
                                                    <div className="text-xs text-white/40">/ mois</div>
                                                </div>
                                            </div>

                                            {subscription.currentPeriodEnd && (
                                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                                                    <Calendar className="w-5 h-5 text-white/40" />
                                                    <div>
                                                        <div className="text-sm text-white/50">
                                                            {subscription.cancelAtPeriodEnd
                                                                ? "Acc\u00e8s jusqu'au"
                                                                : "Prochain renouvellement"
                                                            }
                                                        </div>
                                                        <div className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Success/Error Messages */}
                                        {successMessage && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                                {successMessage}
                                            </motion.div>
                                        )}
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                                            >
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                {error}
                                            </motion.div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            {subscription.cancelAtPeriodEnd ? (
                                                <button
                                                    onClick={handleReactivate}
                                                    disabled={actionLoading}
                                                    className="w-full py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <RotateCcw className="w-4 h-4" />
                                                            R&eacute;activer l&apos;abonnement
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={actionLoading}
                                                    className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4" />
                                                            Annuler l&apos;abonnement
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            <p className="text-center text-[10px] text-white/30 mt-3">
                                                {subscription.cancelAtPeriodEnd
                                                    ? "Votre acc\u00e8s reste actif jusqu'\u00e0 la fin de la p\u00e9riode en cours."
                                                    : "L'annulation prend effet \u00e0 la fin de la p\u00e9riode de facturation en cours."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl text-center">
                                        <CreditCard className="w-10 h-10 text-white/20 mx-auto mb-4" />
                                        <h2 className="text-lg font-bold mb-2">Aucun abonnement actif</h2>
                                        <p className="text-white/50 text-sm mb-6">Rejoignez la Vague Pionnier pour acc&eacute;der &agrave; tous les outils.</p>
                                        <Link
                                            href="/checkout"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all"
                                        >
                                            Souscrire
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    );
}
