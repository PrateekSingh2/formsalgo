"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: 24000, suffix: "+", label: "Forms Created", color: "text-[#8B5CF6]" },
  { value: 150000, suffix: "+", label: "Responses Collected", color: "text-[#F472B6]" },
  { value: 8200, suffix: "+", label: "Active Creators", color: "text-green-500" },
  { value: 99.9, suffix: "%", label: "Uptime", color: "text-blue-500" },
];

function AnimatedCounter({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    if (value >= 1000) return Math.floor(v).toLocaleString();
    return v.toFixed(1);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return <span><motion.span>{rounded}</motion.span>{suffix}</span>;
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#FFF5F5] to-[#FCFBF8]" ref={ref}>
      <div className="max-w-[1300px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="bg-white rounded-[3rem] shadow-[8px_8px_0px_#333333] border-2 border-[#333333] p-16 relative overflow-hidden">
          
          <div className="absolute top-4 left-4 w-12 h-12 text-4xl transform -rotate-12">📊</div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}
                className="text-center flex flex-col items-center">
                <div className={`font-balsamiq text-5xl sm:text-6xl font-black tracking-tighter mb-4 ${stat.color}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
                </div>
                <div className="font-comic text-xl font-bold text-gray-500 tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
