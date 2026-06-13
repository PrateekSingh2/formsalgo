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
        <span className="font-balsamiq text-2xl font-bold text-[#333333] group-hover:text-[#8B5CF6] transition-colors pr-8">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, type: "spring", stiffness: 300 }}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors border-2 border-[#333333] ${open ? "bg-[#8B5CF6] text-white" : "bg-[#FCFBF8] text-gray-500 group-hover:bg-[#E9D5FF] group-hover:text-[#8B5CF6]"}`}>
            <ChevronDown className="w-6 h-6 shrink-0" />
          </div>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="pb-8 text-gray-500 text-lg font-comic font-bold leading-relaxed max-w-3xl pr-12">{faq.a}</p>
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
    <section id="faq" className="py-40 px-6 bg-gradient-to-b from-[#F0FDF4] to-[#FCFBF8]" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-white text-[#333333] border-2 border-[#333333] rounded-full shadow-[2px_2px_0px_#333333] mb-6 flex items-center gap-2 transform rotate-1"
          >
            <MessageCircleQuestion className="w-5 h-5 text-[#F472B6]" />
            <span className="font-comic font-bold text-xl tracking-wide">FAQ</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="font-balsamiq text-5xl sm:text-6xl font-black text-[#333333] tracking-tight mb-6">
            Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#F472B6]">questions?</span>
          </motion.h2>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] border-2 border-[#333333] p-10 shadow-[8px_8px_0px_#8B5CF6] relative z-10">
          <div className="absolute -top-4 -right-4 w-12 h-12 text-5xl transform rotate-12">🤔</div>
          {faqs.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
        </motion.div>
      </div>
    </section>
  );
}
