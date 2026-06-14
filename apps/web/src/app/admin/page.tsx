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
  Loader2,
} from "lucide-react";

// Live data fetches will replace stats on mount
const fallbackStats = [
  { label: "Total Users", value: "0", change: "--", up: true, icon: Users, color: "violet" },
  { label: "Total Forms", value: "0", change: "--", up: true, icon: FileText, color: "blue" },
  { label: "Submissions", value: "0", change: "--", up: true, icon: BarChart3, color: "green" },
  { label: "Active Forms", value: "0", change: "--", up: false, icon: TrendingUp, color: "amber" },
];

function StatCard({ stat, index }: { stat: (typeof fallbackStats)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -4, boxShadow: "6px 6px 0px #8B5CF6" }}
      className={`bg-white rounded-2xl p-5 border-4 border-[#333333] shadow-[6px_6px_0px_#333333] cursor-default transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border-2 border-[#333333] bg-[#F0EBFF] flex items-center justify-center`}>
          <stat.icon className={`w-5 h-5 text-[#333333]`} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-comic font-bold px-2 py-1 rounded-full border-2 border-[#333333] ${
            stat.up
              ? "bg-[#4ADE80] text-[#333333]"
              : "bg-[#F472B6] text-[#333333]"
          }`}
        >
          {stat.up ? (
            <ArrowUpRight className="w-3 h-3 stroke-[3]" />
          ) : (
            <ArrowDownRight className="w-3 h-3 stroke-[3]" />
          )}
          {stat.change}
        </div>
      </div>
      <div className="text-4xl font-balsamiq font-bold text-[#333333] mb-0.5">{stat.value}</div>
      <div className="text-sm font-comic font-bold text-gray-500">{stat.label}</div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { fetchAdminOverview } from "@/lib/admin-actions";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: any;
    recentUsers: any[];
    recentForms: any[];
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      const overview = await fetchAdminOverview();
      setData(overview);
      setLoading(false);
    }
    loadData();
  }, []);

  const stats = data ? [
    { label: "Total Users", value: data.stats.totalUsers.toLocaleString(), change: "Live", up: true, icon: Users, color: "violet" },
    { label: "Total Forms", value: data.stats.totalForms.toLocaleString(), change: "Live", up: true, icon: FileText, color: "blue" },
    { label: "Submissions", value: data.stats.submissions.toLocaleString(), change: "Live", up: true, icon: BarChart3, color: "green" },
    { label: "Active Forms", value: data.stats.activeForms.toLocaleString(), change: "Live", up: true, icon: TrendingUp, color: "amber" },
  ] : fallbackStats;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-balsamiq font-bold text-[#333333] mb-1">Dashboard Overview</h1>
        <p className="text-sm font-comic font-bold text-gray-600">
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
          className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] overflow-hidden"
        >
          <div className="px-5 py-4 border-b-4 border-[#333333] bg-[#F9F9F9] flex items-center justify-between">
            <h3 className="text-lg font-balsamiq font-bold text-[#333333] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8B5CF6]" />
              Recent Users
            </h3>
            <span className="text-xs font-comic font-bold text-gray-500">Last 7 days</span>
          </div>
          <div className="divide-y-2 divide-dashed divide-gray-300 font-comic">
            {loading ? (
              <div className="px-5 py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-500" /></div>
            ) : data?.recentUsers.length === 0 ? (
              <div className="px-5 py-4 text-sm text-gray-500 font-bold text-center">No users found.</div>
            ) : data?.recentUsers.map((user, i) => (
              <motion.div
                key={user.email}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="px-5 py-3 flex items-center gap-3 hover:bg-[#F0EBFF] transition-colors"
              >
                <div className="w-10 h-10 rounded-full border-2 border-[#333333] bg-[#E9D5FF] flex items-center justify-center text-sm font-bold uppercase text-[#333333]">
                  {user.name ? user.name.substring(0, 2) : user.email.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#333333] truncate">
                    {user.name || "Anonymous User"}
                  </div>
                  <div className="text-xs font-bold text-gray-500 truncate">
                    {user.email}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[#333333]">
                    {user.forms?.[0]?.count || 0} forms
                  </div>
                  <div className="text-[10px] font-bold text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
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
          className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] overflow-hidden"
        >
          <div className="px-5 py-4 border-b-4 border-[#333333] bg-[#F9F9F9] flex items-center justify-between">
            <h3 className="text-lg font-balsamiq font-bold text-[#333333] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3B82F6]" />
              Recent Forms
            </h3>
            <span className="text-xs font-comic font-bold text-gray-500">All time</span>
          </div>
          <div className="divide-y-2 divide-dashed divide-gray-300 font-comic">
            {loading ? (
              <div className="px-5 py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-500" /></div>
            ) : data?.recentForms.length === 0 ? (
              <div className="px-5 py-4 text-sm font-bold text-gray-500 text-center">No forms found.</div>
            ) : data?.recentForms.map((form, i) => (
              <motion.div
                key={form.title + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="px-5 py-3 flex items-center gap-3 hover:bg-[#EFF6FF] transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 border-[#333333] shrink-0 ${
                    form.status === "published" ? "bg-[#4ADE80]" : "bg-[#FBBF24]"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#333333] truncate">
                    {form.title}
                  </div>
                  <div className="text-xs font-bold text-gray-500">
                    by {form.users?.name || form.users?.email || "Unknown"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[#333333]">{form.submissions?.[0]?.count || 0}</div>
                  <div className="text-[10px] font-bold text-gray-500">
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
