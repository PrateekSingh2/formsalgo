"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: 24000, suffix: "+", label: "Forms Created", color: "text-emerald-700" },
  { value: 150000, suffix: "+", label: "Responses Collected", color: "text-emerald-700" },
  { value: 8200, suffix: "+", label: "Active Creators", color: "text-emerald-700" },
  { value: 99.9, suffix: "%", label: "Uptime", color: "text-emerald-700" },
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
    <section className="py-24 px-6 bg-white" ref={ref}>
      <div className="max-w-[1300px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="bg-[#D1FAE5] rounded-[2rem] shadow-sm border border-emerald-200 p-16 relative overflow-hidden transform -rotate-1">
          
          <div className="absolute top-4 left-4 w-12 h-12 text-4xl transform rotate-12 opacity-80 filter blur-[1px]">📊</div>
          
          <div className="absolute -right-10 -bottom-10 text-[10rem] opacity-10 transform -rotate-12">📈</div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}
                className="text-center flex flex-col items-center">
                <div className={`font-balsamiq text-5xl sm:text-6xl font-black tracking-tighter mb-2 ${stat.color}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
                </div>
                <div className="font-comic text-lg font-bold text-emerald-900 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
