"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlightStore } from "@/stores/useFlightStore";
import { useTubeForgeOnly } from "@/lib/useTubeForgeOnly";
import { ACCUEIL_TUBEFORGE } from "@/lib/tubeforgeOnly";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  // Sur la partie TubeForge, le CTA reste dans SON funnel (essai ember) au lieu
  // de renvoyer vers le flow générique violet — cohérence DA + parcours.
  // Le DOMAINE compte autant que le chemin : sur tubeforge.explauncheur.space,
  // toutes les pages sont en mode TubeForge, pas seulement /tubeforge/*.
  const isTubeForge = useTubeForgeOnly();
  const trialHref = isTubeForge ? "/tubeforge/checkout?plan=sub&months=12" : "/account?mode=register";
  const trialLabel = isTubeForge ? "14 jours gratuits" : "3 jours gratuits";
  const setPhase = useFlightStore((state) => state.setPhase);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleExpeditionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPhase('warping');
    setTimeout(() => {
      router.push('/expedition');
    }, 2000);
  };

  // Sur le funnel TubeForge (landing d\u00e9di\u00e9e = tunnel de conversion), on retire
  // les liens qui font SORTIR vers les autres personas/tarifs de la suite \u2014
  // seul \u00ab Mon compte \u00bb reste (connexion pour les users existants).
  const allNavItems: { name: string; href: string; onClick?: (e: React.MouseEvent) => void }[] = [
    { name: "Monteurs", href: "/monteurs" },
    { name: "Cr\u00e9ateurs", href: "/createurs" },
    { name: "Tarifs", href: "/pricing" },
    { name: "Mon compte", href: "/account" },
  ];
  const navItems = isTubeForge
    ? allNavItems.filter((i) => i.name === "Mon compte")
    : allNavItems;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container-main flex items-center justify-between relative">
        <Link href={isTubeForge ? ACCUEIL_TUBEFORGE : "/"} className="flex items-center gap-2 group z-10">
          <motion.span
            className="text-xl font-bold tracking-wider text-white group-hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.02 }}
          >
            EXPÉDITION
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-6 z-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={item.onClick}
              className={`text-sm font-medium transition-colors px-2 py-1 rounded-lg ${
                item.name === "Essayer"
                  ? "text-red-400/90 hover:text-red-300 hover:bg-red-500/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href={trialHref}
            className={`group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-200 ${isTubeForge ? "hover:brightness-110" : "bg-purple-600 hover:bg-purple-500"}`}
            style={isTubeForge ? { background: "linear-gradient(135deg,#ff6a1f,#ef3a24)" } : undefined}
          >
            {trialLabel}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          className="md:hidden text-white z-10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass mt-4 mx-6 rounded-2xl p-6"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-3 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href={trialHref}
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-3 block text-center py-3 rounded-xl text-white font-semibold"
            style={isTubeForge ? { background: "linear-gradient(135deg,#ff6a1f,#ef3a24)" } : { background: "#9333ea" }}
          >
            {trialLabel}
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
