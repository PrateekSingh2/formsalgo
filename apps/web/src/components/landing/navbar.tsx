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
      <nav className="mx-auto max-w-[1300px] bg-[#FCFBF8] border-2 border-[#333333] rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-[4px_4px_0px_#333333]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-9 h-9 rounded-xl bg-[#8B5CF6] border-2 border-[#333333] flex items-center justify-center shadow-[2px_2px_0px_#333333]"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-balsamiq text-2xl font-bold text-[#333333] tracking-tight">
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
              className="px-4 py-2 text-sm font-comic font-bold text-gray-500 hover:text-[#8B5CF6] rounded-xl hover:bg-[#E9D5FF] transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-comic font-bold text-gray-500 hover:text-[#333333] transition-colors"
          >
            Log in
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-[#8B5CF6] text-white text-sm font-comic font-bold rounded-xl border-2 border-[#333333] hover:bg-[#7C3AED] transition-colors shadow-[2px_2px_0px_#333333] inline-block"
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
            className="mx-auto max-w-[1300px] mt-2 bg-[#FCFBF8] border-2 border-[#333333] rounded-2xl px-6 py-4 md:hidden shadow-[4px_4px_0px_#333333]"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-gray-500 hover:text-[#8B5CF6] font-comic font-bold border-b-2 border-dashed border-gray-200 last:border-none"
              >
                {link.label}
              </motion.a>
            ))}
            <div className="flex gap-3 mt-4">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-sm font-comic font-bold text-gray-500 border-2 border-[#333333] rounded-xl hover:bg-white hover:shadow-[2px_2px_0px_#333333] transition-all"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex-1 text-center py-2.5 bg-[#8B5CF6] text-white text-sm font-comic font-bold border-2 border-[#333333] shadow-[2px_2px_0px_#333333] rounded-xl hover:bg-[#7C3AED] transition-colors"
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
