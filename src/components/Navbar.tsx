"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlightStore } from "@/stores/useFlightStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
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

  const navItems: { name: string; href: string; onClick?: (e: React.MouseEvent) => void }[] = [
    { name: "Monteurs", href: "/monteurs" },
    { name: "Cr\u00e9ateurs", href: "/createurs" },
    { name: "Tarifs", href: "/pricing" },
    { name: "Affili\u00e9", href: "/ambassador" },
    { name: "Mon compte", href: "/account" },
  ];

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
        <Link href="/" className="flex items-center gap-2 group z-10">
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
            href="/pricing"
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-200"
          >
            S&apos;abonner
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
        </motion.div>
      )}
    </motion.nav>
  );
}
