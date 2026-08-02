"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock, Mail, KeyRound, AlertCircle, Loader2, ChevronLeft,
    CreditCard, Calendar, Shield, XCircle, RotateCcw, CheckCircle2, LogOut, Download, Apple, Monitor,
    Users, TrendingUp, Banknote, Clock, Copy, Check, Gift, Share2, ExternalLink, UserPlus, Tag, Zap, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTubeForgeOnly } from "@/lib/useTubeForgeOnly";
import { ACCUEIL_TUBEFORGE } from "@/lib/tubeforgeOnly";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import WalletSection from "@/components/WalletSection";
import BorderBeam from "@/components/BorderBeam";
import { PRICING_MODE } from "@/lib/salesConfig";
import { useState, useEffect, useRef, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";
// v2026-06-03 — Le login Discord DOIT démarrer et finir sur le MÊME domaine
// worker que le redirect_uri enregistré côté Discord (= PUBLIC_ORIGIN). Sinon
// le cookie `state` posé au /start (api.clipapp.uk) n'est pas renvoyé au
// /callback (workers.dev) → invalid_state. On force donc le domaine workers.dev.
const DISCORD_AUTH_ORIGIN = "https://expedition-licensing.expedition-studio.workers.dev";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51JicqfFeRMzmhuFlENwkuNgIT1Eu4dXjdrzgjXTAvSbMDrLeEeOVwe5sKXwPOKQE3JilpVVi84pRGvl0isY1ZVlV00aKp2MkBc");

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
    monthly: { price: 11.99, label: "/mois" },
    yearly: { price: 99.99, label: "/an" },
};

// Emails admin — même liste que côté worker (routes/admin.ts). Pour l'instant,
// le programme ambassadeur est caché pour tous les non-admins (décision business
// temporaire : éviter risque de spam/abus tant que le système n'est pas tooled
// pour gérer une vraie cohorte). Quand on rouvre, retirer ce gate.
const ADMIN_EMAILS = ["shisto81@gmail.com"];

function AccountPaymentForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            // Affiche toujours le message Stripe en priorité (couvre card_error,
            // validation_error, invalid_request_error, etc.). Fallback explicite
            // qui suggère la carte si l'utilisateur a tenté un wallet (Link/PayPal).
            setError(confirmError.message || "Le paiement a échoué. Essayez avec une autre carte ou vérifiez votre moyen de paiement.");
            setLoading(false);
        } else {
            onSuccess();
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
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full mt-6 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Confirmer et payer</>}
            </button>
        </form>
    );
}

const ALLOWED_REDIRECT_HOSTS = ["dashboard.stripe.com", "connect.stripe.com", "billing.stripe.com", "checkout.stripe.com"];

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

function DownloadSection() {
    const [isMac, setIsMac] = useState(true);
    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();
        setIsMac(/mac|iphone|ipad|ipod/.test(ua));
    }, []);

    const primaryHref = isMac
        ? "https://api.clipapp.uk/downloads/launcher-install/macos"
        : "https://api.clipapp.uk/downloads/launcher-install/windows";
    const secondaryHref = isMac
        ? "https://api.clipapp.uk/downloads/launcher-install/windows"
        : "https://api.clipapp.uk/downloads/launcher-install/macos";

    return (
        <div className="p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Download className="w-5 h-5 text-purple-400" />
                T&eacute;l&eacute;chargements
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
                <a
                    href={primaryHref}
                    download
                    className="flex-1 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                >
                    {isMac ? <Apple className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    {isMac ? "Launcher Mac" : "Launcher Windows"}
                </a>
                <a
                    href={secondaryHref}
                    download
                    className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-2 transition-all"
                >
                    {isMac ? <Monitor className="w-5 h-5" /> : <Apple className="w-5 h-5" />}
                    {isMac ? "Launcher Windows" : "Launcher Mac"}
                </a>
            </div>
            <p className="text-white/30 text-xs mt-4">
                {isMac
                    ? "Mac : double-cliquez sur le fichier téléchargé pour lancer l'installation automatique."
                    : "Windows : exécutez le fichier téléchargé pour lancer l'installation."
                }
            </p>
        </div>
    );
}

