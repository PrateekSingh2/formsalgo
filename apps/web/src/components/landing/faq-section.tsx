"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  { q: "Is FormForge really free to start?", a: "Yes! Our Starter plan is completely free with up to 5 forms and 100 responses per month. No credit card required. Upgrade whenever you need to scale." },
  { q: "Can I use my own fonts and colors?", a: "Absolutely. The Theme Studio gives you full control over typography, colors, spacing, textures, animations, and more. Make it match your brand perfectly." },
  { q: "How does AI form generation work?", a: "Simply describe what you need in plain English — like 'event registration form' — and our AI generates the fields, validation rules, theme suggestions, and even a success page instantly." },
  { q: "Can I sell my themes on the marketplace?", a: "Yes! Creator and Team plan users can publish themes to the marketplace. Set your own price, get reviews, and earn from your design skills." },
  { q: "What about data privacy and security?", a: "All data is encrypted at rest and in transit. We use enterprise-grade PostgreSQL with row-level security. You own your data and can export it at any time." },
  { q: "Does it work well on mobile devices?", a: "All forms are fully responsive by default. We even support swipeable 'Form Stories' for an Instagram-like mobile experience that increases conversion." },
];

function FaqItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      className="border-b-2 border-dashed border-gray-200 last:border-none">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-6 text-left group">
        <span className="font-balsamiq text-2xl font-black text-gray-900 group-hover:text-pink-600 transition-colors pr-8">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, type: "spring", stiffness: 300 }}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border border-gray-200 ${open ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-500 group-hover:bg-pink-50 group-hover:text-pink-600 group-hover:border-pink-200"}`}>
            <ChevronDown className="w-5 h-5 shrink-0" />
          </div>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="pb-8 text-gray-600 text-lg font-comic font-bold leading-relaxed max-w-3xl pr-12">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="py-32 px-6 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-sky-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] bg-lime-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-pink-50 text-pink-800 border border-pink-200 rounded-full shadow-sm mb-6 flex items-center gap-2 transform -rotate-1"
          >
            <MessageCircleQuestion className="w-4 h-4 text-pink-500" />
            <span className="font-comic font-bold text-sm tracking-wide">FAQ</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="font-balsamiq text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">questions?</span>
          </motion.h2>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-sm relative z-10">
          <div className="absolute -top-4 -right-4 w-12 h-12 text-5xl transform rotate-12 opacity-80 filter blur-[1px]">🤔</div>
          {faqs.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
        </motion.div>
      </div>
    </section>
  );
}
