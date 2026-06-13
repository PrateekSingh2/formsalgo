"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Pencil, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#FCFBF8]" id="hero">
      
      {/* Hand-drawn decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-32 left-[10%] opacity-40">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M10 30 L30 10" />
          </svg>
        </motion.div>
        
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-40 right-[15%] opacity-40">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20 Q 20 5, 35 20 T 55 20" />
          </svg>
        </motion.div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
        
        {/* Playful Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-gray-200 rounded-full mb-8 sticker-card"
        >
          <span className="text-xl">✨</span>
          <span className="font-comic font-bold text-gray-600 text-sm">Building forms shouldn't be boring</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-balsamiq text-6xl sm:text-7xl lg:text-8xl text-[#333333] mb-8 leading-[1.1]"
        >
          Everything you need, <br />
          <span className="relative inline-block">
            in one simple workspace
            <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8C50 2 150 2 195 8" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="inline-block ml-4 text-4xl transform rotate-12 bg-[#D1FAE5] rounded-full w-12 h-12 flex items-center justify-center align-middle border-2 border-[#333333]">
            <Pencil className="w-6 h-6 text-[#10B981]" />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-comic font-medium leading-relaxed"
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
          <Link href="/builder" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#8B5CF6] text-white font-balsamiq text-xl rounded-xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all">
            <span>Try the Builder</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="relative">
            <svg className="absolute -left-12 top-4 w-10 h-10 text-[#8B5CF6] transform -rotate-12 animate-wiggle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="inline-block px-4 py-3 font-comic font-bold text-gray-500 text-lg">It's completely free!</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
