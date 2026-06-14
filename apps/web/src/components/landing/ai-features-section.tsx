"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sparkles, Wand2, Palette as PaletteIcon, MessageSquare, Brain } from "lucide-react";

const aiPrompt = "Create a registration form for a weekend music festival";
const aiResult = [
  { field: "Full Name", type: "Short Text" },
  { field: "Email", type: "Email" },
  { field: "Phone Number", type: "Phone" },
  { field: "Which days are you attending?", type: "Checkbox" },
  { field: "T-shirt Size", type: "Dropdown" },
];

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
          className="inline-block w-[3px] h-6 bg-amber-500 ml-1 align-middle rounded-full" />
      )}
    </span>
  );
}

const aiFeatures = [
  { icon: Wand2, title: "AI Form Generator", description: "Describe what you need in plain English. AI builds the entire form.", color: "text-amber-500", bg: "bg-amber-100" },
  { icon: PaletteIcon, title: "AI Theme Generator", description: '"Cyberpunk gaming tournament" → matching theme instantly.', color: "text-amber-500", bg: "bg-amber-100" },
  { icon: MessageSquare, title: "AI Form Critic", description: "Get scores on clarity, UX, readability, and conversion.", color: "text-amber-500", bg: "bg-amber-100" },
];

export function AiFeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ai" className="py-32 px-6 bg-[#FAF5FF] relative overflow-hidden" ref={ref}>
      {/* Decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <motion.svg 
          animate={{ rotate: 360 }} 
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 text-purple-200" viewBox="0 0 100 100" fill="none"
        >
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </motion.svg>
        <motion.svg 
          animate={{ y: [0, -20, 0], rotate: [-10, 10, -10] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-40 h-40 text-pink-200" viewBox="0 0 100 100" fill="none"
        >
          <path d="M10 90 L50 10 L90 90 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </motion.svg>
      </div>
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center relative z-10">
        
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-white border-2 border-purple-200 rounded-2xl shadow-sm mb-6 flex items-center gap-2 transform -rotate-2"
          >
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="font-comic font-bold text-purple-900 tracking-wide uppercase text-sm">Powered by Intelligence</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-balsamiq text-4xl sm:text-6xl font-black mb-6 tracking-tight text-gray-900 leading-tight"
          >
            AI that <span className="inline-block px-4 py-1 bg-[#F3E8FF] border-2 border-purple-300 rounded-2xl transform rotate-2">understands</span> forms.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl text-gray-600 font-comic font-bold text-center"
          >
            From generating complete forms to critiquing your UX — our AI doesn't just help, it transforms your workflow.
          </motion.p>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Demo */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden transform -rotate-1">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="font-comic font-bold text-sm text-gray-500 uppercase tracking-wide">AI Prompt</span>
              </div>
              <div className="font-balsamiq font-bold text-2xl text-gray-800 min-h-[60px] tracking-tight">
                {isInView && <TypewriterText text={aiPrompt} delay={500} />}
              </div>
            </div>
            <div className="p-8 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <Wand2 className="w-5 h-5 text-emerald-500" />
                <span className="font-comic font-bold text-sm text-gray-500 uppercase tracking-wide">Generated Output</span>
              </div>
              <div className="space-y-4 relative z-10 min-h-[300px]">
                {/* Generating Loading State */}
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={isInView ? { opacity: [0, 1, 0] } : {}} 
                  transition={{ delay: 2, duration: 1.5, times: [0, 0.2, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full mb-4" />
                  <span className="font-comic font-bold text-gray-400">AI is thinking...</span>
                </motion.div>

                {aiResult.map((field, i) => (
                  <motion.div key={field.field} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: 3.5 + i * 0.15, type: "spring", stiffness: 100 }}
                    className="flex items-center justify-between py-4 px-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all cursor-default">
                    <span className="text-sm font-balsamiq font-bold text-gray-800">{field.field}</span>
                    <span className="font-comic text-xs text-purple-700 font-bold bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">{field.type}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <div className="space-y-6">
            {aiFeatures.map((feature, i) => (
              <motion.div key={feature.title} 
                initial={{ opacity: 0, x: 40 }} 
                animate={isInView ? { opacity: 1, x: 0, y: [0, -5, 0] } : {}} 
                transition={{ 
                  opacity: { duration: 0.5, delay: 0.4 + i * 0.1 },
                  x: { duration: 0.5, delay: 0.4 + i * 0.1 },
                  y: { repeat: Infinity, duration: 4, delay: i * 0.5, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 border border-gray-200 flex gap-5 items-start group cursor-default transition-all shadow-sm rotate-1 hover:rotate-0 hover:shadow-md hover:border-amber-200">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${feature.bg} border border-amber-200 shadow-sm group-hover:-rotate-6 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color} stroke-[1.5]`} />
                </div>
                <div>
                  <h4 className="font-balsamiq text-xl font-black text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600 font-comic font-bold leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
