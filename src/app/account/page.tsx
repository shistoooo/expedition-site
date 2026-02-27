"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock, Mail, KeyRound, AlertCircle, Loader2, ChevronLeft,
    CreditCard, Calendar, Shield, XCircle, RotateCcw, CheckCircle2, LogOut, Download, Apple, Monitor,
    Users, TrendingUp, Banknote, Clock, Copy, Check, Gift, Share2, ExternalLink
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import { useState } from "react";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://expedition-licensing.expedition-studio.workers.dev";

type AccountStep = "login" | "dashboard";

interface SubscriptionInfo {
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

interface AmbassadorInfo {
    isAmbassador: boolean;
    referralCode: string;
    stripeConnectStatus: "not_started" | "onboarding" | "active" | "restricted";
    stats: {
        totalReferrals: number;
        activeReferrals: number;
        totalEarnings: number;
        pendingEarnings: number;
    };
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
    const [ambassadorStatus, setAmbassadorStatus] = useState<AmbassadorInfo | null>(null);
    const [ambassadorLoading, setAmbassadorLoading] = useState(false);
    const [ambassadorError, setAmbassadorError] = useState<string | null>(null);
    const [customCodeInput, setCustomCodeInput] = useState("");
    const [customCodeLoading, setCustomCodeLoading] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

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

            // Fetch ambassador status (non-blocking)
            try {
                const ambRes = await fetch(`${WORKER_URL}/ambassador/status`, {
                    headers: { "Authorization": `Bearer ${data.accessToken}` },
                });
                if (ambRes.ok) {
                    const ambData = await ambRes.json();
                    if (ambData.isAmbassador) {
                        setAmbassadorStatus(ambData);
                        setCustomCodeInput(ambData.referralCode);
                    }
                }
            } catch { /* silently ignore */ }

