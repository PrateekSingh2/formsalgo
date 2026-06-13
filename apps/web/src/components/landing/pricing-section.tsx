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
    <section id="pricing" className="py-40 px-6 bg-gradient-to-b from-[#FCFBF8] to-[#F0FDF4]" ref={ref}>
      <div className="max-w-[1300px] mx-auto flex flex-col items-center">
        
        <div className="text-center mb-24 flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-white border-2 border-[#333333] rounded-full shadow-[2px_2px_0px_#333333] mb-6 flex items-center gap-2 transform rotate-2"
          >
            <span className="font-comic font-bold text-xl tracking-wide text-green-500">Pricing</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-balsamiq text-5xl sm:text-6xl font-black text-[#333333] mb-6 tracking-tight relative"
          >
            Start free, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-[#8B5CF6]">grow unlimited.</span>
            <svg className="absolute -bottom-2 left-1/2 w-32 h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 15, 100 5" fill="none" stroke="#10B981" strokeWidth="3" />
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
              className={`relative rounded-[2.5rem] p-10 transition-all duration-500 flex flex-col border-2 border-[#333333] ${
                plan.highlighted 
                  ? "bg-[#333333] text-white shadow-[8px_8px_0px_#10B981] lg:scale-105 z-10" 
                  : "bg-white shadow-[4px_4px_0px_#333333]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-green-400 to-[#8B5CF6] text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-sm border-2 border-[#333333]">
                  <Sparkles className="w-4 h-4" /> Most Popular
                </div>
              )}
              
              <h3 className={`font-balsamiq text-4xl font-black tracking-tight mb-2 ${plan.highlighted ? "text-white" : "text-[#333333]"}`}>{plan.name}</h3>
              <p className={`text-base font-comic font-bold mb-8 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.tagline}</p>
              
              <div className="mb-10 pb-8 border-b-2 border-dashed border-gray-400">
                <span className={`font-balsamiq text-6xl font-black tracking-tighter ${plan.highlighted ? "text-white" : "text-[#333333]"}`}>{plan.price}</span>
                {plan.period && <span className={`text-lg font-comic font-bold ml-1 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.period}</span>}
              </div>
              
              <ul className="space-y-5 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-4">
                    <div className={`mt-1 p-1 rounded-full shrink-0 border-2 border-[#333333] ${plan.highlighted ? "bg-[#8B5CF6] text-white" : "bg-green-100 text-green-600"}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className={`text-base font-comic font-bold ${plan.highlighted ? "text-gray-200" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full mt-auto">
                <Link href="/signup" className={`block w-full text-center py-5 font-balsamiq font-bold text-lg rounded-2xl transition-all border-2 border-[#333333] ${
                  plan.highlighted 
                    ? "bg-white text-[#333333] hover:bg-green-50 shadow-[4px_4px_0px_#10B981]" 
                    : "bg-[#333333] text-white hover:bg-gray-800 shadow-[4px_4px_0px_#333333]"
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
