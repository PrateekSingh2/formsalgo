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
    <section id="ai" className="py-40 px-6 bg-cream paper-texture" ref={ref}>
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
        
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-amber-100 text-amber-600 border border-amber-200 rounded-full shadow-sm mb-6 flex items-center gap-2 sketch-border"
          >
            <Brain className="w-5 h-5" />
            <span className="font-handwriting text-xl tracking-wide">Powered by Intelligence</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl font-black mb-6 tracking-tight text-heading"
          >
            AI that <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">understands</span> forms.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl text-body font-medium text-center"
          >
            From generating complete forms to critiquing your UX — our AI doesn&apos;t just help, it transforms your workflow.
          </motion.p>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Demo */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl border-2 border-border shadow-heavy overflow-hidden sketch-border">
            <div className="p-8 border-b-2 border-dashed border-border bg-cream/50">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-handwriting text-xl font-bold text-muted">AI Prompt</span>
              </div>
              <div className="font-display text-2xl text-heading min-h-[60px] tracking-tight">
                {isInView && <TypewriterText text={aiPrompt} delay={500} />}
              </div>
            </div>
            <div className="p-8 bg-white paper-texture">
              <div className="flex items-center gap-2 mb-6">
                <Wand2 className="w-5 h-5 text-green" />
                <span className="font-handwriting text-xl font-bold text-muted">Generated Output</span>
              </div>
              <div className="space-y-4 relative z-10">
                {aiResult.map((field, i) => (
                  <motion.div key={field.field} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 3 + i * 0.15 }}
                    className="flex items-center justify-between py-4 px-5 rounded-2xl bg-white border-2 border-border shadow-sm sketch-border">
                    <span className="text-base font-bold text-heading">{field.field}</span>
                    <span className="font-handwriting text-lg text-amber-600 bg-amber-100 px-4 py-1 rounded-xl tracking-wide sketch-border">{field.type}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <div className="space-y-6">
            {aiFeatures.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                whileHover={{ x: -6, scale: 1.02 }}
                className="bg-white rounded-[2rem] p-8 border-2 border-border flex gap-6 items-start group cursor-default transition-all shadow-card sketch-border">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${feature.bg} sketch-border group-hover:rotate-6 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-heading mb-2">{feature.title}</h4>
                  <p className="text-base text-body font-medium leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