            setStep("dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleBillingPortal = async () => {
        if (!accessToken) return;
        setActionLoading(true);
        setError(null);

        try {
            const res = await fetch(`${WORKER_URL}/portal`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            window.open(data.url, "_blank");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'ouverture du portail");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!accessToken) return;
        if (!window.confirm("Êtes-vous sûr de vouloir annuler votre abonnement ? Vous conserverez l'accès jusqu'à la fin de la période en cours.")) return;
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

    const handleBecomeAmbassador = async () => {
        if (!accessToken) return;
        setAmbassadorLoading(true);
        setAmbassadorError(null);

        try {
            const res = await fetch(`${WORKER_URL}/ambassador/register`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur lors de l'activation");

            setAmbassadorStatus({
                isAmbassador: true,
                referralCode: data.referralCode,
                stripeConnectStatus: "not_started",
                stats: { totalReferrals: 0, activeReferrals: 0, totalEarnings: 0, pendingEarnings: 0 },
            });
            setCustomCodeInput(data.referralCode);
        } catch (err: unknown) {
            setAmbassadorError(err instanceof Error ? err.message : "Erreur lors de l'activation");
        } finally {
            setAmbassadorLoading(false);
        }
    };

    const handleCustomizeCode = async () => {
        if (!accessToken || !customCodeInput.trim()) return;
        setCustomCodeLoading(true);
        setAmbassadorError(null);

        try {
            const res = await fetch(`${WORKER_URL}/ambassador/customize-code`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: customCodeInput.trim().toUpperCase() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Code indisponible");

            setAmbassadorStatus(prev => prev ? { ...prev, referralCode: data.referralCode } : null);
            setCustomCodeInput(data.referralCode);
        } catch (err: unknown) {
            setAmbassadorError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setCustomCodeLoading(false);
        }
    };

    const handleStripeOnboard = async () => {
        if (!accessToken) return;
        setAmbassadorLoading(true);
        setAmbassadorError(null);

        try {
            const res = await fetch(`${WORKER_URL}/ambassador/onboard`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur Stripe");
            window.open(data.url, "_blank");
        } catch (err: unknown) {
            setAmbassadorError(err instanceof Error ? err.message : "Erreur Stripe");
        } finally {
            setAmbassadorLoading(false);
        }
    };

    const handleStripeDashboard = async () => {
        if (!accessToken) return;
        setAmbassadorLoading(true);
        setAmbassadorError(null);

        try {
            const res = await fetch(`${WORKER_URL}/ambassador/dashboard-link`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur Stripe");
            window.open(data.url, "_blank");
        } catch (err: unknown) {
            setAmbassadorError(err instanceof Error ? err.message : "Erreur Stripe");
        } finally {
            setAmbassadorLoading(false);
        }
    };

    const handleCopyCode = async () => {
        if (!ambassadorStatus) return;
        const link = `https://expedition.studio/checkout?ref=${ambassadorStatus.referralCode}`;
        await navigator.clipboard.writeText(link);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
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
                                            onClick={() => { setStep("login"); setAccessToken(null); setSubscription(null); setError(null); setSuccessMessage(null); setAmbassadorStatus(null); setAmbassadorError(null); }}
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

                                {/* Download Section */}
                                {subscription && subscription.status !== "canceled" && (
                                    <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl">
                                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                            <Download className="w-5 h-5 text-blue-400" />
                                            T&eacute;l&eacute;chargements
                                        </h2>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <a
                                                href="https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/Install-Expedition.zip"
                                                download
                                                className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                            >
                                                <Apple className="w-5 h-5" />
                                                Launcher Mac
                                            </a>
                                            <a
                                                href="https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/Expedition-Launcher-Windows.zip"
                                                download
                                                className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-2 transition-all"
                                            >
                                                <Monitor className="w-5 h-5" />
                                                Launcher Windows
                                            </a>
                                        </div>
                                        <p className="text-white/30 text-xs mt-4">
                                            Mac : double-cliquez sur le fichier t&eacute;l&eacute;charg&eacute; pour lancer l&apos;installation automatique.
                                        </p>
                                    </div>
                                )}

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

                                        {/* Past Due Warning */}
                                        {subscription.status === "past_due" && (
                                            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <p className="text-red-400 text-sm font-medium mb-2">Votre paiement a échoué.</p>
                                                <p className="text-white/50 text-xs mb-3">Mettez à jour votre moyen de paiement pour conserver votre accès.</p>
                                                <button
                                                    onClick={handleBillingPortal}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-medium hover:bg-red-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                                    Mettre à jour le paiement
                                                </button>
                                            </div>
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

                                {/* Ambassador Section */}
                                {subscription && subscription.status !== "canceled" && (
                                    ambassadorStatus?.isAmbassador ? (
                                        <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl">
                                            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                                <Gift className="w-5 h-5 text-purple-400" />
                                                Programme Ambassadeur
                                            </h2>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="p-4 rounded-xl bg-white/5">
                                                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                        <Users className="w-3.5 h-3.5" />
                                                        Total filleuls
                                                    </div>
                                                    <div className="text-2xl font-bold">{ambassadorStatus.stats.totalReferrals}</div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5">
                                                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        Actifs
                                                    </div>
                                                    <div className="text-2xl font-bold text-green-400">{ambassadorStatus.stats.activeReferrals}</div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5">
                                                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                        <Banknote className="w-3.5 h-3.5" />
                                                        Gains totaux
                                                    </div>
                                                    <div className="text-2xl font-bold">{(ambassadorStatus.stats.totalEarnings / 100).toFixed(2)}€</div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5">
                                                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        En attente
                                                    </div>
                                                    <div className="text-2xl font-bold text-purple-400">{(ambassadorStatus.stats.pendingEarnings / 100).toFixed(2)}€</div>
                                                </div>
                                            </div>

                                            {/* Referral Code */}
                                            <div className="mb-4">
                                                <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Votre lien de parrainage</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-11 px-4 bg-white/5 rounded-xl border border-white/10 text-white text-sm flex items-center truncate">
                                                        expedition.studio/checkout?ref={ambassadorStatus.referralCode}
                                                    </div>
                                                    <button
                                                        onClick={handleCopyCode}
                                                        className="h-11 px-4 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all flex items-center gap-2 text-sm font-medium shrink-0"
                                                    >
                                                        {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        {codeCopied ? "Copié" : "Copier"}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Customize Code */}
                                            <div className="mb-6">
                                                <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Personnaliser le code</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={customCodeInput}
                                                        onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                                                        placeholder="MONCODE"
                                                        className="flex-1 h-11 px-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm uppercase tracking-wider"
                                                    />
                                                    <button
                                                        onClick={handleCustomizeCode}
                                                        disabled={customCodeLoading || customCodeInput.trim() === ambassadorStatus.referralCode}
                                                        className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                                    >
                                                        {customCodeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Appliquer"}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stripe Connect Section */}
                                            <div className="pt-6 border-t border-white/10">
                                                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                                                    <Share2 className="w-4 h-4 text-purple-400" />
                                                    Paiements — Stripe Connect
                                                </h3>

                                                {ambassadorStatus.stripeConnectStatus === "active" ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                                            <span className="text-sm text-green-400 font-medium">Compte connecté</span>
                                                        </div>
                                                        <button
                                                            onClick={handleStripeDashboard}
                                                            disabled={ambassadorLoading}
                                                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                        >
                                                            {ambassadorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                                <>
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    Ouvrir le dashboard Stripe
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : ambassadorStatus.stripeConnectStatus === "restricted" ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                            <span className="text-sm text-orange-400 font-medium">Informations manquantes</span>
                                                        </div>
                                                        <p className="text-white/40 text-xs mb-3">
                                                            Stripe a besoin d&apos;informations supplémentaires pour activer les paiements.
                                                        </p>
                                                        <button
                                                            onClick={handleStripeOnboard}
                                                            disabled={ambassadorLoading}
                                                            className="w-full py-3 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 font-medium hover:bg-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                        >
                                                            {ambassadorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                                <>
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    Compléter l&apos;inscription Stripe
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : ambassadorStatus.stripeConnectStatus === "onboarding" ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                            <span className="text-sm text-blue-400 font-medium">Inscription en cours</span>
                                                        </div>
                                                        <button
                                                            onClick={handleStripeOnboard}
                                                            disabled={ambassadorLoading}
                                                            className="w-full py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                        >
                                                            {ambassadorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                                <>
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    Continuer l&apos;inscription Stripe
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-white/40 text-xs mb-3">
                                                            Connectez votre compte bancaire via Stripe pour recevoir vos commissions.
                                                        </p>
                                                        <button
                                                            onClick={handleStripeOnboard}
                                                            disabled={ambassadorLoading}
                                                            className="w-full py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                        >
                                                            {ambassadorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                                <>
                                                                    <Banknote className="w-4 h-4" />
                                                                    Configurer les paiements
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Ambassador Error */}
                                            {ambassadorError && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                                                >
                                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                    {ambassadorError}
                                                </motion.div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl">
                                            <div className="text-center">
                                                <Gift className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                                                <h2 className="text-lg font-bold mb-2">Devenez Ambassadeur</h2>
                                                <p className="text-white/50 text-sm mb-6">
                                                    Partagez Expédition et gagnez 50% de commission récurrente sur chaque abonnement généré.
                                                </p>
                                                <button
                                                    onClick={handleBecomeAmbassador}
                                                    disabled={ambassadorLoading}
                                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/25"
                                                >
                                                    {ambassadorLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Gift className="w-4 h-4" />
                                                            Activer le programme
                                                        </>
                                                    )}
                                                </button>
                                                <Link
                                                    href="/ambassador"
                                                    className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors mt-4"
                                                >
                                                    En savoir plus <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>

                                                {ambassadorError && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                                                    >
                                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                        {ambassadorError}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    )
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
