"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, Settings, FileText, Send, Bell, Database, Sparkles, Palette } from "lucide-react";

export function MarketplaceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="marketplace" className="py-32 px-6 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[10%] right-[-20%] w-[40%] h-[40%] bg-rose-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[20%] left-[30%] w-[30%] h-[30%] bg-cyan-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-balsamiq text-4xl sm:text-5xl font-black text-gray-900 mb-6"
          >
            Endless <span className="inline-block px-4 py-1 bg-[#FEF3C7] border-2 border-yellow-300 rounded-2xl transform -rotate-2">
              possibilities
            </span>
          </motion.h2>
          <p className="font-sans text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed bg-white/60 backdrop-blur-md border border-white/50 shadow-sm p-4 rounded-xl">Themes, automations, and a thriving community to help you build faster.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* LEFT: Community Forms (Floating Cards) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50 shadow-sm relative z-10 h-full flex flex-col items-center text-center group hover:border-rose-200 transition-colors">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3 border border-rose-100 group-hover:-rotate-6 transition-transform">
                <FileText className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-balsamiq text-3xl font-black text-gray-900 mb-3">Community Forms</h3>
              <p className="font-sans text-gray-600 mb-12 max-w-sm">Don't start from scratch. Clone top-performing forms created by expert builders.</p>
              
              <div className="relative h-[260px] w-full max-w-xs mt-auto">
                {/* Form Card 1 */}
                <div className="absolute top-0 left-0 bg-[#FFF1F2] border border-rose-200 rounded-3xl p-6 w-56 transform -rotate-6 shadow-sm z-20 hover:rotate-0 hover:scale-105 hover:shadow-md transition-all cursor-pointer">
                  <div className="text-4xl mb-4">🍪</div>
                  <h4 className="font-balsamiq font-black text-rose-900 text-lg mb-1">Anime Fan Survey</h4>
                  <div className="flex items-center gap-1 mt-2 text-sm font-sans font-bold text-rose-700">
                    <Star className="w-4 h-4 text-orange-400 fill-current" /> 4.8 (341)
                  </div>
                </div>

                {/* Form Card 2 */}
                <div className="absolute top-16 right-0 bg-[#F0FDF4] border border-green-200 rounded-3xl p-6 w-56 transform rotate-6 shadow-sm z-10 hover:rotate-12 hover:scale-105 hover:shadow-md transition-all cursor-pointer">
                  <div className="text-4xl mb-4">🚀</div>
                  <h4 className="font-balsamiq font-black text-green-900 text-lg mb-1">Startup Onboarding</h4>
                  <div className="flex items-center gap-1 mt-2 text-sm font-comic font-bold text-green-700">
                    <Star className="w-4 h-4 text-orange-400 fill-current" /> 4.9 (363)
                  </div>
                </div>
              </div>

              <button className="mt-12 font-balsamiq font-black text-rose-600 bg-rose-50 border border-rose-200 px-8 py-4 rounded-2xl flex items-center gap-2 hover:gap-3 hover:-translate-y-1 hover:bg-rose-100 transition-all shadow-sm">
                Browse Gallery <ArrowRight className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Themes Scrapbook */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#FEF3C7] p-10 rounded-[2.5rem] border border-yellow-200 shadow-sm relative overflow-hidden h-full flex flex-col items-center text-center group hover:shadow-md transition-all">
              <div className="absolute -right-10 -top-10 text-[10rem] opacity-30 transform rotate-12 filter blur-[2px] group-hover:rotate-45 transition-transform duration-700">🎨</div>
              
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 transform rotate-3 border border-yellow-300 relative z-10 group-hover:rotate-6 transition-transform">
                <Palette className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-balsamiq text-3xl font-black text-gray-900 mb-3 relative z-10">Beautiful Themes</h3>
              <p className="font-comic text-gray-700 font-bold max-w-sm mb-12 relative z-10">Match your brand's exact vibe in seconds. Choose from presets or build your own.</p>

              <div className="flex flex-wrap justify-center gap-4 mt-auto mb-12 relative z-10 max-w-md">
                {['Cyber Punk', 'Notebook', 'Pastel', 'Minimal', 'Sketch', 'Glassmorphism'].map((theme, i) => (
                  <div key={i} className={`px-5 py-2.5 border border-gray-200 rounded-full font-balsamiq font-black text-sm transform hover:scale-110 shadow-sm transition-transform cursor-pointer
                    ${i % 2 === 0 ? 'bg-white text-gray-800 rotate-2 hover:rotate-6' : 'bg-gray-800 text-white -rotate-2 hover:-rotate-6'}
                  `}>
                    {theme}
                  </div>
                ))}
              </div>
              
              <button className="mt-auto font-balsamiq font-black text-yellow-900 bg-yellow-300 border border-yellow-400 px-8 py-4 rounded-2xl flex items-center gap-2 hover:gap-3 hover:-translate-y-1 hover:bg-yellow-400 transition-all relative z-10 shadow-sm">
                Explore Themes <ArrowRight className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
