// ============================================================================
// NAVBAR — Floating glassmorphic navigation bar
// ============================================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#builder", label: "Builder" },
  { href: "#marketplace", label: "Marketplace" },
  { href: "#ai", label: "AI" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="mx-auto max-w-[1300px] bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl shadow-sm transform -rotate-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M12 11h4" />
              <path d="M12 15h4" />
              <path d="M8 11h.01" />
              <path d="M8 15h.01" />
              <path d="M12 7h.01" />
            </svg>
          </motion.div>
          <span className="font-balsamiq text-2xl font-black text-gray-900 tracking-tight">
            FormForge
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="font-sans px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#8B5CF6] hover:bg-white/50 rounded-xl transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Log in
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/signup"
              className="font-balsamiq px-5 py-2.5 bg-[#8B5CF6] text-white text-base font-bold rounded-xl hover:bg-[#7C3AED] transition-all shadow-sm inline-block transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl border-2 border-transparent hover:border-[#333333] hover:bg-white hover:shadow-[2px_2px_0px_#333333] transition-all"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mx-auto max-w-[1300px] mt-2 bg-white border border-gray-200 rounded-xl px-6 py-4 md:hidden shadow-sm"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setMobileOpen(false)}
                className="font-comic block py-3 text-gray-600 hover:text-gray-900 font-bold border-b border-gray-100 last:border-none"
              >
                {link.label}
              </motion.a>
            ))}
            <div className="flex gap-3 mt-4">
              <Link
                href="/login"
                className="font-comic flex-1 text-center py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="font-comic flex-1 text-center py-2.5 bg-gray-900 text-white text-sm font-bold border border-transparent shadow-sm rounded-lg hover:bg-gray-800 transition-all"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
