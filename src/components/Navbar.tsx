"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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
    setPhase('launching');
    
    setTimeout(() => {
      setPhase('warping');
      setTimeout(() => {
        router.push('/expedition');
      }, 1500);
    }, 1000);
  };

  const navItems: { name: string; href: string; onClick?: (e: React.MouseEvent) => void }[] = [
    { name: "Accueil", href: "/" },
    { name: "L'Expédition", href: "/expedition", onClick: handleExpeditionClick },
    { name: "Outils", href: "/tools" },
    { name: "Tarifs", href: "/pricing" },
    { name: "Discord", href: "/#discord" },
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
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-white z-10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
