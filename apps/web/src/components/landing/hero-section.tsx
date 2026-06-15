"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Pencil, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-gray-50" id="hero">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-emerald-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
        
        {/* Pencil sketch lines */}
        <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-[5%] opacity-80">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
            <path d="M10 50 Q 30 10, 50 50 T 90 50" strokeDasharray="6 6" />
            <path d="M10 55 Q 32 15, 48 55 T 88 55" />
            <circle cx="20" cy="30" r="4" fill="#F472B6" />
            <circle cx="80" cy="70" r="6" fill="#F472B6" stroke="none" />
          </svg>
        </motion.div>
        
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-32 right-[10%] opacity-80">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
            <circle cx="50" cy="50" r="40" strokeDasharray="6 6" />
            <path d="M30 50 L70 50 M50 30 L50 70" />
            <path d="M40 40 L60 60 M40 60 L60 40" />
          </svg>
        </motion.div>

        <motion.div animate={{ x: [-10, 10, -10], rotate: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-40 right-[15%] opacity-90">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="#FEF3C7" />
          </svg>
        </motion.div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
        
        {/* Floating Avatars / Community */}
        <div className="absolute top-[20%] -left-12 lg:-left-24 transform -translate-y-1/2 flex flex-col gap-6 opacity-90 hidden md:flex z-20">
          <motion.div animate={{ y: [0, -10, 0], rotate: [-10, 5, -10] }} transition={{ duration: 4, repeat: Infinity }} className="w-16 h-16 bg-[#FCE7F3] rounded-full border-4 border-white flex items-center justify-center text-3xl shadow-md">👩🏻‍🎨</motion.div>
          <motion.div animate={{ y: [0, 10, 0], rotate: [10, -5, 10] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="w-12 h-12 bg-[#DBEAFE] rounded-full border-4 border-white flex items-center justify-center text-xl shadow-md ml-10">👨🏽‍💻</motion.div>
        </div>

        <div className="absolute top-[30%] -right-12 lg:-right-24 transform -translate-y-1/2 flex flex-col gap-6 opacity-90 hidden md:flex z-20">
          <motion.div animate={{ y: [0, -15, 0], rotate: [15, -5, 15] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }} className="w-16 h-16 bg-[#D1FAE5] rounded-full border-4 border-white flex items-center justify-center text-3xl shadow-md ml-4">🦸🏻‍♀️</motion.div>
          <motion.div animate={{ y: [0, 12, 0], rotate: [-15, 5, -15] }} transition={{ duration: 5.5, repeat: Infinity, delay: 1.5 }} className="w-14 h-14 bg-[#FEF3C7] rounded-full border-4 border-white flex items-center justify-center text-2xl shadow-md mr-12">🥷🏼</motion.div>
        </div>
        
        {/* Playful Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-md border border-amber-200 rounded-2xl mb-8 shadow-sm transform -rotate-2"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="font-balsamiq font-bold text-amber-800 text-sm tracking-wide">Building forms shouldn't be boring</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-balsamiq text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight relative"
        >
          Everything you need, <br />
          <span className="relative inline-block mt-2">
            in one simple workspace
            <svg className="absolute -bottom-3 left-0 w-full h-5" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8C50 2 150 2 195 8" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 6" />
              <path d="M5 10C50 4 150 4 195 10" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          {/* Headline Sparkles */}
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-6 -right-10 text-4xl hidden sm:block">✨</motion.div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Create, customize and share forms that get responses. All the tools you need, all in one place.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link href="/builder" className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#8B5CF6] text-white font-balsamiq font-bold text-xl rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-[#7c3aed] transition-all">
            <span>Try the Builder</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="relative mt-4 sm:mt-0 ml-0 sm:ml-6 flex items-center">
            <svg className="absolute -left-12 sm:-left-16 w-12 h-12 text-[#10B981] transform -rotate-12 z-0 pointer-events-none" fill="none" viewBox="0 0 50 50" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M40 10 C 20 20, 10 30, 10 40 M10 40 L 15 30 M10 40 L 20 42" strokeDasharray="3 3" />
            </svg>
            <span className="font-balsamiq relative z-10 inline-block px-4 py-2 font-bold text-emerald-700 text-sm border border-emerald-200 bg-white/80 backdrop-blur-md shadow-sm rounded-xl transform rotate-2">It's completely free!</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
