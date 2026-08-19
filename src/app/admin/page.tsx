"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock, Mail, KeyRound, AlertCircle, Loader2, ChevronLeft,
    Users, Shield, CheckCircle2, XCircle, Search, ToggleLeft, ToggleRight,
    UserCheck, UserX, RefreshCw, FileText, Link2, Copy, Check, Ticket,
    Users2, Plus, ChevronDown, ChevronUp, TrendingUp, Send, Ban,
    BarChart2, Eye, Globe, Smartphone, Monitor, Tablet, ExternalLink
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useCallback } from "react";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";

interface AdminUser {
    id: string;
    email: string;
    beta_tester: boolean;
    subscription_status: string | null;
    discord_user_id: string | null;
    created_at: string;
}

interface AdminAmbassador {
    id: string;
    user_id: string;
    email: string;
    referral_code: string;
    status: string;
    stripe_connect_status: string;
    created_at: string;
    /** Personnes venues par son lien, qu'elles aient acheté ou non. */
    filleuls: number;
    /** Celles qui ont ACHETÉ. C'est le seul chiffre qui vaut de l'argent. */
    ventes: number;
    gainsVersesCents: number;
    gainsAttenteCents: number;
    derniereVente: string | null;
}

interface AmbassadorApplication {
    id: string;
    name: string;
    contact: string;
    channels: string[];
    link?: string;
    created_at: string;
}

interface TrialKey {
    id: string;
    keyCode: string;
    durationDays: number;
    redeemedBy: string | null;
    redeemedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
}

interface AdminPartner {
    id: string;
    slug: string;
    name: string;
    active: boolean;
    avatarUrl: string | null;
    created_at: string;
    totalCodes: number;
    redeemedCodes: number;
    availableCodes: number;
}

interface AdminPartnerCode {
    keyCode: string;
    durationDays: number;
    redeemedByEmail: string | null;
    redeemedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
}

type PartnerConversion = {
    partner_slug: string;
    total_users: number;
    active_subscriptions: number;
};

type Step = "login" | "admin";
/** Ce que rend GET /admin/affiliation/invitations. */
type AdminInvitation = {
    id: string;
    label: string | null;
    url: string;
    createdAt: number;
    /** Un état, pas trois booléens à recombiner à chaque affichage. */
    etat: "disponible" | "utilise" | "annule";
    usedAt: number | null;
    usedByEmail: string | null;
    referralCode: string | null;
};

type Tab = "users" | "ambassadors" | "applications" | "keys" | "partners" | "invitations" | "attribution" | "stats";

type DailyRow = { day: string; site: string; total_events: number; pageviews: number };
type ReferrerRow = { referrer: string; visits: number };
type PageRow = { page: string; views: number };
type EventRow = { event: string; count: number };
type CountryRow = { country: string; visits: number };
type DeviceRow = { device: string; count: number };

interface SiteStats {
    period: string;
    site: string;
    totals: { total_events: number; total_pageviews: number };
    daily: DailyRow[];
    topPages: PageRow[];
    sources: ReferrerRow[];
    events: EventRow[];
    countries: CountryRow[];
    devices: DeviceRow[];
}

const PERIOD_LABELS: Record<string, string> = { "7d": "7 derniers jours", "30d": "30 derniers jours", "90d": "90 derniers jours" };
const SOURCE_COLOR: Record<string, string> = {
    discord: "text-indigo-300", youtube: "text-red-300", google: "text-blue-300",
    twitter: "text-sky-300", tiktok: "text-pink-300", direct: "text-white/60",
};
const FLAG: Record<string, string> = {
    FR: "🇫🇷", US: "🇺🇸", GB: "🇬🇧", CA: "🇨🇦", BE: "🇧🇪",
    CH: "🇨🇭", DE: "🇩🇪", ES: "🇪🇸", IT: "🇮🇹", NL: "🇳🇱",
    MA: "🇲🇦", TN: "🇹🇳", DZ: "🇩🇿", SN: "🇸🇳",
};