export default function AccountPage() {
    // Un client TubeForge ne doit pas etre renvoye vers le catalogue de la suite
    // depuis son propre espace client. Le hook decide sur le DOMAINE autant que
    // sur le chemin — /account est partage par les deux mondes.
    const seulTubeForge = useTubeForgeOnly();
    const [step, setStep] = useState<AccountStep>("login");
    const [authMode, setAuthMode] = useState<"login" | "register">("login");

    // CTA « 14 jours gratuits » → /account?mode=register : ouvre direct l'onglet
    // Inscription (meilleure conversion pour un nouveau + email capté = relance).
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (new URLSearchParams(window.location.search).get("mode") === "register") {
            setAuthMode("register");
        }
    }, []);
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

    // Subscribe flow state
    const [subscribePlan, setSubscribePlan] = useState<PlanType>("monthly");
    const [subscribeLoading, setSubscribeLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Discord linking state
    const [discordLinked, setDiscordLinked] = useState(false);
    const [discordLinking, setDiscordLinking] = useState(false);

    // Auto-restore session au boot : si l'utilisateur a déjà un cookie
    // `expedition_session` valide (vient de replays ou ancien login), on
    // le re-logge automatiquement sans demander email/password.
    // Pattern SSO unifié sur .expeditionlauncher.store.
    useEffect(() => {
        let cancelled = false;
        fetch("/api/auth/me", { credentials: "include" })
            .then((r) => r.json())
            .then(async (data) => {
                if (cancelled) return;
                if (data.user && data.accessToken) {
                    setAccessToken(data.accessToken);
                    // Charge la subscription pour passer en dashboard
                    try {
                        const subRes = await fetch(`${WORKER_URL}/portal/subscription`, {
                            headers: { Authorization: `Bearer ${data.accessToken}` },
                        });
                        const subData = await subRes.json();
                        if (subData.subscription) setSubscription(subData.subscription);
                    } catch { /* ignore */ }
                    setStep("dashboard");
                }
            })
            .catch(() => { /* not logged in — leave on login step */ });
        return () => { cancelled = true; };
    }, []);

    // v2026-06-03 — Retour du LOGIN Discord : le worker renvoie le JWT en
    // fragment (#discord_login=ok&access_token=…). On le pose en cookie SSO via
    // /api/auth/set-session, puis on bascule en dashboard. Le fragment n'est ni
    // envoyé au serveur ni loggé ; on nettoie l'URL juste après.
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash.includes("discord_login=ok")) return;
        const frag = new URLSearchParams(hash.replace(/^#/, ""));
        const token = frag.get("access_token");
        // Nettoie l'URL immédiatement (retire le token de la barre d'adresse)
        window.history.replaceState({}, "", "/account");
        if (!token) { setError("Connexion Discord échouée. Réessaie."); return; }
        setLoading(true);
        fetch("/api/auth/set-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then((r) => r.json())
            .then(async (data) => {
                if (!data.success) { setError("Session Discord invalide. Réessaie."); return; }
                setAccessToken(token);
                try {
                    const subRes = await fetch(`${WORKER_URL}/portal/subscription`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const subData = await subRes.json();
                    if (subData.subscription) setSubscription(subData.subscription);
                } catch { /* ignore */ }
                setStep("dashboard");
            })
            .catch(() => setError("Erreur de connexion Discord."))
            .finally(() => setLoading(false));
    }, []);

    // Handle Discord link callback — when returning from Discord OAuth with discord_linked param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const discordId = params.get("discord_linked");
        if (discordId && accessToken) {
            setDiscordLinking(true);
            fetch(`${WORKER_URL}/portal/link-discord`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ discordUserId: discordId }),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) {
                        setDiscordLinked(true);
                        setSuccessMessage("Discord lié avec succès ! Votre réduction sera maintenue tant que vous restez sur le serveur.");
                    }
                })
                .catch(() => { /* ignore */ })
                .finally(() => setDiscordLinking(false));
            // Clean URL
            window.history.replaceState({}, "", "/account");
        }
    }, [accessToken]);

    // Check Discord status on login
    const checkDiscordStatus = useCallback(async (token: string) => {
        try {
            const res = await fetch(`${WORKER_URL}/portal/discord-status`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.linked) setDiscordLinked(true);
        } catch { /* ignore */ }
    }, []);

    const handleDiscordLink = () => {
        window.location.href = "/api/discord/auth?from=account";
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${WORKER_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
            });

            const data = await res.json();

            if (res.status === 409) {
                setError("Un compte existe déjà avec cet email. Connectez-vous.");
                setAuthMode("login");
                setLoading(false);
                return;
            }

            if (!res.ok) {
                throw new Error(data.error || "Erreur lors de la création du compte");
            }

            // Registration returns accessToken now
            let token: string | null = null;
            if (data.accessToken) {
                token = data.accessToken;
                setAccessToken(data.accessToken);
            } else {
                // Fallback: login after register
                const loginRes = await fetch(`${WORKER_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const loginData = await loginRes.json();
                if (!loginRes.ok) throw new Error(loginData.error || "Erreur de connexion");
                token = loginData.accessToken;
                setAccessToken(loginData.accessToken);
                if (loginData.subscription) setSubscription(loginData.subscription);
            }

            setStep("dashboard");
            setSuccessMessage("Compte créé avec succès !");
            if (token) checkDiscordStatus(token);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        if (!accessToken) return;
        setSubscribeLoading(true);
        setError(null);

        try {
            const res = await fetch(`${WORKER_URL}/portal/subscribe`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan: subscribePlan }),
            });

            const data = await res.json();

            if (res.status === 409) {
                // Already has active subscription, refresh
                const subRes = await fetch(`${WORKER_URL}/portal/subscription`, {
                    headers: { "Authorization": `Bearer ${accessToken}` },
                });
                const subData = await subRes.json();
                if (subData.subscription) setSubscription(subData.subscription);
                setSuccessMessage("Vous avez déjà un abonnement actif !");
                return;
            }

            if (!res.ok) throw new Error(data.error || "Erreur lors de la souscription");

            if (!data.clientSecret && data.subscriptionId) {
                // 100% discount
                window.location.href = "/checkout/success";
                return;
            }

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors de la souscription");
        } finally {
            setSubscribeLoading(false);
        }
    };

    const handleSubscribeSuccess = async () => {
        // Refresh subscription status
        if (accessToken) {
            const subRes = await fetch(`${WORKER_URL}/portal/subscription`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const subData = await subRes.json();
            if (subData.subscription) setSubscription(subData.subscription);
        }
        setClientSecret(null);
        setSuccessMessage("Abonnement activé ! Bienvenue dans la Vague Pionnier.");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Passe par /api/auth/login (proxy Next.js) au lieu d'appeler le
            // worker directement. Raison : le proxy pose le cookie
            // `expedition_session` sur .expeditionlauncher.store qui permet
            // le SSO partagé avec replays.expeditionlauncher.store.
            const res = await fetch(`/api/auth/login`, {
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

            // Fetch ambassador status + Discord status (non-blocking)
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

            checkDiscordStatus(data.accessToken);

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
            const redirectUrl = new URL(data.url);
            if (!ALLOWED_REDIRECT_HOSTS.some(h => redirectUrl.hostname === h || redirectUrl.hostname.endsWith("." + h))) {
                throw new Error("URL de redirection non autorisée");
            }
            window.open(data.url, "_blank");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'ouverture du portail");
        } finally {
            setActionLoading(false);
        }
    };

    /* `handleRecharge` a été retiré le 02/08/2026 avec la recharge elle-même.
       Le point d'entrée `/portal/recharge` existe toujours côté worker — on ne
       le supprime pas : des recharges déjà payées doivent rester honorées. Mais
       plus aucune page ne l'appelle. */

    const handleLifetime = async () => {
        if (!accessToken) return;
        setActionLoading(true);
        setError(null);
        try {
            const res = await fetch(`${WORKER_URL}/portal/lifetime`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            const redirectUrl = new URL(data.url);
            if (!ALLOWED_REDIRECT_HOSTS.some(h => redirectUrl.hostname === h || redirectUrl.hostname.endsWith("." + h))) {
                throw new Error("URL de redirection non autorisée");
            }
            window.open(data.url, "_blank");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors du paiement");
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
            const redirectUrl = new URL(data.url);
            if (!ALLOWED_REDIRECT_HOSTS.some(h => redirectUrl.hostname === h || redirectUrl.hostname.endsWith("." + h))) {
                throw new Error("URL de redirection non autorisée");
            }
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
            const redirectUrl = new URL(data.url);
            if (!ALLOWED_REDIRECT_HOSTS.some(h => redirectUrl.hostname === h || redirectUrl.hostname.endsWith("." + h))) {
                throw new Error("URL de redirection non autorisée");
            }
            window.open(data.url, "_blank");
        } catch (err: unknown) {
            setAmbassadorError(err instanceof Error ? err.message : "Erreur Stripe");
        } finally {
            setAmbassadorLoading(false);
        }
    };

    const handleCopyCode = async () => {
        if (!ambassadorStatus) return;
        const link = `https://expeditionlauncher.store/checkout?ref=${ambassadorStatus.referralCode}`;
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
        if (status === "active") return { text: "Actif", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" };
        if (status === "trialing") return { text: "Essai", color: "text-purple-300", bg: "bg-purple-300/10 border-purple-300/20" };
        if (status === "past_due") return { text: "Paiement en retard", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" };
        return { text: status, color: "text-white/60", bg: "bg-white/5 border-white/10" };
    };

    return (
        <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
            <PageBackground />

            <Navbar />

            <main className="pt-32 pb-24 container-main relative z-10">
                <Link href={seulTubeForge ? ACCUEIL_TUBEFORGE : "/"} className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                </Link>

                <div className="max-w-lg mx-auto">
                    <AnimatePresence mode="wait">

                        {/* Login / Register Step */}
                        {step === "login" && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={authMode === "login" ? handleLogin : handleRegister}
                                className="relative p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5"
                            >
                                <BorderBeam />
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-bold">
                                        {authMode === "login" ? "Mon compte" : "Créer un compte"}
                                    </h1>
                                    {authMode === "login" ? (
                                        <Lock className="w-5 h-5 text-purple-400/50" />
                                    ) : (
                                        <UserPlus className="w-5 h-5 text-purple-400/50" />
                                    )}
                                </div>

                                {/* Auth mode toggle */}
                                <div className="relative flex p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
                                    <motion.div
                                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-md"
                                        animate={{ x: authMode === "login" ? 0 : "calc(100% + 4px)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode("login"); setError(null); }}
                                        className={`relative z-10 flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authMode === "login" ? "text-black" : "text-white/50 hover:text-white/80"}`}
                                    >
                                        Connexion
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode("register"); setError(null); }}
                                        className={`relative z-10 flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authMode === "register" ? "text-black" : "text-white/50 hover:text-white/80"}`}
                                    >
                                        Inscription
                                    </button>
                                </div>

                                <p className="text-white/50 text-sm mb-6">
                                    {authMode === "login"
                                        ? "Connectez-vous pour gérer votre abonnement."
                                        : "Créez votre compte Expédition. Vous pourrez souscrire plus tard."
                                    }
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
                                        <label htmlFor="password" className="text-xs font-mono text-white/40 uppercase">
                                            Mot de passe{authMode === "register" ? " (min. 8 caractères)" : ""}
                                        </label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={authMode === "register" ? 8 : undefined}
                                                placeholder={authMode === "register" ? "Choisissez un mot de passe" : "Votre mot de passe"}
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
                                    className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : authMode === "login" ? (
                                        "Se connecter"
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Créer mon compte
                                        </>
                                    )}
                                </button>

                                {/* v2026-06-03 — Login Discord. Redirige vers le worker qui gère
                                    l'OAuth + mint le JWT, puis revient ici avec le token en fragment
                                    (capté par l'useEffect discordLoginFragment ci-dessus). */}
                                <div className="flex items-center gap-3 my-5">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <span className="text-xs text-white/30">ou</span>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = `${window.location.origin}/account`;
                                        window.location.href = `${DISCORD_AUTH_ORIGIN}/auth/discord/start?next=${encodeURIComponent(next)}`;
                                    }}
                                    className="w-full py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold transition-all flex items-center justify-center gap-2.5"
                                >
                                    <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true"><path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"/></svg>
                                    Se connecter avec Discord
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
                                <div className="p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
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
                                    {email === "shisto81@gmail.com" && (
                                        <Link
                                            href="/admin"
                                            onClick={() => { if (accessToken) sessionStorage.setItem("admin_token", accessToken); }}
                                            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-all"
                                        >
                                            <Shield className="w-3 h-3" />
                                            Administration
                                        </Link>
                                    )}
                                </div>

                                {/* Download Section */}
                                {subscription && subscription.status !== "canceled" && (
                                    <DownloadSection />
                                )}

                                {/* Segment "recharge / lifetime" — en parallèle de l'abonnement classique
                                    ci-dessous (jamais un remplacement). Visible quel que soit l'état
                                    d'abonnement. Piloté par PRICING_MODE (salesConfig.ts). */}
                                {PRICING_MODE !== "classic" && (
                                    <div className="p-8 rounded-2xl bg-[#0F0F12] border border-orange-500/15 shadow-2xl shadow-orange-500/5">
                                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                            <Zap className="w-5 h-5 text-orange-400" />
                                            TubeForge &mdash; Acc&egrave;s &agrave; vie
                                        </h2>
                                        {/* La RECHARGE a été retirée du produit le 02/08/2026 : elle
                                            n'est plus proposée nulle part, et le tunnel de paiement la
                                            refuse. Une seule carte reste donc ici — la grille passe en
                                            une colonne, sinon la carte restante flotterait sur une
                                            moitié d'écran. */}
                                        <div className="grid gap-4">
                                            <div className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                                                <div className="flex items-center gap-2 mb-2 text-white/70">
                                                    <Sparkles className="w-4 h-4" />
                                                    <span className="font-semibold text-sm">Acc&egrave;s &agrave; vie</span>
                                                </div>
                                                <p className="text-xs text-white/40 mb-4 flex-1">
                                                    Paiement unique, acc&egrave;s illimit&eacute; pour toujours. Plus jamais de facture TubeForge.
                                                </p>
                                                <button
                                                    onClick={handleLifetime}
                                                    disabled={actionLoading}
                                                    className="w-full py-2.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 font-semibold text-sm hover:bg-orange-500/25 transition-all disabled:opacity-50"
                                                >
                                                    Acc&egrave;s &agrave; vie &mdash; 149&euro;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Subscription Card */}
                                {subscription ? (
                                    <div className="p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
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
                                                    <div className="text-xl font-bold">11,99&euro;</div>
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
                                    <>
                                    {/* Chemin 1 — Essai : le compte est déjà créé (on est connecté ici),
                                        donc on débloque le téléchargement de l'app pour lancer les 3 jours. */}
                                    {!clientSecret && (
                                        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5 mb-4">
                                            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                                                <Download className="w-5 h-5 text-purple-400" /> Lance tes 14 jours gratuits
                                            </h2>
                                            <p className="text-white/50 text-sm mb-4">
                                                T&eacute;l&eacute;charge l&apos;app et connecte-toi : 14 jours d&apos;acc&egrave;s complet, rien n&apos;est pr&eacute;lev&eacute; avant la fin de l&apos;essai.
                                            </p>
                                            <DownloadSection />
                                        </div>
                                    )}
                                    {!clientSecret && (
                                        <div className="text-center text-xs text-white/30 mb-4">&mdash; ou abonne-toi tout de suite &mdash;</div>
                                    )}
                                    <div className="p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                        {!clientSecret ? (
                                            <>
                                                <div className="text-center mb-6">
                                                    <CreditCard className="w-10 h-10 text-white/20 mx-auto mb-4" />
                                                    <h2 className="text-lg font-bold mb-2">Activer votre abonnement</h2>
                                                    <p className="text-white/50 text-sm">Rejoignez la Vague Pionnier pour acc&eacute;der &agrave; tous les outils.</p>
                                                </div>

                                                {/* Plan Toggle */}
                                                <div className="relative flex p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
                                                    <motion.div
                                                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-md"
                                                        animate={{ x: subscribePlan === "monthly" ? 0 : "calc(100% + 4px)" }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setSubscribePlan("monthly")}
                                                        className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${subscribePlan === "monthly" ? "text-black" : "text-white/50 hover:text-white/80"}`}
                                                    >
                                                        Mensuel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSubscribePlan("yearly")}
                                                        className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${subscribePlan === "yearly" ? "text-black" : "text-white/50 hover:text-white/80"}`}
                                                    >
                                                        Annuel
                                                        <span className="absolute -top-2 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full z-20">-30%</span>
                                                    </button>
                                                </div>

                                                {/* Price display */}
                                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Shield className="w-5 h-5 text-purple-400" />
                                                        <div>
                                                            <div className="font-semibold">Vague Pionnier</div>
                                                            <div className="text-sm text-white/40">Tarif bloqu&eacute; tant que vous restez abonn&eacute;</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold">{PLANS[subscribePlan].price.toFixed(2).replace(".", ",")}€</div>
                                                        <div className="text-xs text-white/40">{PLANS[subscribePlan].label}</div>
                                                        {subscribePlan === "yearly" && (
                                                            <div className="text-green-400 text-xs">soit 8,33€/mois</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                                                    >
                                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                        {error}
                                                    </motion.div>
                                                )}

                                                {successMessage && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-2"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                                        {successMessage}
                                                    </motion.div>
                                                )}

                                                <button
                                                    onClick={handleSubscribe}
                                                    disabled={subscribeLoading}
                                                    className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {subscribeLoading ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        "Souscrire maintenant"
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-6">
                                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                                        <CreditCard className="w-5 h-5 text-purple-400" />
                                                        Paiement
                                                    </h2>
                                                    <button
                                                        onClick={() => setClientSecret(null)}
                                                        className="text-sm text-white/40 hover:text-white transition-colors"
                                                    >
                                                        Retour
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 mb-6 text-sm">
                                                    <span className="text-white/60">Vague Pionnier ({subscribePlan === "yearly" ? "Annuel" : "Mensuel"})</span>
                                                    <span className="font-bold">{PLANS[subscribePlan].price.toFixed(2).replace(".", ",")}€{PLANS[subscribePlan].label}</span>
                                                </div>
                                                <Elements
                                                    stripe={stripePromise}
                                                    options={{
                                                        clientSecret,
                                                        appearance: stripeAppearance,
                                                        locale: "fr",
                                                    }}
                                                >
                                                    <AccountPaymentForm onSuccess={handleSubscribeSuccess} />
                                                </Elements>
                                            </>
                                        )}
                                    </div>
                                    </>
                                )}

                                {/* Discord Link Card */}
                                {subscription && subscription.status !== "canceled" && !discordLinked && (
                                    <div className="p-6 rounded-2xl bg-[#0F0F12] border border-indigo-500/15 shadow-2xl shadow-indigo-500/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm">Lier mon Discord</h3>
                                                <p className="text-white/40 text-xs">Maintenez votre tarif Discord tant que vous restez sur le serveur</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDiscordLink}
                                            disabled={discordLinking}
                                            className="w-full py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium hover:bg-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                                        >
                                            {discordLinking ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <ExternalLink className="w-4 h-4" />
                                                    Vérifier mon compte Discord
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Discord Linked Confirmation */}
                                {subscription && subscription.status !== "canceled" && discordLinked && (
                                    <div className="p-4 rounded-2xl bg-[#0F0F12] border border-green-500/15 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-green-400">Discord lié</span>
                                            <p className="text-white/30 text-xs">Votre réduction est maintenue tant que vous restez sur le serveur.</p>
                                        </div>
                                    </div>
                                )}



                                {/* Ambassador Section — masquée pour les non-admins.
                                    Décision business temporaire : tant que le programme
                                    n'est pas ouvert publiquement, seuls les admins
                                    voient la section (côté account ET la sub-section
                                    "Devenez Ambassadeur"). Page /ambassador reste
                                    publique pour SEO + invitation par lien direct. */}
                                {subscription && subscription.status !== "canceled" &&
                                  ADMIN_EMAILS.includes(email.toLowerCase().trim()) && (
                                    ambassadorStatus?.isAmbassador ? (
                                        <div className="p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                                <Gift className="w-5 h-5 text-purple-400" />
                                                Programme Ambassadeur
                                            </h2>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
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

                                            {/* Earnings projection based on active referrals */}
                                            {ambassadorStatus.stats.activeReferrals > 0 && (
                                                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <TrendingUp className="w-4 h-4 text-purple-400" />
                                                        <span className="text-sm font-semibold text-white">Projection</span>
                                                    </div>
                                                    <p className="text-white/60 text-sm">
                                                        Avec vos <span className="text-white font-bold">{ambassadorStatus.stats.activeReferrals} filleul{ambassadorStatus.stats.activeReferrals > 1 ? "s" : ""} actif{ambassadorStatus.stats.activeReferrals > 1 ? "s" : ""}</span>, vous pouvez toucher jusqu&apos;à{" "}
                                                        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                                            ~{Math.round(ambassadorStatus.stats.activeReferrals * 9.99 * 0.42 * 6)}€
                                                        </span>{" "}
                                                        sur 6 mois.
                                                    </p>
                                                </div>
                                            )}
                                            {ambassadorStatus.stats.activeReferrals === 0 && (
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-6 text-center">
                                                    <p className="text-white/40 text-sm mb-1">Partagez votre lien pour commencer à gagner</p>
                                                    <p className="text-xs text-white/25">1 seul filleul = <span className="text-purple-300">~30€</span> sur 6 mois</p>
                                                </div>
                                            )}

                                            {/* Referral Code */}
                                            <div className="mb-4">
                                                <label className="text-xs font-mono text-white/40 uppercase mb-2 block">Votre lien de parrainage</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-11 px-4 bg-white/5 rounded-xl border border-white/10 text-white text-sm flex items-center truncate">
                                                        expeditionlauncher.store/checkout?ref={ambassadorStatus.referralCode}
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
                                        <div className="p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <div className="text-center mb-6">
                                                <Gift className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                                                <h2 className="text-lg font-bold mb-2">Devenez Ambassadeur</h2>
                                                <p className="text-white/50 text-sm">
                                                    Partagez Expédition et touchez <span className="text-white font-semibold">42% de commission</span> sur chaque abonnement généré, pendant 6 mois.
                                                </p>
                                            </div>

                                            {/* Earnings projection */}
                                            <div className="mb-6 space-y-2">
                                                <p className="text-xs font-mono text-white/40 uppercase">Combien vous pourriez gagner</p>
                                                {[
                                                    { referrals: 5, emoji: "🔥" },
                                                    { referrals: 10, emoji: "🚀" },
                                                    { referrals: 25, emoji: "💎" },
                                                    { referrals: 50, emoji: "👑" },
                                                ].map((tier) => {
                                                    const monthlyPerReferral = 9.99 * 0.42;
                                                    const total6Months = Math.round(tier.referrals * monthlyPerReferral * 6);
                                                    return (
                                                        <div key={tier.referrals} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-lg">{tier.emoji}</span>
                                                                <span className="text-sm text-white/70">{tier.referrals} filleuls</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">~{total6Months}€</span>
                                                                <span className="text-white/30 text-xs ml-1">sur 6 mois</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <p className="text-[10px] text-white/25 text-center">Bas&eacute; sur l&apos;abonnement mensuel &agrave; 11,99€ — 42% de commission pendant 6 mois par filleul.</p>
                                            </div>

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
                                            <div className="text-center">
                                                <Link
                                                    href="/ambassador"
                                                    className={`inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors mt-4 ${seulTubeForge ? "hidden" : ""}`}
                                                >
                                                    En savoir plus <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>

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
