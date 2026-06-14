"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MousePointerClick, Sparkles, Palette, QrCode, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: MousePointerClick, title: "Drag & Drop Magic", color: "text-purple-500", bg: "bg-purple-100", borderHover: "hover:border-purple-300", tape: "bg-purple-200", rotation: "-rotate-1",
    description: "Build forms as naturally as arranging sticky notes on a whiteboard. Real-time updates with zero lag.",
  },
  {
    icon: Sparkles, title: "AI Generation", color: "text-pink-500", bg: "bg-pink-100", borderHover: "hover:border-pink-300", tape: "bg-pink-200", rotation: "rotate-2",
    description: "Describe your form in plain English. Our AI generates the fields, themes, and logic instantly.",
  },
  {
    icon: Palette, title: "Theme Studio", color: "text-amber-500", bg: "bg-amber-100", borderHover: "hover:border-amber-300", tape: "bg-amber-200", rotation: "-rotate-2",
    description: "Full creative control. Apply notebook, sketch, or glass styles. Use any Google Font.",
  },
  {
    icon: QrCode, title: "Smart QR Codes", color: "text-green-500", bg: "bg-green-100", borderHover: "hover:border-green-300", tape: "bg-green-200", rotation: "rotate-1",
    description: "Every form gets an instant, customizable QR code. Choose presets like Neon or Sketch.",
  },
  {
    icon: BarChart3, title: "Rich Analytics", color: "text-blue-500", bg: "bg-blue-100", borderHover: "hover:border-blue-300", tape: "bg-blue-200", rotation: "-rotate-1",
    description: "Beautiful dashboards showing views, completion rates, drop-offs, and device stats.",
  },
  {
    icon: Shield, title: "Marketplace", color: "text-indigo-500", bg: "bg-indigo-100", borderHover: "hover:border-indigo-300", tape: "bg-indigo-200", rotation: "rotate-2",
    description: "Share your themes. Browse trending creations, fork designs, and monetize your work.",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 px-6 bg-[#F0FDF4] relative overflow-hidden" ref={ref}>
      {/* Subtle sketch grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(#86EFAC 1px, transparent 1px), linear-gradient(90deg, #86EFAC 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-[#FCE7F3] border-2 border-pink-300 rounded-full shadow-sm mb-6 flex items-center gap-2 transform rotate-2"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="font-comic font-bold text-sm text-pink-800 tracking-wide uppercase">Everything you need</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-balsamiq text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight relative leading-tight"
          >
            Powerful tools, <br className="sm:hidden" />
            <span className="relative inline-block text-gray-900">
              playful design.
              <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 -2, 100 5" fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl text-gray-700 font-comic font-bold"
          >
            Create, customize, publish, and analyze forms without writing a single line of code.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm transition-all duration-300 group flex flex-col items-center text-center relative transform ${feature.rotation} hover:rotate-0 ${feature.borderHover} hover:shadow-xl`}
            >
              {/* Cute Washi Tape */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${feature.tape} opacity-80 transform rotate-2 z-10 shadow-sm`} style={{ clipPath: 'polygon(0% 10%, 100% 0%, 95% 90%, 5% 100%)' }}></div>

              <div className={`w-20 h-20 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 border-white shadow-md relative z-0`}>
                <feature.icon className={`w-10 h-10 ${feature.color} stroke-[2]`} />
              </div>
              <h3 className="font-balsamiq text-2xl font-black text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">{feature.title}</h3>
              <p className="text-gray-600 font-comic font-bold leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
