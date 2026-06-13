"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MousePointerClick, Sparkles, Palette, QrCode, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: MousePointerClick, title: "Drag & Drop Magic", color: "text-[#8B5CF6]", bg: "bg-[#E9D5FF]",
    description: "Build forms as naturally as arranging sticky notes on a whiteboard. Real-time updates with zero lag.",
  },
  {
    icon: Sparkles, title: "AI Generation", color: "text-[#F472B6]", bg: "bg-[#FCE7F3]",
    description: "Describe your form in plain English. Our AI generates the fields, themes, and logic instantly.",
  },
  {
    icon: Palette, title: "Theme Studio", color: "text-amber-500", bg: "bg-amber-100",
    description: "Full creative control. Apply notebook, sketch, or glass styles. Use any Google Font.",
  },
  {
    icon: QrCode, title: "Smart QR Codes", color: "text-green-500", bg: "bg-green-100",
    description: "Every form gets an instant, customizable QR code. Choose presets like Neon or Sketch.",
  },
  {
    icon: BarChart3, title: "Rich Analytics", color: "text-blue-500", bg: "bg-blue-100",
    description: "Beautiful dashboards showing views, completion rates, drop-offs, and device stats.",
  },
  {
    icon: Shield, title: "Marketplace", color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]",
    description: "Share your themes. Browse trending creations, fork designs, and monetize your work.",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-32 px-6 bg-gradient-to-b from-[#FCFBF8] to-[#FFF5F5]" ref={ref}>
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col items-center text-center mb-24 relative">
          <div className="absolute -top-10 -left-10 text-6xl opacity-20 transform -rotate-12">✨</div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="px-6 py-2 bg-white border-2 border-[#333333] rounded-full shadow-[2px_2px_0px_#333333] mb-6 transform -rotate-2"
          >
            <span className="font-comic font-bold text-xl text-[#8B5CF6] tracking-wide">Everything you need</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-balsamiq text-5xl sm:text-6xl font-black text-[#333333] mb-6 tracking-tight relative"
          >
            Powerful tools, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#F472B6]">playful design.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl text-gray-500 font-comic font-bold"
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
              className="bg-white rounded-3xl p-8 border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:shadow-[8px_8px_0px_#333333] transition-all group flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-200" style={{ transform: 'rotate(-2deg)' }}></div>
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-[#333333]`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="font-balsamiq text-2xl font-bold text-[#333333] mb-3">{feature.title}</h3>
              <p className="text-gray-500 font-comic font-bold leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