function StatBar({ pct, color = "bg-purple-500" }: { pct: number; color?: string }) {
    return (
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(2, pct)}%` }} />
        </div>
    );
}

export default function AdminPage() {
    const [step, setStep] = useState<Step>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const [tab, setTab] = useState<Tab>("users");
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersTotal, setUsersTotal] = useState(0);
    const [usersPage, setUsersPage] = useState(1);
    const [usersSearch, setUsersSearch] = useState("");
    const [usersLoading, setUsersLoading] = useState(false);

    const [ambassadors, setAmbassadors] = useState<AdminAmbassador[]>([]);
    const [ambassadorsLoading, setAmbassadorsLoading] = useState(false);

    const [applications, setApplications] = useState<AmbassadorApplication[]>([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);

    const [keys, setKeys] = useState<TrialKey[]>([]);
    const [keysLoading, setKeysLoading] = useState(false);
    const [generateCount, setGenerateCount] = useState(4);
    const [generateDuration, setGenerateDuration] = useState(21);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [justGenerated, setJustGenerated] = useState<string[]>([]);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    /**
     * Invitations au programme d'affiliation. Un lien = une personne : tu
     * l'envoies, elle se connecte avec son compte Expédition, elle est affiliée.
     */
    const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
    const [invitationsLoading, setInvitationsLoading] = useState(false);
    const [newInvitationLabel, setNewInvitationLabel] = useState("");
    const [createInvitationLoading, setCreateInvitationLoading] = useState(false);
    const [copiedInvitation, setCopiedInvitation] = useState<string | null>(null);
    const [partners, setPartners] = useState<AdminPartner[]>([]);
    const [partnersLoading, setPartnersLoading] = useState(false);
    const [newPartnerName, setNewPartnerName] = useState("");
    const [createPartnerLoading, setCreatePartnerLoading] = useState(false);
    const [expandedPartnerId, setExpandedPartnerId] = useState<string | null>(null);
    const [expandedCodes, setExpandedCodes] = useState<AdminPartnerCode[]>([]);
    const [expandedCodesLoading, setExpandedCodesLoading] = useState(false);
    const [refillCount, setRefillCount] = useState<Record<string, number>>({});
    const [refillDuration, setRefillDuration] = useState<Record<string, number>>({});
    const [refillLoading, setRefillLoading] = useState<string | null>(null);
    const [avatarDraft, setAvatarDraft] = useState<Record<string, string>>({});
    const [avatarLoading, setAvatarLoading] = useState<string | null>(null);

    const [conversions, setConversions] = useState<PartnerConversion[]>([]);
    const [conversionsLoading, setConversionsLoading] = useState(false);

    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [statsPeriod, setStatsPeriod] = useState<"7d" | "30d" | "90d">("7d");
    const [statsSite, setStatsSite] = useState<"all" | "replays" | "site">("all");

    // Auto-login from sessionStorage (coming from /account)
    useEffect(() => {
        const token = sessionStorage.getItem("admin_token");
        if (token && !accessToken) {
            fetch(`${WORKER_URL}/admin/users?limit=1`, {
                headers: { "Authorization": `Bearer ${token}` },
            }).then((res) => {
                if (res.ok) {
                    setAccessToken(token);
                    setStep("admin");
                }
                sessionStorage.removeItem("admin_token");
            }).catch(() => {
                sessionStorage.removeItem("admin_token");
            });
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${WORKER_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur de connexion");

            // Test admin access
            const testRes = await fetch(`${WORKER_URL}/admin/users?limit=1`, {
                headers: { "Authorization": `Bearer ${data.accessToken}` },
            });
            if (!testRes.ok) throw new Error("Accès admin refusé");

            setAccessToken(data.accessToken);
            setStep("admin");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = useCallback(async () => {
        if (!accessToken) return;
        setUsersLoading(true);
        try {
            const params = new URLSearchParams({ page: String(usersPage), limit: "20" });
            if (usersSearch) params.set("search", usersSearch);
            const res = await fetch(`${WORKER_URL}/admin/users?${params}`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setUsers(data.users);
            setUsersTotal(data.total);
        } catch {
            setError("Erreur chargement utilisateurs");
        } finally {
            setUsersLoading(false);
        }
    }, [accessToken, usersPage, usersSearch]);

    const fetchAmbassadors = useCallback(async () => {
        if (!accessToken) return;
        setAmbassadorsLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/ambassadors`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setAmbassadors(data.ambassadors);
        } catch {
            setError("Erreur chargement ambassadeurs");
        } finally {
            setAmbassadorsLoading(false);
        }
    }, [accessToken]);

    const fetchApplications = useCallback(async () => {
        if (!accessToken) return;
        setApplicationsLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/ambassador/applications`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setApplications(data.applications || []);
        } catch {
            setError("Erreur chargement candidatures");
        } finally {
            setApplicationsLoading(false);
        }
    }, [accessToken]);

    const fetchInvitations = useCallback(async () => {
        if (!accessToken) return;
        setInvitationsLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/affiliation/invitations`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setInvitations(data.invitations);
        } catch {
            setError("Erreur chargement des invitations");
        } finally {
            setInvitationsLoading(false);
        }
    }, [accessToken]);

    const handleCreateInvitation = async () => {
        if (!accessToken) return;
        setCreateInvitationLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/affiliation/invitations`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
                body: JSON.stringify({ label: newInvitationLabel.trim() || undefined }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setNewInvitationLabel("");
            // Le lien part dans le presse-papiers tout de suite : on vient de le
            // créer POUR l'envoyer, pas pour le regarder dans une liste.
            if (data.invitation?.url) {
                void navigator.clipboard.writeText(data.invitation.url).then(() => {
                    setCopiedInvitation(data.invitation.id);
                    setTimeout(() => setCopiedInvitation(null), 2500);
                }).catch(() => { /* presse-papiers refusé : le lien reste dans la liste */ });
            }
            await fetchInvitations();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erreur création de l'invitation");
        } finally {
            setCreateInvitationLoading(false);
        }
    };

    const handleRevokeInvitation = async (id: string) => {
        if (!accessToken) return;
        try {
            const res = await fetch(`${WORKER_URL}/admin/affiliation/invitations/${id}/revoke`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            await fetchInvitations();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erreur annulation");
        }
    };

    const fetchKeys = useCallback(async () => {
        if (!accessToken) return;
        setKeysLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/keys`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setKeys(data.keys);
        } catch {
            setError("Erreur chargement des codes");
        } finally {
            setKeysLoading(false);
        }
    }, [accessToken]);

    const fetchPartners = useCallback(async () => {
        if (!accessToken) return;
        setPartnersLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/partners`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setPartners(data.partners);
        } catch {
            setError("Erreur chargement partenaires");
        } finally {
            setPartnersLoading(false);
        }
    }, [accessToken]);

    const fetchConversions = useCallback(async () => {
        if (!accessToken) return;
        setConversionsLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/partners/conversions`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setConversions(data.partners ?? []);
        } catch {
            setError("Erreur chargement attribution");
        } finally {
            setConversionsLoading(false);
        }
    }, [accessToken]);

    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        setStatsError(null);
        try {
            const params = new URLSearchParams({ period: statsPeriod });
            if (statsSite !== "all") params.set("site", statsSite);
            const res = await fetch(`/api/admin/stats?${params}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`Erreur ${res.status}`);
            setSiteStats(await res.json());
        } catch (e) {
            setStatsError(e instanceof Error ? e.message : "Erreur inconnue");
        } finally {
            setStatsLoading(false);
        }
    }, [statsPeriod, statsSite]);

    const fetchPartnerCodes = async (partnerId: string) => {
        if (!accessToken) return;
        setExpandedCodesLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/partners/${partnerId}`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setExpandedCodes(data.codes);
        } catch {
            setError("Erreur chargement codes");
        } finally {
            setExpandedCodesLoading(false);
        }
    };

    const handleCreatePartner = async () => {
        if (!accessToken || !newPartnerName.trim()) return;
        setCreatePartnerLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/admin/partners`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newPartnerName.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessMessage(`Partenaire "${data.name}" créé — slug : ${data.slug}`);
            setTimeout(() => setSuccessMessage(null), 4000);
            setNewPartnerName("");
            fetchPartners();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur création");
        } finally {
            setCreatePartnerLoading(false);
        }
    };

    const handleRefill = async (partnerId: string) => {
        if (!accessToken) return;
        const count = refillCount[partnerId] ?? 5;
        const duration = refillDuration[partnerId] ?? 7;
        if (count > 10) {
            const ok = window.confirm(`Générer ${count} codes de ${duration} jours ?`);
            if (!ok) return;
        }
        setRefillLoading(partnerId);
        try {
            const res = await fetch(`${WORKER_URL}/admin/partners/${partnerId}/refill`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ count, durationDays: duration }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessMessage(`${data.keys.length} code(s) de ${duration}j générés`);
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchPartners();
            if (expandedPartnerId === partnerId) fetchPartnerCodes(partnerId);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur génération");
        } finally {
            setRefillLoading(null);
        }
    };

    const handleTogglePartner = async (partnerId: string, current: boolean) => {
        if (!accessToken) return;
        setActionLoading(partnerId);
        try {
            const res = await fetch(`${WORKER_URL}/admin/partners/${partnerId}/toggle`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ active: !current }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setPartners((prev) => prev.map((p) =>
                p.id === partnerId ? { ...p, active: !current } : p
            ));
            setSuccessMessage(`Partenaire ${!current ? "activé" : "désactivé"}`);
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setActionLoading(null);
        }
    };

    const handleSetAvatar = async (partnerId: string) => {
        if (!accessToken) return;
        const draft = (avatarDraft[partnerId] ?? "").trim();
        setAvatarLoading(partnerId);
        try {
            const res = await fetch(`${WORKER_URL}/admin/partners/${partnerId}/avatar`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ avatarUrl: draft || null }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setPartners((prev) => prev.map((p) =>
                p.id === partnerId ? { ...p, avatarUrl: data.avatarUrl } : p
            ));
            setAvatarDraft((prev) => {
                const next = { ...prev };
                delete next[partnerId];
                return next;
            });
            setSuccessMessage(data.avatarUrl ? "Avatar mis à jour" : "Avatar retiré");
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setAvatarLoading(null);
        }
    };

    const copyPartnerUrl = (slug: string) => {
        navigator.clipboard.writeText(`https://expeditionlauncher.store/partenaire/${slug}`);
        setCopiedKey(`url-${slug}`);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleGenerateKeys = async () => {
        if (!accessToken) return;
        setGenerateLoading(true);
        setJustGenerated([]);
        try {
            const res = await fetch(`${WORKER_URL}/admin/keys/generate`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ count: generateCount, durationDays: generateDuration }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setJustGenerated(data.keys);
            setSuccessMessage(`${data.keys.length} code(s) de ${generateDuration}j générés`);
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchKeys();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur génération");
        } finally {
            setGenerateLoading(false);
        }
    };

    const copyLink = (keyCode: string) => {
        navigator.clipboard.writeText(`https://expeditionlauncher.store/try/${keyCode}`);
        setCopiedKey(keyCode);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    useEffect(() => {
        if (step === "admin" && tab === "users") fetchUsers();
    }, [step, tab, fetchUsers]);

    useEffect(() => {
        if (step === "admin" && tab === "ambassadors") fetchAmbassadors();
    }, [step, tab, fetchAmbassadors]);

    useEffect(() => {
        if (step === "admin" && tab === "applications") fetchApplications();
    }, [step, tab, fetchApplications]);

    useEffect(() => {
        if (step === "admin" && tab === "keys") fetchKeys();
    }, [step, tab, fetchKeys]);

    useEffect(() => {
        if (step === "admin" && tab === "partners") fetchPartners();
        if (step === "admin" && tab === "invitations") fetchInvitations();
    }, [step, tab, fetchPartners]);

    useEffect(() => {
        if (step === "admin" && tab === "attribution") fetchConversions();
    }, [step, tab, fetchConversions]);

    useEffect(() => {
        if (step === "admin" && tab === "stats") fetchStats();
    }, [step, tab, statsPeriod, statsSite, fetchStats]);

    const toggleBeta = async (userId: string, current: boolean) => {
        if (!accessToken) return;
        setActionLoading(userId);
        try {
            const res = await fetch(`${WORKER_URL}/admin/users/${userId}/beta`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ beta_tester: !current }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setUsers((prev) => prev.map((u) =>
                u.id === userId ? { ...u, beta_tester: !current } : u
            ));
            setSuccessMessage(`Beta ${!current ? "activé" : "désactivé"}`);
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setActionLoading(null);
        }
    };

    const handleAmbassador = async (ambassadorId: string, action: "approve" | "reject") => {
        if (!accessToken) return;
        setActionLoading(ambassadorId);
        try {
            const res = await fetch(`${WORKER_URL}/admin/ambassadors/${ambassadorId}/${action}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setAmbassadors((prev) => prev.map((a) =>
                a.id === ambassadorId ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a
            ));
            setSuccessMessage(`Ambassadeur ${action === "approve" ? "approuvé" : "rejeté"}`);
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setActionLoading(null);
        }
    };

    const totalPages = Math.ceil(usersTotal / 20);

    const statusBadge = (status: string | null) => {
        if (!status) return <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30">Aucun</span>;
        const colors: Record<string, string> = {
            active: "bg-green-500/15 text-green-400 border-green-500/20",
            trialing: "bg-blue-500/15 text-blue-400 border-blue-500/20",
            past_due: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
            canceled: "bg-red-500/15 text-red-400 border-red-500/20",
            pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
            approved: "bg-green-500/15 text-green-400 border-green-500/20",
            rejected: "bg-red-500/15 text-red-400 border-red-500/20",
        };
        return (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[status] || "bg-white/5 text-white/40 border-white/10"}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-clip relative">
            {/* Pas de PageBackground ici : panneau de données = fond uni, zéro décor */}
            <Navbar />

            <main className="pt-32 pb-24 container-main relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                </Link>

                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === "login" && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleLogin}
                                className="relative p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5 max-w-lg mx-auto"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-bold">Admin</h1>
                                    <Shield className="w-5 h-5 text-purple-400/50" />
                                </div>

                                <p className="text-white/50 text-sm mb-6">
                                    Connectez-vous avec votre compte administrateur.
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
                                                placeholder="admin@email.com"
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
                                    className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            Connexion Admin
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {step === "admin" && (
                            <motion.div
                                key="admin"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Header */}
                                <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-purple-400" />
                                            <h1 className="text-xl font-bold">Administration</h1>
                                        </div>
                                        <button
                                            onClick={() => { setStep("login"); setAccessToken(null); setError(null); }}
                                            className="text-sm text-white/40 hover:text-white transition-colors"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => setTab("users")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "users" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <Users className="w-4 h-4" />
                                        Utilisateurs ({usersTotal})
                                    </button>
                                    <button
                                        onClick={() => setTab("ambassadors")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "ambassadors" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Ambassadeurs ({ambassadors.length})
                                    </button>
                                    <button
                                        onClick={() => setTab("applications")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "applications" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Candidatures ({applications.length})
                                    </button>
                                    <button
                                        onClick={() => setTab("keys")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "keys" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <Ticket className="w-4 h-4" />
                                        Codes ({keys.length})
                                    </button>
                                    <button
                                        onClick={() => setTab("partners")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "partners" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <Users2 className="w-4 h-4" />
                                        Partenaires ({partners.length})
                                    </button>
                                    <button
                                        onClick={() => setTab("invitations")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "invitations" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <Send className="w-4 h-4" />
                                        Invitations ({invitations.filter((i) => i.etat === "disponible").length})
                                    </button>
                                    <button
                                        onClick={() => setTab("attribution")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "attribution" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        Attribution ({conversions.length})
                                    </button>
                                    <button
                                        onClick={() => setTab("stats")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "stats" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <BarChart2 className="w-4 h-4" />
                                        Analytics
                                    </button>
                                </div>

                                {/* Success message */}
                                {successMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                        {successMessage}
                                    </motion.div>
                                )}

                                {/* Error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        {error}
                                        <button onClick={() => setError(null)} className="ml-auto text-red-400/50 hover:text-red-400">
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}

                                {/* Users Tab */}
                                {tab === "users" && (
                                    <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                        {/* Search */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                <input
                                                    type="text"
                                                    value={usersSearch}
                                                    onChange={(e) => { setUsersSearch(e.target.value); setUsersPage(1); }}
                                                    placeholder="Rechercher par email..."
                                                    className="w-full h-10 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                                                />
                                            </div>
                                            <button
                                                onClick={fetchUsers}
                                                disabled={usersLoading}
                                                className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} />
                                            </button>
                                        </div>

                                        {/* Users table */}
                                        {usersLoading && users.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    {/* Header */}
                                                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-mono text-white/30 uppercase">
                                                        <span>Email</span>
                                                        <span className="w-20 text-center">Abo</span>
                                                        <span className="w-16 text-center">Beta</span>
                                                        <span className="w-20 text-center">Action</span>
                                                    </div>

                                                    {users.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="text-sm text-white/80 truncate">{user.email}</p>
                                                                <p className="text-xs text-white/25">{new Date(user.created_at).toLocaleDateString("fr-FR")}</p>
                                                            </div>
                                                            <div className="w-20 flex justify-center">
                                                                {statusBadge(user.subscription_status)}
                                                            </div>
                                                            <div className="w-16 flex justify-center">
                                                                {user.beta_tester ? (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">oui</span>
                                                                ) : (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/25">non</span>
                                                                )}
                                                            </div>
                                                            <div className="w-20 flex justify-center">
                                                                <button
                                                                    onClick={() => toggleBeta(user.id, user.beta_tester)}
                                                                    disabled={actionLoading === user.id}
                                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${user.beta_tester
                                                                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                                                            : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
                                                                        }`}
                                                                >
                                                                    {actionLoading === user.id ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : user.beta_tester ? (
                                                                        <><ToggleRight className="w-3 h-3" /> Retirer</>
                                                                    ) : (
                                                                        <><ToggleLeft className="w-3 h-3" /> Activer</>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {users.length === 0 && !usersLoading && (
                                                        <p className="text-center text-white/30 py-8 text-sm">Aucun utilisateur trouvé</p>
                                                    )}
                                                </div>

                                                {/* Pagination */}
                                                {totalPages > 1 && (
                                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                                                        <p className="text-xs text-white/30">
                                                            Page {usersPage} / {totalPages} ({usersTotal} utilisateurs)
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                                                                disabled={usersPage <= 1}
                                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 disabled:opacity-30 transition-all"
                                                            >
                                                                Précédent
                                                            </button>
                                                            <button
                                                                onClick={() => setUsersPage((p) => Math.min(totalPages, p + 1))}
                                                                disabled={usersPage >= totalPages}
                                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 disabled:opacity-30 transition-all"
                                                            >
                                                                Suivant
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Ambassadors Tab */}
                                {tab === "ambassadors" && (
                                    <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-sm font-mono text-white/40 uppercase">Ambassadeurs</h2>
                                            <button
                                                onClick={fetchAmbassadors}
                                                disabled={ambassadorsLoading}
                                                className="h-8 px-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${ambassadorsLoading ? "animate-spin" : ""}`} />
                                            </button>
                                        </div>

                                        {ambassadorsLoading && ambassadors.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {ambassadors.map((amb) => (
                                                    <div
                                                        key={amb.id}
                                                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm text-white/80 truncate">{amb.email}</p>
                                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                <span className="text-xs text-white/25 font-mono">{amb.referral_code}</span>
                                                                {statusBadge(amb.status)}
                                                                {/* Stripe Connect inactif = les commissions s'accumulent en
                                                                    attente au lieu d'être versées. Le signaler ici évite de
                                                                    découvrir six mois plus tard qu'on doit de l'argent. */}
                                                                {amb.stripe_connect_status !== "active" && (amb.ventes ?? 0) > 0 && (
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/15 text-amber-300">
                                                                        paiement non configuré
                                                                    </span>
                                                                )}
                                                                <span className="text-xs text-white/20">{new Date(amb.created_at).toLocaleDateString("fr-FR")}</span>
                                                            </div>

                                                            {/* ⛔ CE BLOC N'EXISTAIT PAS : l'admin ne montrait que
                                                                l'identité et le statut. La personne qui PAIE les
                                                                commissions était la seule à ne pas voir qui vendait. */}
                                                            <div className="flex items-center gap-4 mt-2.5 text-xs">
                                                                <span className="text-white/45">
                                                                    <span className="font-bold text-white">{amb.ventes ?? 0}</span> vente{(amb.ventes ?? 0) > 1 ? "s" : ""}
                                                                </span>
                                                                <span className="text-white/30">
                                                                    {amb.filleuls ?? 0} filleul{(amb.filleuls ?? 0) > 1 ? "s" : ""}
                                                                </span>
                                                                {((amb.gainsVersesCents ?? 0) > 0) && (
                                                                    <span className="text-emerald-300/80">
                                                                        {((amb.gainsVersesCents ?? 0) / 100).toFixed(2).replace(".", ",")}&euro; versés
                                                                    </span>
                                                                )}
                                                                {((amb.gainsAttenteCents ?? 0) > 0) && (
                                                                    <span className="text-amber-300/80">
                                                                        {((amb.gainsAttenteCents ?? 0) / 100).toFixed(2).replace(".", ",")}&euro; en attente
                                                                    </span>
                                                                )}
                                                                {amb.derniereVente && (
                                                                    <span className="text-white/20">
                                                                        dernière : {new Date(amb.derniereVente).toLocaleDateString("fr-FR")}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {amb.status === "pending" && (
                                                            <div className="flex gap-2 ml-4">
                                                                <button
                                                                    onClick={() => handleAmbassador(amb.id, "approve")}
                                                                    disabled={actionLoading === amb.id}
                                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 text-xs font-medium transition-all disabled:opacity-50"
                                                                >
                                                                    {actionLoading === amb.id ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <><UserCheck className="w-3 h-3" /> Approuver</>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAmbassador(amb.id, "reject")}
                                                                    disabled={actionLoading === amb.id}
                                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium transition-all disabled:opacity-50"
                                                                >
                                                                    <UserX className="w-3 h-3" /> Rejeter
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {ambassadors.length === 0 && !ambassadorsLoading && (
                                                    <p className="text-center text-white/30 py-8 text-sm">Aucun ambassadeur</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Keys Tab */}
                                {tab === "keys" && (
                                    <div className="space-y-6">
                                        {/* Generate Section */}
                                        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <h2 className="text-sm font-mono text-white/40 uppercase mb-6">Générer des codes</h2>

                                            <div className="flex flex-wrap items-end gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-mono text-white/40 uppercase">Durée</label>
                                                    <select
                                                        value={generateDuration}
                                                        onChange={(e) => setGenerateDuration(Number(e.target.value))}
                                                        className="h-10 px-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value={3}>3 jours</option>
                                                        <option value={7}>7 jours</option>
                                                        <option value={14}>14 jours</option>
                                                        <option value={21}>21 jours (3 sem.)</option>
                                                        <option value={30}>30 jours</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-mono text-white/40 uppercase">Nombre</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={50}
                                                        value={generateCount}
                                                        onChange={(e) => setGenerateCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                                                        className="h-10 w-20 px-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm text-center focus:outline-none focus:border-purple-500/50 transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleGenerateKeys}
                                                    disabled={generateLoading}
                                                    className="h-10 px-5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {generateLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <KeyRound className="w-4 h-4" />
                                                    )}
                                                    Générer
                                                </button>
                                            </div>

                                            {/* Just generated codes */}
                                            {justGenerated.length > 0 && (
                                                <div className="mt-6 p-4 rounded-xl bg-green-500/5 border border-green-500/15">
                                                    <p className="text-xs font-mono text-green-400/60 uppercase mb-3">Codes générés — {generateDuration} jours</p>
                                                    <div className="space-y-2">
                                                        {justGenerated.map((code) => (
                                                            <div
                                                                key={code}
                                                                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5"
                                                            >
                                                                <code className="text-sm text-white/80 font-mono">{code}</code>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-white/25 hidden sm:block truncate max-w-[200px]">
                                                                        expeditionlauncher.store/try/{code}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => copyLink(code)}
                                                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-medium transition-all"
                                                                    >
                                                                        {copiedKey === code ? (
                                                                            <><Check className="w-3 h-3" /> Copié</>
                                                                        ) : (
                                                                            <><Copy className="w-3 h-3" /> Copier le lien</>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* All Keys List */}
                                        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-sm font-mono text-white/40 uppercase">Tous les codes ({keys.length})</h2>
                                                <button
                                                    onClick={fetchKeys}
                                                    disabled={keysLoading}
                                                    className="h-8 px-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    <RefreshCw className={`w-3.5 h-3.5 ${keysLoading ? "animate-spin" : ""}`} />
                                                </button>
                                            </div>

                                            {keysLoading && keys.length === 0 ? (
                                                <div className="flex items-center justify-center py-12">
                                                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {/* Header */}
                                                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-mono text-white/30 uppercase">
                                                        <span>Code</span>
                                                        <span className="w-16 text-center">Durée</span>
                                                        <span className="w-20 text-center">Statut</span>
                                                        <span className="w-24 text-center">Action</span>
                                                    </div>

                                                    {keys.map((key) => (
                                                        <div
                                                            key={key.id}
                                                            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                                                        >
                                                            <div className="min-w-0">
                                                                <code className="text-sm text-white/80 font-mono">{key.keyCode}</code>
                                                                <p className="text-xs text-white/25">{new Date(key.createdAt).toLocaleDateString("fr-FR")}</p>
                                                            </div>
                                                            <div className="w-16 flex justify-center">
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                                                                    {key.durationDays}j
                                                                </span>
                                                            </div>
                                                            <div className="w-20 flex justify-center">
                                                                {key.redeemedBy ? (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                                                                        Utilisé
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                                                                        Dispo
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="w-24 flex justify-center">
                                                                {!key.redeemedBy ? (
                                                                    <button
                                                                        onClick={() => copyLink(key.keyCode)}
                                                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-medium transition-all"
                                                                    >
                                                                        {copiedKey === key.keyCode ? (
                                                                            <><Check className="w-3 h-3" /> Copié</>
                                                                        ) : (
                                                                            <><Copy className="w-3 h-3" /> Lien</>
                                                                        )}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-xs text-white/20">—</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {keys.length === 0 && !keysLoading && (
                                                        <p className="text-center text-white/30 py-8 text-sm">Aucun code généré</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Applications Tab */}
                                {tab === "applications" && (
                                    <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-sm font-mono text-white/40 uppercase">Candidatures Affiliation</h2>
                                            <button
                                                onClick={fetchApplications}
                                                disabled={applicationsLoading}
                                                className="h-8 px-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${applicationsLoading ? "animate-spin" : ""}`} />
                                            </button>
                                        </div>

                                        {applicationsLoading && applications.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {applications.map((app) => (
                                                    <div
                                                        key={app.id}
                                                        className="px-4 py-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all space-y-2"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-white/90">{app.name}</p>
                                                                <p className="text-xs text-white/40 mt-0.5">{app.contact}</p>
                                                            </div>
                                                            <span className="text-xs text-white/25 shrink-0">
                                                                {new Date(app.created_at).toLocaleDateString("fr-FR")}
                                                            </span>
                                                        </div>
                                                        {app.channels && app.channels.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {app.channels.map((ch) => (
                                                                    <span key={ch} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono">
                                                                        {ch}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {app.link && (
                                                            <a
                                                                href={app.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-xs text-purple-400/70 hover:text-purple-300 transition-colors"
                                                            >
                                                                <Link2 className="w-3 h-3" />
                                                                {app.link}
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}

                                                {applications.length === 0 && !applicationsLoading && (
                                                    <p className="text-center text-white/30 py-8 text-sm">Aucune candidature</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Partners Tab */}
                                {tab === "partners" && (
                                    <div className="space-y-6">
                                        {/* Create partner */}
                                        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <h2 className="text-sm font-mono text-white/40 uppercase mb-6">Créer un partenaire</h2>
                                            <div className="flex flex-wrap items-end gap-4">
                                                <div className="space-y-2 flex-1 min-w-[200px]">
                                                    <label className="text-xs font-mono text-white/40 uppercase">Nom du partenaire</label>
                                                    <input
                                                        type="text"
                                                        value={newPartnerName}
                                                        onChange={(e) => setNewPartnerName(e.target.value)}
                                                        placeholder="ex: Shyro"
                                                        onKeyDown={(e) => { if (e.key === "Enter") handleCreatePartner(); }}
                                                        className="w-full h-10 px-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleCreatePartner}
                                                    disabled={createPartnerLoading || !newPartnerName.trim()}
                                                    className="h-10 px-5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {createPartnerLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <><Plus className="w-4 h-4" /> Créer</>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-xs text-white/30 mt-3">Le slug est généré avec un suffixe aléatoire pour empêcher les URLs devinables (ex : <code className="font-mono text-white/50">shyro-a3f8b2</code>).</p>
                                        </div>

                                        {/* List partners */}
                                        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-sm font-mono text-white/40 uppercase">Partenaires ({partners.length})</h2>
                                                <button
                                                    onClick={fetchPartners}
                                                    disabled={partnersLoading}
                                                    className="h-8 px-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    <RefreshCw className={`w-3.5 h-3.5 ${partnersLoading ? "animate-spin" : ""}`} />
                                                </button>
                                            </div>

                                            {partnersLoading && partners.length === 0 ? (
                                                <div className="flex items-center justify-center py-12">
                                                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {partners.map((p) => (
                                                        <div
                                                            key={p.id}
                                                            className="px-4 py-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all space-y-3"
                                                        >
                                                            {/* Header */}
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <p className="text-sm font-semibold text-white/90">{p.name}</p>
                                                                        {p.active ? (
                                                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">actif</span>
                                                                        ) : (
                                                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">inactif</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-1 min-w-0">
                                                                        <code className="text-xs text-white/30 truncate font-mono">/partenaire/{p.slug}</code>
                                                                        <button
                                                                            onClick={() => copyPartnerUrl(p.slug)}
                                                                            className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-[10px] font-medium transition-all"
                                                                        >
                                                                            {copiedKey === `url-${p.slug}` ? (
                                                                                <><Check className="w-2.5 h-2.5" /> Copié</>
                                                                            ) : (
                                                                                <><Copy className="w-2.5 h-2.5" /> URL</>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleTogglePartner(p.id, p.active)}
                                                                    disabled={actionLoading === p.id}
                                                                    className="text-xs text-white/40 hover:text-white transition-colors disabled:opacity-50 shrink-0"
                                                                >
                                                                    {actionLoading === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : p.active ? "Désactiver" : "Activer"}
                                                                </button>
                                                            </div>

                                                            {/* Stats */}
                                                            <div className="flex gap-2 flex-wrap">
                                                                <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{p.availableCodes} dispo</span>
                                                                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">{p.redeemedCodes} utilisés</span>
                                                                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">{p.totalCodes} total</span>
                                                            </div>

                                                            {/* Avatar */}
                                                            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                                                <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                                                                    {p.avatarUrl ? (
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-sm font-bold text-white">{p.name.trim()[0]?.toUpperCase() ?? "?"}</span>
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={avatarDraft[p.id] ?? p.avatarUrl ?? ""}
                                                                    onChange={(e) => setAvatarDraft({ ...avatarDraft, [p.id]: e.target.value })}
                                                                    placeholder="URL image (https://... ou /partenaires/shyro.jpg)"
                                                                    className="flex-1 h-9 px-3 bg-white/5 rounded-lg border border-white/10 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-purple-500/50 transition-all"
                                                                />
                                                                <button
                                                                    onClick={() => handleSetAvatar(p.id)}
                                                                    disabled={avatarLoading === p.id}
                                                                    className="shrink-0 h-9 px-3 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                                >
                                                                    {avatarLoading === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enregistrer"}
                                                                </button>
                                                            </div>

                                                            {/* Refill form */}
                                                            <div className="flex flex-wrap items-end gap-2 pt-2 border-t border-white/5">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-mono text-white/40 uppercase">Durée</label>
                                                                    <select
                                                                        value={refillDuration[p.id] ?? 7}
                                                                        onChange={(e) => setRefillDuration({ ...refillDuration, [p.id]: Number(e.target.value) })}
                                                                        className="h-8 px-2 bg-white/5 rounded-lg border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                                                                    >
                                                                        <option value={3}>3j</option>
                                                                        <option value={7}>7j</option>
                                                                        <option value={14}>14j</option>
                                                                        <option value={21}>21j</option>
                                                                        <option value={30}>30j</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-mono text-white/40 uppercase">Nombre</label>
                                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        max={50}
                                                                        value={refillCount[p.id] ?? 5}
                                                                        onChange={(e) => setRefillCount({ ...refillCount, [p.id]: Math.min(50, Math.max(1, Number(e.target.value))) })}
                                                                        className="h-8 w-16 px-2 bg-white/5 rounded-lg border border-white/10 text-white text-xs text-center focus:outline-none focus:border-purple-500/50 transition-all"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRefill(p.id)}
                                                                    disabled={refillLoading === p.id}
                                                                    className="h-8 px-3 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-1.5 disabled:opacity-50"
                                                                >
                                                                    {refillLoading === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3" />}
                                                                    Générer
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (expandedPartnerId === p.id) {
                                                                            setExpandedPartnerId(null);
                                                                            setExpandedCodes([]);
                                                                        } else {
                                                                            setExpandedPartnerId(p.id);
                                                                            fetchPartnerCodes(p.id);
                                                                        }
                                                                    }}
                                                                    className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center gap-1.5 ml-auto"
                                                                >
                                                                    {expandedPartnerId === p.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                                    {expandedPartnerId === p.id ? "Masquer" : "Voir codes"}
                                                                </button>
                                                            </div>

                                                            {/* Expanded codes */}
                                                            {expandedPartnerId === p.id && (
                                                                <div className="pt-3 border-t border-white/5 space-y-2">
                                                                    {expandedCodesLoading ? (
                                                                        <div className="flex justify-center py-4">
                                                                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                                                                        </div>
                                                                    ) : expandedCodes.length === 0 ? (
                                                                        <p className="text-center text-white/30 py-4 text-xs">Aucun code</p>
                                                                    ) : (
                                                                        expandedCodes.map((c) => (
                                                                            <div
                                                                                key={c.keyCode}
                                                                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5"
                                                                            >
                                                                                <code className="text-xs text-white/80 font-mono flex-1 truncate">{c.keyCode}</code>
                                                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10 shrink-0">{c.durationDays}j</span>
                                                                                {c.redeemedByEmail ? (
                                                                                    <span className="text-[10px] text-red-400/80 truncate max-w-[140px]" title={c.redeemedByEmail}>Utilisé · {c.redeemedByEmail}</span>
                                                                                ) : (
                                                                                    <span className="text-[10px] text-green-400/80 shrink-0">Dispo</span>
                                                                                )}
                                                                                <button
                                                                                    onClick={() => copyLink(c.keyCode)}
                                                                                    className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-[10px] font-medium transition-all"
                                                                                >
                                                                                    {copiedKey === c.keyCode ? (
                                                                                        <><Check className="w-2.5 h-2.5" /> Copié</>
                                                                                    ) : (
                                                                                        <><Copy className="w-2.5 h-2.5" /> Lien</>
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {partners.length === 0 && !partnersLoading && (
                                                        <p className="text-center text-white/30 py-8 text-sm">Aucun partenaire — créez-en un ci-dessus.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stats Tab */}
                                {tab === "invitations" && (
                                    <div className="space-y-6">
                                        {/* Créer un lien */}
                                        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <h2 className="text-sm font-mono text-white/40 uppercase mb-2">Inviter dans le programme d&apos;affiliation</h2>
                                            <p className="text-xs text-white/35 mb-6">
                                                Un lien = une personne. Elle se connecte avec son compte Expédition et
                                                elle est affiliée — sans formulaire, sans approbation, sans achat préalable.
                                            </p>
                                            <div className="flex flex-wrap items-end gap-4">
                                                <div className="space-y-2 flex-1 min-w-[220px]">
                                                    <label className="text-xs font-mono text-white/40 uppercase">Pour qui ?</label>
                                                    <input
                                                        type="text"
                                                        value={newInvitationLabel}
                                                        onChange={(e) => setNewInvitationLabel(e.target.value)}
                                                        placeholder="ex : Donay"
                                                        onKeyDown={(e) => { if (e.key === "Enter") void handleCreateInvitation(); }}
                                                        className="w-full h-10 px-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => void handleCreateInvitation()}
                                                    disabled={createInvitationLoading}
                                                    className="h-10 px-5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {createInvitationLoading
                                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                                        : <><Plus className="w-4 h-4" /> Créer le lien</>}
                                                </button>
                                            </div>
                                            {/* Un libellé facultatif, mais sans lui la liste devient illisible :
                                                dans deux semaines, « à qui j'ai envoyé celui-là ? » n'a pas de réponse. */}
                                            <p className="text-xs text-white/30 mt-3">
                                                Le libellé n&apos;est visible que par toi. Le lien est copié dès sa création.
                                            </p>
                                        </div>

                                        {/* La liste */}
                                        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-sm font-mono text-white/40 uppercase">Liens ({invitations.length})</h2>
                                                <button onClick={() => void fetchInvitations()} className="text-white/40 hover:text-white transition-colors">
                                                    <RefreshCw className={`w-4 h-4 ${invitationsLoading ? "animate-spin" : ""}`} />
                                                </button>
                                            </div>

                                            {invitations.length === 0 && !invitationsLoading && (
                                                <p className="text-sm text-white/30">Aucun lien pour l&apos;instant.</p>
                                            )}

                                            <div className="space-y-3">
                                                {invitations.map((inv) => (
                                                    <div key={inv.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                                    <span className="text-sm font-medium text-white">{inv.label || "Sans libellé"}</span>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                                                                        inv.etat === "disponible" ? "bg-emerald-500/15 text-emerald-300"
                                                                        : inv.etat === "utilise" ? "bg-purple-500/15 text-purple-300"
                                                                        : "bg-white/10 text-white/40"
                                                                    }`}>
                                                                        {inv.etat === "disponible" ? "disponible" : inv.etat === "utilise" ? "utilisé" : "annulé"}
                                                                    </span>
                                                                </div>
                                                                {inv.etat === "utilise" ? (
                                                                    <p className="text-xs text-white/45">
                                                                        {inv.usedByEmail ?? "compte inconnu"}
                                                                        {inv.referralCode && <> · code <span className="font-mono text-white/70">{inv.referralCode}</span></>}
                                                                    </p>
                                                                ) : (
                                                                    <p className="font-mono text-[11px] text-white/35 break-all">{inv.url}</p>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2 shrink-0">
                                                                {inv.etat === "disponible" && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => {
                                                                                void navigator.clipboard.writeText(inv.url).then(() => {
                                                                                    setCopiedInvitation(inv.id);
                                                                                    setTimeout(() => setCopiedInvitation(null), 2000);
                                                                                });
                                                                            }}
                                                                            className="h-9 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs flex items-center gap-1.5 transition-all"
                                                                        >
                                                                            {copiedInvitation === inv.id ? <><Check className="w-3.5 h-3.5" /> Copié</> : <><Copy className="w-3.5 h-3.5" /> Copier</>}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => void handleRevokeInvitation(inv.id)}
                                                                            className="h-9 px-3 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/50 hover:text-red-300 text-xs flex items-center gap-1.5 transition-all"
                                                                        >
                                                                            <Ban className="w-3.5 h-3.5" /> Annuler
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Annuler un lien DÉJÀ utilisé ne retirerait personne du programme :
                                                l'affiliation vit dans `ambassadors`, pas dans les invitations. Le
                                                bouton n'apparaît donc pas — laisser croire le contraire serait pire. */}
                                            <p className="text-xs text-white/25 mt-5 leading-relaxed">
                                                Annuler ne vaut que pour un lien non utilisé. Une fois accepté, retirer
                                                quelqu&apos;un du programme se fait depuis l&apos;onglet Ambassadeurs.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {tab === "stats" && (
                                    <div className="space-y-6">
                                        {/* Filtres */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="flex rounded-lg overflow-hidden border border-white/[0.08] text-[11px] font-mono">
                                                {(["all", "replays", "site"] as const).map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setStatsSite(s)}
                                                        className={`px-3 py-1.5 transition-colors ${statsSite === s ? "bg-purple-500/20 text-purple-200" : "text-white/40 hover:text-white hover:bg-white/[0.04]"}`}
                                                    >
                                                        {s === "all" ? "🌍 all" : s === "replays" ? "🎬 replays" : "🌐 site"}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex rounded-lg overflow-hidden border border-white/[0.08] text-[11px] font-mono">
                                                {(["7d", "30d", "90d"] as const).map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setStatsPeriod(p)}
                                                        className={`px-3 py-1.5 transition-colors ${statsPeriod === p ? "bg-purple-500/20 text-purple-200" : "text-white/40 hover:text-white hover:bg-white/[0.04]"}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={fetchStats}
                                                disabled={statsLoading}
                                                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] border border-white/[0.08] transition-all"
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? "animate-spin" : ""}`} />
                                            </button>
                                        </div>

                                        {statsError && (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{statsError}</div>
                                        )}

                                        {statsLoading && !siteStats && (
                                            <div className="text-center py-16 text-white/30 text-sm font-mono">Chargement des stats…</div>
                                        )}

                                        {siteStats && (() => {
                                            const maxPV = Math.max(1, ...siteStats.daily.map((d) => d.pageviews));
                                            const maxV = Math.max(1, ...siteStats.sources.map((s) => s.visits));
                                            const maxVw = Math.max(1, ...siteStats.topPages.map((p) => p.views));
                                            const totalDev = Math.max(1, siteStats.devices.reduce((a, d) => a + d.count, 0));
                                            return (
                                                <div className="space-y-4">
                                                    {/* Totaux */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {[
                                                            { label: "Pages vues", value: siteStats.totals.total_pageviews.toLocaleString("fr"), icon: Eye, sub: PERIOD_LABELS[statsPeriod] },
                                                            { label: "Events total", value: siteStats.totals.total_events.toLocaleString("fr"), icon: TrendingUp, sub: undefined },
                                                            { label: "Sources", value: siteStats.sources.length, icon: Globe, sub: "uniques" },
                                                            { label: "Pages", value: siteStats.topPages.length, icon: ExternalLink, sub: "distinctes" },
                                                        ].map(({ label, value, icon: Icon, sub }) => (
                                                            <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">{label}</span>
                                                                    <Icon className="w-4 h-4 text-purple-300/60" />
                                                                </div>
                                                                <div className="text-2xl font-black text-white tracking-tight">{value}</div>
                                                                {sub && <div className="text-xs text-white/30 mt-0.5">{sub}</div>}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {/* Activité par jour */}
                                                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
                                                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-4">Activité par jour</h3>
                                                            <div className="space-y-2">
                                                                {siteStats.daily.length === 0 && <p className="text-xs text-white/30 font-mono py-4 text-center">Aucune donnée encore</p>}
                                                                {siteStats.daily.slice(0, 14).map((d) => (
                                                                    <div key={`${d.day}-${d.site}`} className="flex items-center gap-3">
                                                                        <span className="text-[10px] font-mono text-white/40 w-20 shrink-0">{d.day.slice(5)}</span>
                                                                        <div className="flex-1"><StatBar pct={(d.pageviews / maxPV) * 100} color="bg-purple-500/70" /></div>
                                                                        <span className="text-xs font-mono text-white/60 w-8 text-right">{d.pageviews}</span>
                                                                        {statsSite === "all" && <span className="text-[9px] text-white/30 font-mono w-12">{d.site}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Sources */}
                                                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
                                                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-4">D&apos;où viennent-ils</h3>
                                                            <div className="space-y-2.5">
                                                                {siteStats.sources.length === 0 && <p className="text-xs text-white/30 font-mono py-4 text-center">Aucune donnée encore</p>}
                                                                {siteStats.sources.map((s) => (
                                                                    <div key={s.referrer} className="flex items-center gap-3">
                                                                        <span className={`text-xs font-mono w-24 shrink-0 ${SOURCE_COLOR[s.referrer] || "text-white/50"}`}>{s.referrer}</span>
                                                                        <div className="flex-1"><StatBar pct={(s.visits / maxV) * 100} color="bg-indigo-500/60" /></div>
                                                                        <span className="text-xs font-mono text-white/60 w-8 text-right">{s.visits}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Top pages */}
                                                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
                                                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-4">Pages les plus vues</h3>
                                                            <div className="space-y-2.5">
                                                                {siteStats.topPages.length === 0 && <p className="text-xs text-white/30 font-mono py-4 text-center">Aucune donnée encore</p>}
                                                                {siteStats.topPages.map((p) => (
                                                                    <div key={p.page} className="flex items-center gap-3">
                                                                        <span className="text-[10px] font-mono text-white/50 flex-1 truncate">{p.page || "/"}</span>
                                                                        <div className="w-24 shrink-0"><StatBar pct={(p.views / maxVw) * 100} color="bg-emerald-500/60" /></div>
                                                                        <span className="text-xs font-mono text-white/60 w-8 text-right">{p.views}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Events + Appareils + Pays */}
                                                        <div className="space-y-4">
                                                            <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
                                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Events custom</h3>
                                                                {siteStats.events.length === 0 ? (
                                                                    <p className="text-xs text-white/30 font-mono text-center py-2">Aucun event encore</p>
                                                                ) : (
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {siteStats.events.map((e) => (
                                                                            <div key={e.event} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                                                                                <span className="text-[10px] font-mono text-white/60">{e.event}</span>
                                                                                <span className="text-[10px] font-mono text-purple-300">{e.count}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
                                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Appareils</h3>
                                                                <div className="flex gap-4 flex-wrap">
                                                                    {siteStats.devices.map((d) => {
                                                                        const Icon = d.device === "mobile" ? Smartphone : d.device === "tablet" ? Tablet : Monitor;
                                                                        return (
                                                                            <div key={d.device} className="flex items-center gap-2">
                                                                                <Icon className="w-3.5 h-3.5 text-white/40" />
                                                                                <span className="text-xs font-mono text-white/60">{d.device}</span>
                                                                                <span className="text-xs font-mono text-purple-300">{Math.round((d.count / totalDev) * 100)}%</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5">
                                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Pays</h3>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {siteStats.countries.length === 0 && <p className="text-xs text-white/30 font-mono">Aucune donnée encore</p>}
                                                                    {siteStats.countries.map((c) => (
                                                                        <div key={c.country} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                                                                            <span>{FLAG[c.country] || "🌐"}</span>
                                                                            <span className="text-[10px] font-mono text-white/60">{c.country}</span>
                                                                            <span className="text-[10px] font-mono text-purple-300">{c.visits}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Attribution Tab */}
                                {tab === "attribution" && (
                                    <div className="p-6 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-sm font-mono text-white/40 uppercase">Attribution partenaires</h2>
                                            <button
                                                onClick={fetchConversions}
                                                disabled={conversionsLoading}
                                                className="h-8 px-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${conversionsLoading ? "animate-spin" : ""}`} />
                                            </button>
                                        </div>

                                        {conversionsLoading && conversions.length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {/* Header */}
                                                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-mono text-white/30 uppercase">
                                                    <span>Partenaire</span>
                                                    <span className="w-28 text-center">Inscrits via le lien</span>
                                                    <span className="w-24 text-center">Abonnés actifs</span>
                                                    <span className="w-32 text-right">Revenu estimé</span>
                                                </div>

                                                {conversions.map((c) => (
                                                    <div
                                                        key={c.partner_slug}
                                                        className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                                                    >
                                                        <div className="min-w-0">
                                                            <code className="text-sm text-white/80 font-mono truncate">{c.partner_slug}</code>
                                                        </div>
                                                        <div className="w-28 flex justify-center">
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                                                                {c.total_users}
                                                            </span>
                                                        </div>
                                                        <div className="w-24 flex justify-center">
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                                                                {c.active_subscriptions}
                                                            </span>
                                                        </div>
                                                        <div className="w-32 text-right">
                                                            <span className="text-sm text-purple-400 font-medium">
                                                                ~{(c.active_subscriptions * 8.03).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/mois
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}

                                                {conversions.length === 0 && !conversionsLoading && (
                                                    <p className="text-center text-white/30 py-8 text-sm">Aucune conversion partenaire pour l&apos;instant — les ventes via les liens partenaires apparaîtront ici.</p>
                                                )}

                                                {conversions.length > 0 && (
                                                    <p className="text-xs text-white/25 pt-4 mt-2 border-t border-white/5">
                                                        Revenu estimé sur la base de 8,03 €/mois par abonné actif. Le montant exact (remises, taxes, abonnements annuels) est sur Stripe.
                                                    </p>
                                                )}
                                            </div>
                                        )}
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
