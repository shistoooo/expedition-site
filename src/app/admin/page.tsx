"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock, Mail, KeyRound, AlertCircle, Loader2, ChevronLeft,
    Users, Shield, CheckCircle2, XCircle, Search, ToggleLeft, ToggleRight,
    UserCheck, UserX, RefreshCw, FileText, Link2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
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
}

interface AmbassadorApplication {
    id: string;
    name: string;
    contact: string;
    channels: string[];
    link?: string;
    created_at: string;
}

type Step = "login" | "admin";
type Tab = "users" | "ambassadors" | "applications";

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

    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    useEffect(() => {
        if (step === "admin" && tab === "users") fetchUsers();
    }, [step, tab, fetchUsers]);

    useEffect(() => {
        if (step === "admin" && tab === "ambassadors") fetchAmbassadors();
    }, [step, tab, fetchAmbassadors]);

    useEffect(() => {
        if (step === "admin" && tab === "applications") fetchApplications();
    }, [step, tab, fetchApplications]);

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
        <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
            <PageBackground />
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
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-white/25 font-mono">{amb.referral_code}</span>
                                                                {statusBadge(amb.status)}
                                                                <span className="text-xs text-white/20">{new Date(amb.created_at).toLocaleDateString("fr-FR")}</span>
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
