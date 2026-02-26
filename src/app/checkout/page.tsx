"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, CreditCard, CheckCircle2, ChevronLeft, Loader2, Mail, KeyRound, AlertCircle, ArrowLeft, Tag, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const ParticlesBackground = dynamic(
    () => import("@/components/ParticlesBackground"),
    { ssr: false }
);

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://expedition-licensing.expedition-studio.workers.dev";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51JicqfFeRMzmhuFlENwkuNgIT1Eu4dXjdrzgjXTAvSbMDrLeEeOVwe5sKXwPOKQE3JilpVVi84pRGvl0isY1ZVlV00aKp2MkBc");

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
    monthly: { price: 9.99, label: "/mois", period: "mois" },
    yearly: { price: 99.99, label: "/an", period: "an" },
};

// Inner payment form component (must be inside <Elements>)
function PaymentForm({ discount, plan }: { discount: { percentOff: number | null; amountOff: number | null } | null; plan: PlanType }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
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
            if (confirmError.type === "card_error" || confirmError.type === "validation_error") {
                setError(confirmError.message || "Le paiement a échoué.");
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setLoading(false);
        } else {
            // Payment succeeded without redirect (no 3DS)
            window.location.href = "/checkout/success";
        }
    };

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
    );
}

type CheckoutStep = "auth" | "payment";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const initialPlan = searchParams.get("plan") === "yearly" ? "yearly" : "monthly";
    const [plan, setPlan] = useState<PlanType>(initialPlan as PlanType);
    const [step, setStep] = useState<CheckoutStep>("auth");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [showPromo, setShowPromo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [discount, setDiscount] = useState<{ percentOff: number | null; amountOff: number | null } | null>(null);

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

            // 1. Try to register (new account)
            const registerRes = await fetch(`${WORKER_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, promoCode: promoTrimmed, plan }),
            });

            const registerData = await registerRes.json();

            if (registerRes.ok && registerData.clientSecret) {
                if (registerData.discount) setDiscount(registerData.discount);
                setClientSecret(registerData.clientSecret);
                setStep("payment");
                return;
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
                    body: JSON.stringify({ plan, promoCode: promoTrimmed }),
                });

                const subData = await subRes.json();

                if (subRes.ok && subData.clientSecret) {
                    if (subData.discount) setDiscount(subData.discount);
                    setClientSecret(subData.clientSecret);
                    setStep("payment");
                    return;
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
                                    <span className="absolute -top-2 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full z-20">-17%</span>
                                </button>
                            </div>

                            <div className="flex justify-between items-start border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Vague Pionnier ({plan === "yearly" ? "Annuel" : "Mensuel"})</h3>
                                    <p className="text-purple-400 text-sm font-medium mt-1">Acc&egrave;s Anticip&eacute; &bull; Prix Bloqu&eacute; &agrave; Vie</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{PLANS[plan].price.toFixed(2).replace(".", ",")}€</div>
                                    <div className="text-white/40 text-xs text-right">{PLANS[plan].label}</div>
                                    {plan === "yearly" && (
                                        <div className="text-green-400 text-xs mt-1">soit 8,33€/mois</div>
                                    )}
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
                                            Votre tarif de {PLANS[plan].price.toFixed(2).replace(".", ",")}€{PLANS[plan].label} est maintenu &agrave; vie tant que l&apos;abonnement est actif.
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

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            "Continuer"
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-white/30 mt-4 leading-normal">
                                        Paiement sécurisé par Stripe. En cliquant, vous acceptez les{" "}
                                        <Link href="/cgv" target="_blank" className="underline hover:text-white/50 transition-colors">CGV</Link>
                                        {" "}et la{" "}
                                        <Link href="/confidentialite" target="_blank" className="underline hover:text-white/50 transition-colors">politique de confidentialité</Link>
                                        {" "}d&apos;Expédition.
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

                                    <p className="text-center text-[10px] text-white/30 mt-4 leading-normal">
                                        Paiement sécurisé par Stripe. Vos données bancaires ne transitent pas par nos serveurs.
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

export default function CheckoutPage() {
    return (
        <Suspense>
            <CheckoutContent />
        </Suspense>
    );
}
