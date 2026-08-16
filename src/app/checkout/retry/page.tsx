"use client";

// v2026-05-31 — Page custom "Retry checkout".
//
// Reçoit `?token=xxx` dans l'URL (lien envoyé par mail au client après échec
// de paiement). Le token est généré côté worker (POST /retry/generate-link)
// et identifie une invoice Stripe spécifique.
//
// Flow :
//   1. Récupère le token depuis l'URL
//   2. Appelle GET /retry/invoice?token=xxx pour avoir le clientSecret + métadonnées
//   3. Affiche un <PaymentElement> avec branding Expedition (dark mode, purple)
//   4. confirmPayment → redirect /checkout/success
//
// Pourquoi pas le hosted_invoice_url Stripe natif ?
//   - Page custom = branding Expedition (logo, dark mode, copywriting "tu" / "ton")
//   - Réutilise nos filtres payment_method_types (card only) — le hosted_invoice_url
//     garde les payment methods figés au moment de la création du PI, donc affiche
//     PayPal/Link même après nos modifs côté account.
//   - On peut guider le client (message "ta carte précédente a été refusée,
//     essaye avec une autre banque si possible").

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, AlertCircle, ArrowLeft, Loader2, Mail, Tag, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Même appearance que /checkout — cohérence visuelle parfaite avec le funnel
// d'inscription. Dark mode + purple Expedition.
const stripeAppearance = {
    theme: "night" as const,
    variables: {
        colorPrimary: "#a855f7",
        colorBackground: "#0F0F12",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        borderRadius: "12px",
        colorTextSecondary: "#ffffff66",
        colorTextPlaceholder: "#ffffff33",
        fontFamily: "system-ui, -apple-system, sans-serif",
    },
    rules: {
        ".Input": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "none",
            color: "#ffffff",
        },
        ".Input:focus": {
            border: "1px solid rgba(168, 85, 247, 0.5)",
            backgroundColor: "rgba(255, 255, 255, 0.07)",
            boxShadow: "none",
        },
        ".Label": {
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "0.75rem",
            textTransform: "uppercase" as const,
        },
        ".Tab": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.6)",
        },
        ".Tab--selected": {
            backgroundColor: "rgba(168, 85, 247, 0.15)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            color: "#ffffff",
        },
    },
};

interface InvoiceData {
    status: string;
    clientSecret: string;
    amount: number;
    currency: string;
    email: string | null;
    description: string;
    coupon: {
        name: string | null;
        percentOff: number | null;
        amountOff: number | null;
    } | null;
}

// Inner payment form — doit être dans <Elements> pour que useStripe/useElements marchent.
function RetryPaymentForm({ amount, coupon }: { amount: number; coupon: InvoiceData["coupon"] }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: "if_required",
        });

        if (confirmError) {
            // Affiche toujours le message Stripe en priorité — couvre card_error,
            // validation_error, et tout autre type avec un message lisible.
            setError(confirmError.message || "Le paiement a échoué. Essayez avec une autre carte ou vérifiez votre moyen de paiement.");
            setLoading(false);
        } else {
            window.location.href = "/checkout/success";
        }
    }, [stripe, elements]);

    const couponLabel = coupon?.percentOff
        ? `-${coupon.percentOff}%${coupon.name ? ` (${coupon.name})` : ""}`
        : coupon?.amountOff
            ? `-${(coupon.amountOff / 100).toFixed(2)}€`
            : null;

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement options={{ layout: "tabs" }} />

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

            <div className="border-t border-white/10 pt-6 mt-6">
                {couponLabel && (
                    <div className="flex justify-between items-center mb-2 text-sm text-green-400">
                        <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            Réduction appliquée
                        </span>
                        <span>{couponLabel}</span>
                    </div>
                )}
                <div className="flex justify-between items-center mb-4 text-lg font-bold">
                    <span>Total à payer</span>
                    <span>
                        {amount.toFixed(2).replace(".", ",")}€
                        <span className="text-sm font-normal text-white/40">/mois</span>
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            Confirmer et payer
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

function RetryContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<InvoiceData | null>(null);
    const [alreadyPaid, setAlreadyPaid] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Lien invalide : aucun token fourni.");
            setLoading(false);
            return;
        }

        // Fetch les infos de l'invoice via le worker. Cette route est publique
        // mais protégée par la validation du token signé côté worker.
        fetch(`${WORKER_URL}/retry/invoice?token=${encodeURIComponent(token)}`)
            .then(async (res) => {
                const json = await res.json();
                if (res.status === 410 && json.status === "paid") {
                    setAlreadyPaid(true);
                    setLoading(false);
                    return;
                }
                if (!res.ok) {
                    throw new Error(json.error || "Impossible de charger la facture");
                }
                setData(json as InvoiceData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Erreur de chargement");
                setLoading(false);
            });
    }, [token]);

    return (
        <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-clip">
            <PageBackground />
            <Navbar />

            <main className="pt-32 pb-24 container-main relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à l&apos;accueil
                </Link>

                <div className="max-w-xl mx-auto">
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-12 rounded-2xl bg-[#0F0F12] border border-white/10 text-center"
                        >
                            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                            <p className="text-white/60 text-sm">Chargement de votre facture…</p>
                        </motion.div>
                    )}

                    {alreadyPaid && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-2xl bg-[#0F0F12] border border-green-500/20 text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-7 h-7 text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Facture déjà payée</h1>
                            <p className="text-white/50 text-sm mb-6">
                                Cette facture a déjà été réglée. Votre abonnement Expedition est actif.
                            </p>
                            <Link
                                href="/account"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all"
                            >
                                Accéder à mon compte
                            </Link>
                        </motion.div>
                    )}

                    {error && !alreadyPaid && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-2xl bg-[#0F0F12] border border-red-500/20 text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-7 h-7 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Lien invalide ou expiré</h1>
                            <p className="text-white/50 text-sm mb-6">{error}</p>
                            <p className="text-white/40 text-xs mb-6">
                                Si vous pensez que c&apos;est une erreur, répondez au mail qui contenait ce lien — l&apos;équipe Expedition vous aidera.
                            </p>
                            <Link
                                href="/checkout"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all"
                            >
                                Démarrer une nouvelle inscription
                            </Link>
                        </motion.div>
                    )}

                    {data && !error && !alreadyPaid && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Message d'introduction — explique pourquoi on est là */}
                            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/90 text-sm font-medium mb-1">
                                            Finalisons votre paiement
                                        </p>
                                        <p className="text-white/60 text-xs leading-relaxed">
                                            Votre précédente tentative a été refusée par votre banque. Pas de panique — saisissez votre carte bancaire ci-dessous pour activer votre abonnement Expedition.
                                        </p>
                                        <p className="text-white/40 text-xs leading-relaxed mt-2">
                                            Conseil : si vous aviez déjà essayé une carte qui a été refusée, essayez avec une carte d&apos;une autre banque, ou vérifiez d&apos;abord votre plafond paiement internet dans votre app banque.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Récap commande */}
                            <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/10">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-purple-400" />
                                    Récapitulatif
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="font-semibold">{data.description}</div>
                                            <div className="text-xs text-white/40 mt-0.5">Expedition Creative Suite</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-2xl font-bold">
                                                {data.amount.toFixed(2).replace(".", ",")}€
                                            </div>
                                            <div className="text-xs text-white/40">/ mois</div>
                                        </div>
                                    </div>
                                    {data.email && (
                                        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/5 text-sm text-white/50">
                                            <Mail className="w-4 h-4" />
                                            {data.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form de paiement */}
                            <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl">
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret: data.clientSecret,
                                        appearance: stripeAppearance,
                                        locale: "fr",
                                    }}
                                >
                                    <RetryPaymentForm amount={data.amount} coupon={data.coupon} />
                                </Elements>

                                <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
                                    <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                        <ShieldCheck className="w-3.5 h-3.5 text-green-400/60" />
                                        <span>Paiement sécurisé</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                        <CreditCard className="w-3.5 h-3.5 text-purple-400/60" />
                                        <span>Visa, Mastercard, AMEX</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                        <Lock className="w-3.5 h-3.5 text-blue-400/60" />
                                        <span>Chiffrement SSL</span>
                                    </div>
                                </div>
                                <p className="text-center text-[10px] text-white/30 mt-3 leading-normal">
                                    Paiement sécurisé par Stripe. Vos données bancaires ne transitent pas par nos serveurs.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function RetryCheckoutPage() {
    return (
        <Suspense>
            <RetryContent />
        </Suspense>
    );
}
