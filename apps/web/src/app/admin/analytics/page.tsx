// ============================================================================
// ADMIN ANALYTICS — Platform-wide analytics with charts
// ============================================================================

"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
} from "lucide-react";

// Mock chart data — bars for submission trends
const weeklyData = [
  { day: "Mon", value: 420 },
  { day: "Tue", value: 380 },
  { day: "Wed", value: 510 },
  { day: "Thu", value: 470 },
  { day: "Fri", value: 620 },
  { day: "Sat", value: 290 },
  { day: "Sun", value: 350 },
];

const maxValue = Math.max(...weeklyData.map((d) => d.value));

const topForms = [
  { title: "Design Contest Entry", responses: 512, rate: "82%" },
  { title: "Event Registration 2026", responses: 342, rate: "76%" },
  { title: "Job Application Form", responses: 156, rate: "68%" },
  { title: "Customer Feedback Survey", responses: 89, rate: "91%" },
  { title: "Workshop Signup", responses: 67, rate: "73%" },
];

const countries = [
  { name: "United States", value: "34%", bar: 34 },
  { name: "India", value: "22%", bar: 22 },
  { name: "United Kingdom", value: "12%", bar: 12 },
  { name: "Germany", value: "9%", bar: 9 },
  { name: "Japan", value: "7%", bar: 7 },
  { name: "Others", value: "16%", bar: 16 },
];

const devices = [
  { name: "Desktop", value: "52%", icon: Monitor, color: "text-violet-light" },
  { name: "Mobile", value: "38%", icon: Smartphone, color: "text-pink-light" },
  { name: "Tablet", value: "10%", icon: Tablet, color: "text-amber-light" },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-sm text-dark-text-secondary">Platform-wide performance and insights</p>
      </motion.div>

      {/* Weekly submissions chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-dark rounded-2xl border border-dark-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-light" /> Weekly Submissions
            </h3>
            <p className="text-xs text-dark-text-secondary mt-0.5">Last 7 days</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-light bg-green/10 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3" /> +18.2%
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-3 h-40">
          {weeklyData.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.value / maxValue) * 100}%` }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-full bg-violet/20 rounded-lg relative overflow-hidden group cursor-default"
              >
                <div className="absolute bottom-0 left-0 right-0 bg-violet/60 rounded-lg" style={{ height: "100%" }} />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-violet-light font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.value}
                </div>
              </motion.div>
              <span className="text-[10px] text-dark-text-secondary">{d.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Three columns: Top Forms, Countries, Devices */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Forms */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-dark rounded-2xl border border-dark-border overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-light" /> Top Forms
            </h3>
          </div>
          <div className="divide-y divide-dark-border">
            {topForms.map((form, i) => (
              <div key={form.title} className="px-5 py-3 flex items-center gap-3">
                <span className="text-xs font-bold text-dark-text-secondary w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{form.title}</div>
                  <div className="text-xs text-dark-text-secondary">{form.responses} responses</div>
                </div>
                <span className="text-xs text-green-light font-medium">{form.rate}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Countries */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-dark rounded-2xl border border-dark-border overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-light" /> Top Countries
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {countries.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-dark-text-secondary">{c.name}</span>
                  <span className="text-xs text-white font-medium">{c.value}</span>
                </div>
                <div className="h-1.5 bg-dark-card rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.bar}%` }} transition={{ delay: 0.5, duration: 0.6 }} className="h-full bg-blue/50 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Devices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-dark rounded-2xl border border-dark-border overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-light" /> Device Breakdown
            </h3>
          </div>
          <div className="p-5 space-y-5">
            {devices.map((d) => (
              <div key={d.name} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-dark-card flex items-center justify-center border border-dark-border">
                  <d.icon className={`w-5 h-5 ${d.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{d.name}</span>
                    <span className="text-sm font-bold text-white">{d.value}</span>
                  </div>
                  <div className="h-1.5 bg-dark-card rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: d.value }} transition={{ delay: 0.6, duration: 0.6 }} className="h-full bg-violet/50 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
