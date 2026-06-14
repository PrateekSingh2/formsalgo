"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter", tagline: "For personal projects", price: "Free", period: "",
    features: ["5 active forms", "100 responses / month", "10 standard field types", "Built-in theme library", "Standard QR codes", "Community support"],
    cta: "Start Free", highlighted: false,
  },
  {
    name: "Creator", tagline: "For serious builders", price: "$12", period: "/mo",
    features: ["Unlimited active forms", "Unlimited responses", "All 25+ advanced fields", "Theme Builder Studio", "Custom QR & Logic", "AI Generator Access", "Advanced Analytics", "Priority support", "Marketplace publishing"],
    cta: "Start 14-Day Trial", highlighted: true,
  },
  {
    name: "Team", tagline: "For organizations", price: "$39", period: "/mo",
    features: ["Everything in Creator", "Up to 5 team members", "Shared workspace", "Custom Brand Kits", "API & Webhook Access", "Custom domain routing", "Remove Formello branding", "Dedicated success manager"],
    cta: "Contact Sales", highlighted: false,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-32 px-6 bg-[#F8FAFC] relative overflow-hidden" ref={ref}>
      {/* Decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <svg className="absolute top-10 left-10 w-24 h-24 text-blue-200" viewBox="0 0 100 100" fill="none">
          <path d="M10 50 Q 50 10, 90 50 T 90 90 Q 50 90, 10 90 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
        <svg className="absolute bottom-10 right-10 w-32 h-32 text-indigo-200" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
        </svg>
      </div>
      <div className="max-w-[1300px] mx-auto flex flex-col items-center">
        
        <div className="text-center mb-24 flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-blue-50 border border-blue-200 rounded-full shadow-sm mb-6 flex items-center gap-2 transform rotate-1"
          >
            <span className="font-comic font-bold text-sm tracking-wide text-blue-600 uppercase">Pricing</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-balsamiq text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight relative"
          >
            Start free, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">grow unlimited.</span>
            <svg className="absolute -bottom-2 left-1/2 w-32 h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 15, 100 5" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-xl max-w-2xl text-gray-500 font-comic font-bold text-center"
          >
            No hidden fees. No credit card required to start. 
            Upgrade only when your audience explodes.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 w-full mx-auto items-end relative z-10">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }} whileHover={{ y: -10 }}
              className={`relative rounded-3xl p-10 transition-all duration-300 flex flex-col border ${
                plan.highlighted 
                  ? "bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-200 text-gray-900 shadow-md lg:scale-105 z-10" 
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}
              
              <h3 className={`font-balsamiq text-3xl font-black tracking-tight mb-2 ${plan.highlighted ? "text-blue-900" : "text-gray-900"}`}>{plan.name}</h3>
              <p className={`text-sm font-comic font-bold mb-8 ${plan.highlighted ? "text-blue-700" : "text-gray-500"}`}>{plan.tagline}</p>
              
              <div className="mb-8 pb-6 border-b border-gray-200">
                <span className={`font-balsamiq text-5xl font-black tracking-tighter ${plan.highlighted ? "text-blue-900" : "text-gray-900"}`}>{plan.price}</span>
                {plan.period && <span className={`text-base font-comic font-bold ml-1 ${plan.highlighted ? "text-blue-700" : "text-gray-500"}`}>{plan.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full shrink-0 ${plan.highlighted ? "bg-blue-200 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className={`text-sm font-comic font-bold ${plan.highlighted ? "text-blue-900" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full mt-auto">
                <Link href="/signup" className={`block w-full text-center py-4 font-balsamiq font-bold text-lg rounded-xl transition-all border ${
                  plan.highlighted 
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm" 
                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                }`}>
                  {plan.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
