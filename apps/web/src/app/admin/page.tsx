// ============================================================================
// ADMIN OVERVIEW — Dashboard home with stats cards and recent activity
// ============================================================================

"use client";

import { motion } from "framer-motion";
import {
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle2,
  Clock,
  Palette,
} from "lucide-react";

// Mock data — will be replaced with tRPC calls once DB is connected
const stats = [
  {
    label: "Total Users",
    value: "8,247",
    change: "+12.5%",
    up: true,
    icon: Users,
    color: "violet",
  },
  {
    label: "Total Forms",
    value: "24,891",
    change: "+8.3%",
    up: true,
    icon: FileText,
    color: "blue",
  },
  {
    label: "Submissions",
    value: "152,430",
    change: "+23.1%",
    up: true,
    icon: BarChart3,
    color: "green",
  },
  {
    label: "Active Forms",
    value: "6,102",
    change: "-2.4%",
    up: false,
    icon: TrendingUp,
    color: "amber",
  },
];

const recentUsers = [
  { name: "Sarah Chen", email: "sarah@example.com", forms: 12, joined: "2h ago", avatar: "🧑‍💻" },
  { name: "Alex Rivera", email: "alex@example.com", forms: 8, joined: "5h ago", avatar: "👩‍🎨" },
  { name: "Kira Tanaka", email: "kira@example.com", forms: 23, joined: "1d ago", avatar: "🧑‍🏫" },
  { name: "Marco Polo", email: "marco@example.com", forms: 5, joined: "1d ago", avatar: "👨‍💼" },
  { name: "Luna Park", email: "luna@example.com", forms: 17, joined: "2d ago", avatar: "👩‍🔬" },
];

const recentForms = [
  { title: "Event Registration 2026", creator: "Sarah Chen", responses: 342, status: "published" },
  { title: "Customer Feedback Survey", creator: "Alex Rivera", responses: 89, status: "published" },
  { title: "Job Application Form", creator: "Kira Tanaka", responses: 156, status: "published" },
  { title: "Product Review Quiz", creator: "Marco Polo", responses: 0, status: "draft" },
  { title: "Workshop Signup", creator: "Luna Park", responses: 67, status: "published" },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  violet: { bg: "bg-violet/10", text: "text-violet-light", border: "border-violet/20" },
  blue: { bg: "bg-blue/10", text: "text-blue-light", border: "border-blue/20" },
  green: { bg: "bg-green/10", text: "text-green-light", border: "border-green/20" },
  amber: { bg: "bg-amber/10", text: "text-amber-light", border: "border-amber/20" },
};

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const c = colorMap[stat.color] || colorMap.violet;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
      className={`glass-dark rounded-2xl p-5 border ${c.border} cursor-default`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <stat.icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            stat.up
              ? "bg-green/10 text-green-light"
              : "bg-pink/10 text-pink-light"
          }`}
        >
          {stat.up ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {stat.change}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
      <div className="text-xs text-dark-text-secondary">{stat.label}</div>
    </motion.div>
  );
}

export default function AdminOverviewPage() {
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-sm text-dark-text-secondary">
          Welcome back — here&apos;s what&apos;s happening with FormForge.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Two-column layout: Recent Users + Recent Forms */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-dark rounded-2xl border border-dark-border overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-light" />
              Recent Users
            </h3>
            <span className="text-xs text-dark-text-secondary">Last 7 days</span>
          </div>
          <div className="divide-y divide-dark-border">
            {recentUsers.map((user, i) => (
              <motion.div
                key={user.email}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-dark-card flex items-center justify-center text-sm">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-dark-text-secondary truncate">
                    {user.email}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-dark-text-secondary">
                    {user.forms} forms
                  </div>
                  <div className="text-[10px] text-dark-text-secondary">
                    {user.joined}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-dark rounded-2xl border border-dark-border overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-light" />
              Recent Forms
            </h3>
            <span className="text-xs text-dark-text-secondary">All time</span>
          </div>
          <div className="divide-y divide-dark-border">
            {recentForms.map((form, i) => (
              <motion.div
                key={form.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    form.status === "published" ? "bg-green" : "bg-amber"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {form.title}
                  </div>
                  <div className="text-xs text-dark-text-secondary">
                    by {form.creator}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-white">{form.responses}</div>
                  <div className="text-[10px] text-dark-text-secondary">
                    responses
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { icon: Eye, label: "Page Views Today", value: "4,289", color: "text-violet-light" },
          { icon: CheckCircle2, label: "Submissions Today", value: "1,342", color: "text-green-light" },
          { icon: Clock, label: "Avg. Completion", value: "2m 34s", color: "text-blue-light" },
          { icon: Palette, label: "Themes Published", value: "47", color: "text-amber-light" },
        ].map((item, i) => (
          <div
            key={item.label}
            className="glass-dark rounded-xl border border-dark-border p-4 text-center"
          >
            <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-2`} />
            <div className="text-lg font-bold text-white">{item.value}</div>
            <div className="text-[10px] text-dark-text-secondary uppercase tracking-wider">
              {item.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
