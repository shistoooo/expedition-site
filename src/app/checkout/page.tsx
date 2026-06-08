"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, CreditCard, CheckCircle2, ChevronLeft, Loader2, Mail, KeyRound, AlertCircle, ArrowLeft, Tag, Check, Gift, Heart, X, MessageCircle, Monitor, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { SALES_OPEN } from "@/lib/salesConfig";
import { getPartnerAttribution } from "@/lib/partnerAttribution";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL;
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe Elements dark theme matching Expedition style
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

type PlanType = "monthly" | "yearly";

const PLANS = {
    monthly: { price: 11.99, label: "/mois", period: "mois" },
    yearly: { price: 99.99, label: "/an", period: "an" },
};

// Inner payment form component (must be inside <Elements>)
function PaymentForm({ discount, plan }: { discount: { percentOff: number | null; amountOff: number | null } | null; plan: PlanType }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const confirmBtnRef = useRef<HTMLButtonElement>(null);

    const basePrice = PLANS[plan].price;
    let finalPrice = basePrice;
    let discountLabel = "";
    if (discount?.percentOff) {
        finalPrice = basePrice * (1 - discount.percentOff / 100);
        discountLabel = `-${discount.percentOff}%`;
    } else if (discount?.amountOff) {
        finalPrice = Math.max(0, basePrice - discount.amountOff / 100);
        discountLabel = `-${(discount.amountOff / 100).toFixed(2)}€`;
    }

    // Close modal on Escape
    useEffect(() => {
        if (!showDisclaimer) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowDisclaimer(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [showDisclaimer]);

    // Auto-focus confirm button when modal opens
    useEffect(() => {
        if (showDisclaimer) confirmBtnRef.current?.focus();
    }, [showDisclaimer]);

    const confirmPayment = useCallback(async () => {
        if (!stripe || !elements) return;

        setShowDisclaimer(false);
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
            // Affiche toujours le message Stripe en priorité (couvre card_error,
            // validation_error, invalid_request_error, etc.). Fallback explicite
            // qui suggère la carte si l'utilisateur a tenté un wallet (Link/PayPal).
            setError(confirmError.message || "Le paiement a échoué. Essayez avec une autre carte ou vérifiez votre moyen de paiement.");
            setLoading(false);
        } else {
            window.location.href = "/checkout/success";
        }
    }, [stripe, elements]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setShowDisclaimer(true);
    };

    return (
        <>
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
                    {discount && (
                        <div className="flex justify-between items-center mb-2 text-sm text-white/50">
                            <span>Sous-total</span>
                            <span className="line-through">{basePrice.toFixed(2)}€</span>
                        </div>
                    )}
                    {discount && (
                        <div className="flex justify-between items-center mb-2 text-sm text-green-400">
                            <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />Réduction</span>
                            <span>{discountLabel}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center mb-4 text-lg font-bold">
                        <span>Total à payer</span>
                        <span>{finalPrice.toFixed(2)}€<span className="text-sm font-normal text-white/40">{PLANS[plan].label}</span></span>
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

            {/* Disclaimer modal — rendered via portal to escape framer-motion transform stacking context */}
            {typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {showDisclaimer && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowDisclaimer(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                role="alertdialog"
                                aria-modal="true"
                                aria-labelledby="disclaimer-title"
                                className="relative w-full max-w-md rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl p-6 sm:p-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => setShowDisclaimer(false)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-full bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mb-5">
                                    <Heart className="w-6 h-6 text-purple-400" />
                                </div>

                                {/* Title */}
                                <h3 id="disclaimer-title" className="text-xl font-bold text-white mb-4">Avant de continuer...</h3>

                                {/* Message */}
                                <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                                    <p>
                                        Expedition est un projet indépendant, porté par une petite équipe passionnée.
                                        Notre ambition : créer les meilleurs outils pour les créateurs, à un prix juste — main dans la main avec vous.
                                    </p>
                                    <p>
                                        Le produit évolue en permanence. Il est possible que vous rencontriez des bugs ou des imperfections en cours de route.
                                        C&apos;est le propre d&apos;un projet vivant, et chaque retour nous aide à progresser.
                                    </p>
                                    <p className="text-white/80 font-medium">Si vous rencontrez le moindre souci, deux canaux directs :</p>
                                    <div className="space-y-2">
                                        <a
                                            href="https://discord.com/invite/QuV3bYDEYT"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all group"
                                        >
                                            <MessageCircle className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                            <div>
                                                <span className="text-white font-medium text-sm">Discord</span>
                                                <span className="block text-white/40 text-xs">Réponse rapide, communauté active</span>
                                            </div>
                                        </a>
                                        <a href="mailto:contact@expeditionlauncher.store" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                            <Mail className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                            <div>
                                                <span className="text-white font-medium text-sm">Email</span>
                                                <span className="block text-white/40 text-xs">contact@expeditionlauncher.store</span>
                                            </div>
                                        </a>
                                    </div>
                                    {/* Avertissement signature */}
                                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <div className="flex items-start gap-2.5">
                                            <Monitor className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-amber-200/90 text-xs font-medium mb-1">Windows Defender / macOS Gatekeeper</p>
                                                <p className="text-white/50 text-xs leading-relaxed">
                                                    Lors de l&apos;installation, votre système peut afficher un avertissement de sécurité.
                                                    C&apos;est normal : en tant que projet indépendant, nous n&apos;avons pas encore de certificat de signature
                                                    (coûteux pour une petite équipe). Des créateurs comme ceux que vous retrouverez
                                                    sur notre page d&apos;accueil utilisent Expedition au quotidien sans aucun souci.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-white/50 text-xs pt-1">Merci de faire partie de l&apos;aventure.</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 mt-6">
                                    <button
                                        ref={confirmBtnRef}
                                        onClick={confirmPayment}
                                        className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        J&apos;ai compris, confirmer le paiement
                                    </button>
                                    <button
                                        onClick={() => setShowDisclaimer(false)}
                                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium text-sm hover:bg-white/10 hover:text-white/80 transition-all"
                                    >
                                        Retour
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

type CheckoutStep = "auth" | "payment";

// Discord icon SVG
function DiscordIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
        </svg>
    );
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const initialPlan = searchParams.get("plan") === "yearly" ? "yearly" : "monthly";
    const [plan, setPlan] = useState<PlanType>(initialPlan as PlanType);
    const [step, setStep] = useState<CheckoutStep>("auth");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const initialRef = searchParams.get("ref") || "";
    const [promoCode, setPromoCode] = useState(initialRef);
    const [showPromo, setShowPromo] = useState(!!initialRef);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [discount, setDiscount] = useState<{ percentOff: number | null; amountOff: number | null } | null>(null);

    // Discord verification state
    const [discordVerified, setDiscordVerified] = useState(false);
    const [discordError, setDiscordError] = useState<string | null>(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Discord user ID for linking
    const [discordUserId, setDiscordUserId] = useState<string | null>(null);

    // Check Discord verification on mount
    useEffect(() => {
        const discordParam = searchParams.get("discord_verified");
        const discordErr = searchParams.get("discord_error");

        if (discordParam === "true") {
            // Verify the cookie server-side
            fetch("/api/discord/verify")
                .then((r) => r.json())
                .then((data: { verified: boolean; discordUserId?: string | null }) => {
                    if (data.verified) {
                        setDiscordVerified(true);
                        if (data.discordUserId) setDiscordUserId(data.discordUserId);
                        // Auto-apply Discord promo code
                        setPromoCode("DISCORD837204");
                        setShowPromo(true);
                    }
                })
                .catch(() => { /* ignore */ });
        }

        if (discordErr === "not_member") {
            setDiscordError("Vous n'êtes pas membre du serveur Discord Expedition. Rejoignez-le d'abord !");
        } else if (discordErr) {
            setDiscordError(`Erreur technique : ${discordErr}`);
        }
    }, [searchParams]);

    const handleDiscordConnect = () => {
        const params = new URLSearchParams({ plan });
        if (initialRef) params.set("ref", initialRef);
        window.location.href = `/api/discord/auth?${params}`;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Input validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Veuillez entrer une adresse email valide.");
            return;
        }
        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        setLoading(true);

        try {
            const promoTrimmed = promoCode.trim() || undefined;
            // Attribution partenaire (cookie first-touch /via/<slug>) — envoyée au worker.
            // Inerte tant que le worker ne lit pas le champ ; aucun impact sur le paiement.
            const partnerSlug = getPartnerAttribution() || undefined;

            // 1. Try to register (new account)
            const registerRes = await fetch(`${WORKER_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, promoCode: promoTrimmed, plan, discordUserId: discordUserId || undefined, partnerSlug }),
            });

            const registerData = await registerRes.json();

            if (registerRes.ok && registerData.success) {
                if (registerData.discount) setDiscount(registerData.discount);

                // 100% discount: subscription is already active, no payment needed
                if (!registerData.clientSecret && registerData.subscriptionId) {
                    window.location.href = "/checkout/success";
                    return;
                }

                if (registerData.clientSecret) {
                    setClientSecret(registerData.clientSecret);
                    setStep("payment");
                    return;
                }
            }

            // 2. Account already exists (409) OR register succeeded but Stripe failed (200 without clientSecret)
            if (registerRes.status === 409 || (registerRes.ok && !registerData.clientSecret)) {
                const loginRes = await fetch(`${WORKER_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const loginData = await loginRes.json();

                if (!loginRes.ok) {
                    throw new Error(loginData.error || "Email ou mot de passe incorrect");
                }

                // Already has active subscription
                if (loginData.subscription?.status === "active" || loginData.subscription?.status === "trialing") {
                    window.location.href = "/checkout/success";
                    return;
                }

                // Get clientSecret for existing user
                const subRes = await fetch(`${WORKER_URL}/portal/subscribe`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${loginData.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ plan, promoCode: promoTrimmed, discordUserId: discordUserId || undefined, partnerSlug }),
                });

                const subData = await subRes.json();

                if (subRes.ok) {
                    if (subData.discount) setDiscount(subData.discount);

                    // 100% discount: subscription is already active, no payment needed
                    if (!subData.clientSecret && subData.subscriptionId) {
                        window.location.href = "/checkout/success";
                        return;
                    }

                    if (subData.clientSecret) {
                        setClientSecret(subData.clientSecret);
                        setStep("payment");
                        return;
                    }
                }

                if (subRes.status === 409) {
                    window.location.href = "/checkout/success";
                    return;
                }

                throw new Error("Impossible de créer la session de paiement");
            }

            // 3. Other registration error
            throw new Error(registerData.error || "Une erreur est survenue");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "";
            if (message.includes("Code promo") || message.includes("promo")) {
                setError(message);
            } else if (message.includes("mot de passe") || message.includes("incorrect")) {
                setError("Mot de passe incorrect pour ce compte.");
            } else if (message.includes("email") || message.includes("Email")) {
                setError(message);
            } else if (message.includes("Trop de tentatives")) {
                setError(message);
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-hidden">
            <PageBackground />

            <Navbar />

            <main className="pt-32 pb-24 container-main relative z-10">
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
                        <p className="text-white/60 mb-8">V&eacute;rifiez votre commande avant de continuer.</p>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                            {/* Plan Toggle */}
                            <div className="relative flex p-1 rounded-xl bg-white/5 border border-white/10">
                                <motion.div
                                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-md"
                                    animate={{ x: plan === "monthly" ? 0 : "calc(100% + 4px)" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setPlan("monthly")}
                                    className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${plan === "monthly" ? "text-black" : "text-white/50 hover:text-white/80"}`}
                                >
                                    Mensuel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPlan("yearly")}
                                    className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${plan === "yearly" ? "text-black" : "text-white/50 hover:text-white/80"}`}
                                >
                                    Annuel
                                    <span className="absolute -top-2 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full z-20">-30%</span>
                                </button>
                            </div>

                            <div className="flex justify-between items-start border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Vague Pionnier ({plan === "yearly" ? "Annuel" : "Mensuel"})</h3>
                                    <p className="text-purple-400 text-sm font-medium mt-1">Acc&egrave;s Anticip&eacute; &bull; Tarif bloqu&eacute; tant que vous restez abonn&eacute;</p>
                                </div>
                                <div className="text-right">
                                    {plan === "monthly" && discordVerified ? (
                                        <>
                                            <div className="flex items-baseline gap-2 justify-end">
                                                <span className="text-base text-white/35 line-through tabular-nums">11,99&euro;</span>
                                                <span className="text-2xl font-bold text-emerald-400 tabular-nums">8,03&euro;</span>
                                            </div>
                                            <div className="text-white/40 text-xs text-right">/mois</div>
                                            <div className="text-emerald-400 text-xs font-semibold mt-1">Tarif Pionnier Discord appliqu&eacute;</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-2xl font-bold tabular-nums">{PLANS[plan].price.toFixed(2).replace(".", ",")}&euro;</div>
                                            <div className="text-white/40 text-xs text-right">{PLANS[plan].label}</div>
                                            {plan === "yearly" && (
                                                <>
                                                    <div className="text-green-400 text-xs mt-1">soit 8,33&euro;/mois</div>
                                                    <div className="text-green-400 text-xs font-semibold mt-0.5">&Eacute;conomise 43,89&euro;/an</div>
                                                </>
                                            )}
                                            {plan === "monthly" && (
                                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25">
                                                    <span className="text-emerald-300 text-[11px] font-semibold whitespace-nowrap">
                                                        &rarr; 8,03&euro;/mois avec Discord
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Inclus immédiatement et à venir :</h4>
                                <ul className="space-y-2">
                                    {[
                                        "Expedition Launcher (Mac/Windows)",
                                        "TubeForge Pro — 4K, sans pub (Seul outil disponible en Vague 1)",
                                        "ClipForge — Clips auto 8h + sélection illimitée (Vague 2)",
                                        "ReviewForge — Review sécurisé (Vague 3)",
                                        "Badge Discord Exclusif 'Pionnier'",
                                        "Tarif bloqué tant que vous restez abonné"
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
                                        <p>
                                            <strong>Garantie &quot;Early Adopter&quot; :</strong><br />
                                            Votre tarif de {PLANS[plan].price.toFixed(2).replace(".", ",")}€{PLANS[plan].label} reste bloqu&eacute; tant que votre abonnement reste actif et continu. En cas de r&eacute;siliation, le tarif en vigueur au moment de la r&eacute;inscription s&apos;appliquera.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Garantie tranquillité — risk reversal visible avant achat */}
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                                    <div>
                                        <p className="text-emerald-100 font-bold mb-1">Garantie tranquillit&eacute;</p>
                                        <p className="text-emerald-200/80 leading-relaxed">
                                            Annulable en 1 clic depuis ton compte. Pas convaincu ? Contacte-nous sur Discord ou par email, on trouve une solution ensemble.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Auth or Payment */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-[450px]"
                    >
                        <AnimatePresence mode="wait">
                            {/* Step 1: Email + Password */}
                            {step === "auth" && (
                                <motion.form
                                    key="auth"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleAuth}
                                    className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl sticky top-32"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold">Connexion / Inscription</h2>
                                        <Lock className="w-4 h-4 text-white/40" />
                                    </div>

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
                                                    minLength={8}
                                                    placeholder="8 caractères minimum"
                                                    className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Referral banner */}
                                    {initialRef && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm flex items-center gap-2"
                                        >
                                            <Gift className="w-4 h-4 shrink-0" />
                                            Code de parrainage appliqué : <span className="font-bold">{initialRef}</span>
                                        </motion.div>
                                    )}

                                    {/* Discord verification */}
                                    <div className="mt-4">
                                        {discordVerified ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                <span>
                                                    <strong className="text-emerald-200">Membre Discord v&eacute;rifi&eacute;</strong> &mdash; tarif Pionnier <strong>8,03&euro;/mois</strong> appliqu&eacute;
                                                </span>
                                            </motion.div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleDiscordConnect}
                                                className="w-full py-3.5 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/40 text-white hover:bg-[#5865F2]/25 hover:border-[#5865F2]/60 transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/15"
                                            >
                                                <DiscordIcon className="w-5 h-5 text-[#a5b4fc]" />
                                                Passer &agrave; 8,03&euro;/mois avec Discord
                                            </button>
                                        )}
                                        {discordError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex flex-col gap-3"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                    <span>{discordError}</span>
                                                </div>
                                                {discordError.includes("pas membre") && (
                                                    <div className="flex flex-col gap-2">
                                                        <a
                                                            href="https://discord.com/invite/QuV3bYDEYT"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full py-2.5 rounded-lg bg-[#5865F2] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#4752C4] transition-colors"
                                                        >
                                                            <DiscordIcon className="w-4 h-4" />
                                                            Rejoindre le serveur Discord
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={handleDiscordConnect}
                                                            className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                                                        >
                                                            J&apos;ai rejoint &mdash; R&eacute;essayer
                                                        </button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Promo code */}
                                    <div className="mt-4">
                                        {!showPromo ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowPromo(true)}
                                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
                                            >
                                                <Tag className="w-3.5 h-3.5" />
                                                J&apos;ai un code promo
                                            </button>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="space-y-2"
                                            >
                                                <label htmlFor="promo" className="text-xs font-mono text-white/40 uppercase">Code promo</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input
                                                        id="promo"
                                                        type="text"
                                                        value={promoCode}
                                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                        placeholder="EXPEDITION20"
                                                        className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm uppercase tracking-wider"
                                                        disabled={discordVerified}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
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

                                    <div className="flex items-center gap-3 mt-6 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <CreditCard className="w-5 h-5 text-white/30 shrink-0" />
                                        <p className="text-xs text-white/40 leading-relaxed">
                                            Nouveau ? Un compte sera créé automatiquement. Déjà inscrit ? Connectez-vous pour souscrire.
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={acceptedTerms}
                                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-purple-500 shrink-0"
                                            />
                                            <span className="text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                                                Je demande l&apos;acc&egrave;s imm&eacute;diat au service et <strong className="text-white/70">renonce &agrave; mon droit de r&eacute;tractation de 14 jours</strong> (art.&nbsp;L221-28 du Code de la consommation). J&apos;accepte les{" "}
                                                <Link href="/cgv" target="_blank" className="underline text-purple-400 hover:text-purple-300 transition-colors">CGV</Link>
                                                {" "}et la{" "}
                                                <Link href="/confidentialite" target="_blank" className="underline text-purple-400 hover:text-purple-300 transition-colors">politique de confidentialit&eacute;</Link>.
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !acceptedTerms}
                                        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            "Continuer"
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-white/30 mt-4 leading-normal">
                                        Paiement s&eacute;curis&eacute; par Stripe.
                                    </p>
                                </motion.form>
                            )}

                            {/* Step 2: Payment Element */}
                            {step === "payment" && clientSecret && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl sticky top-32"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => { setStep("auth"); setClientSecret(null); }}
                                                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                            </button>
                                            <h2 className="text-xl font-bold">Paiement sécurisé</h2>
                                        </div>
                                        <CreditCard className="w-4 h-4 text-white/40" />
                                    </div>

                                    {/* Show email */}
                                    <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-white/30" />
                                        <span className="text-sm text-white/60">{email}</span>
                                    </div>

                                    <Elements
                                        stripe={stripePromise}
                                        options={{
                                            clientSecret,
                                            appearance: stripeAppearance,
                                            locale: "fr",
                                        }}
                                    >
                                        <PaymentForm discount={discount} plan={plan} />
                                    </Elements>

                                    {/* Trust badges */}
                                    <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
                                        <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                            <ShieldCheck className="w-3.5 h-3.5 text-green-400/60" />
                                            <span>Paiement s&eacute;curis&eacute;</span>
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
                                        Paiement s&eacute;curis&eacute; par Stripe. Vos donn&eacute;es bancaires ne transitent pas par nos serveurs.
                                        <br />Annulable &agrave; tout moment, sans engagement.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </main>
            <Footer />
        </div>
    );
}

function WaitlistContent() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes("@")) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (res.ok) setStatus("success");
            else setStatus("error");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="w-full min-h-screen overflow-x-hidden relative bg-[#06051a] text-white">
            <PageBackground />
            <Navbar />
            <main className="pt-36 pb-32 container-main relative z-10 flex items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-lg w-full"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/25 mb-6">
                            <Bell className="w-7 h-7 text-purple-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-[-0.03em]">
                            L&apos;Exp&eacute;dition arrive bient&ocirc;t
                        </h1>
                        <p className="text-white/50 text-lg leading-relaxed">
                            Laissez votre email pour &ecirc;tre pr&eacute;venu d&egrave;s l&apos;ouverture
                            des inscriptions &mdash; et profiter du tarif Pionnier.
                        </p>
                    </div>

                    <div
                        className="rounded-2xl p-8 relative overflow-hidden"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {status === "success" ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 mb-4">
                                    <Check className="w-6 h-6 text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">C&apos;est not&eacute;&nbsp;!</h2>
                                <p className="text-white/50 text-sm">
                                    On vous envoie un email d&egrave;s que les inscriptions ouvrent.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="waitlist-email" className="text-xs font-mono uppercase tracking-wider text-white/40 mb-2 block">
                                        Votre email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                        <input
                                            id="waitlist-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="vous@email.com"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder:text-white/25 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    style={{
                                        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                                        color: "#fff",
                                        boxShadow: "0 0 24px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                                    }}
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Me pr&eacute;venir au lancement
                                            <Bell className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {status === "error" && (
                                    <p className="text-red-400 text-sm text-center">
                                        Erreur — r&eacute;essayez ou contactez-nous sur Discord.
                                    </p>
                                )}

                                <p className="text-center text-xs text-white/25">
                                    Pas de spam. Un seul email au lancement.
                                </p>
                            </form>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-sm text-white/40 hover:text-white/60 transition-colors"
                        >
                            &larr; Retour &agrave; l&apos;accueil
                        </Link>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

export default function CheckoutPage() {
    if (!SALES_OPEN) {
        return <WaitlistContent />;
    }
    return (
        <Suspense>
            <CheckoutContent />
        </Suspense>
    );
}
