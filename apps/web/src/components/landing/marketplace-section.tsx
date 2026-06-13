"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, Settings, FileText, Send, Bell, Database, Sparkles } from "lucide-react";

export function MarketplaceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="marketplace" className="py-32 px-6 bg-[#F5F3FF] relative overflow-hidden" ref={ref}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-balsamiq text-5xl font-bold text-[#333333] mb-4"
          >
            A universe of <span className="text-[#8B5CF6] relative inline-block">
              possibilities
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 -5, 100 5" fill="none" stroke="#F472B6" strokeWidth="3" />
              </svg>
            </span>
          </motion.h2>
          <p className="font-comic text-xl text-gray-600 max-w-2xl mx-auto font-bold">Themes, automations, and a thriving community to help you build faster.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Community Forms (Floating Cards) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative min-h-[400px]"
          >
            <div className="bg-white p-8 rounded-[2rem] border-2 border-[#333333] shadow-[8px_8px_0px_#8B5CF6] relative z-10">
              <h3 className="font-balsamiq text-3xl font-bold text-[#333333] mb-2">Explore Community Forms</h3>
              <p className="font-comic text-gray-500 font-bold mb-8">Don't start from scratch. Use forms created by top creators.</p>
              
              <div className="relative h-[200px]">
                {/* Form Card 1 */}
                <div className="absolute top-0 left-0 bg-[#FFF5F5] border-2 border-[#333333] rounded-xl p-4 w-48 transform -rotate-6 shadow-sm z-20 hover:rotate-0 hover:scale-105 transition-all cursor-pointer">
                  <div className="washi-tape -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-red-300" style={{ transform: 'rotate(2deg)' }}></div>
                  <div className="text-3xl mb-2">🍪</div>
                  <h4 className="font-balsamiq font-bold text-[#333333] text-sm">Anime Fan Survey</h4>
                  <div className="flex items-center gap-1 mt-2 text-xs font-comic font-bold text-gray-500">
                    <Star className="w-3 h-3 text-orange-400 fill-current" /> 4.8 (341)
                  </div>
                </div>

                {/* Form Card 2 */}
                <div className="absolute top-10 left-32 bg-[#F0FDF4] border-2 border-[#333333] rounded-xl p-4 w-48 transform rotate-3 shadow-sm z-10 hover:rotate-6 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-3xl mb-2">🚀</div>
                  <h4 className="font-balsamiq font-bold text-[#333333] text-sm">Startup Onboarding</h4>
                  <div className="flex items-center gap-1 mt-2 text-xs font-comic font-bold text-gray-500">
                    <Star className="w-3 h-3 text-orange-400 fill-current" /> 4.9 (363)
                  </div>
                </div>
              </div>

              <button className="mt-4 font-balsamiq font-bold text-[#8B5CF6] flex items-center gap-2 hover:gap-3 transition-all">
                Browse Gallery <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Themes & Automations Stack */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Themes Scrapbook */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#FDF9F1] p-8 rounded-[2rem] border-2 border-[#333333] shadow-[8px_8px_0px_#F472B6] relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 text-[10rem] opacity-5">🎨</div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-balsamiq text-3xl font-bold text-[#333333] mb-2">Beautiful Themes</h3>
                  <p className="font-comic text-gray-500 font-bold">Match your brand's exact vibe in seconds.</p>
                </div>
                <button className="bg-white border-2 border-[#333333] p-3 rounded-xl shadow-[2px_2px_0px_#333333] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <ArrowRight className="w-5 h-5 text-[#333333]" />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                {['Cyber Punk', 'Notebook', 'Pastel', 'Minimal', 'Sketch'].map((theme, i) => (
                  <div key={i} className={`px-4 py-2 border-2 border-[#333333] rounded-full font-balsamiq font-bold text-sm transform hover:scale-110 transition-transform cursor-pointer
                    ${i % 2 === 0 ? 'bg-white text-[#333333] rotate-2' : 'bg-[#333333] text-white -rotate-2'}
                  `}>
                    {theme}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Automations Ribbon */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-[2rem] border-2 border-[#333333] shadow-[8px_8px_0px_#34D399] relative"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="md:w-1/3 text-center md:text-left">
                  <h3 className="font-balsamiq text-2xl font-bold text-[#333333] mb-2">Power Automations</h3>
                  <p className="font-comic text-gray-500 font-bold text-sm">We handle the boring stuff automatically.</p>
                </div>
                
                <div className="md:w-2/3 flex items-center justify-center gap-2 flex-wrap">
                  {[
                    { icon: FileText, label: "Submit", color: "text-gray-500", bg: "bg-gray-100" },
                    { icon: ArrowRight, label: "", color: "text-gray-300", bg: "bg-transparent border-none" },
                    { icon: Settings, label: "Process", color: "text-green-500", bg: "bg-green-100" },
                    { icon: ArrowRight, label: "", color: "text-gray-300", bg: "bg-transparent border-none" },
                    { icon: Send, label: "Email", color: "text-blue-500", bg: "bg-blue-100" },
                    { icon: ArrowRight, label: "", color: "text-gray-300", bg: "bg-transparent border-none" },
                    { icon: Database, label: "Save", color: "text-purple-500", bg: "bg-purple-100" },
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.bg} ${step.bg === 'bg-transparent border-none' ? '' : 'border-2 border-[#333333]'}`}>
                        <step.icon className={`w-5 h-5 ${step.color}`} />
                      </div>
                      {step.label && <span className="font-comic font-bold text-[10px] text-gray-500">{step.label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
