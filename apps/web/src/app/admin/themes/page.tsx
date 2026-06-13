// ============================================================================
// ADMIN THEMES — Theme review and marketplace management
// ============================================================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Search,
  Check,
  X,
  Star,
  Download,
  Eye,
  ShieldCheck,
} from "lucide-react";

const mockThemes = [
  { id: "1", name: "Moonlit Garden", creator: "Sarah Chen", status: "approved", downloads: 2300, rating: 4.9, price: 0, colors: ["#1a1a2e", "#8B5CF6", "#E879F9", "#22C55E"] },
  { id: "2", name: "Paper Craft", creator: "Alex Rivera", status: "approved", downloads: 1800, rating: 4.8, price: 4.99, colors: ["#F8F4EE", "#D97706", "#EC4899", "#3B82F6"] },
  { id: "3", name: "Neon Rush", creator: "Kira Tanaka", status: "pending", downloads: 0, rating: 0, price: 2.99, colors: ["#0F0F1A", "#00FF88", "#FF0080", "#0088FF"] },
  { id: "4", name: "Cozy Notebook", creator: "Mika L.", status: "approved", downloads: 1500, rating: 4.7, price: 0, colors: ["#FEF3C7", "#92400E", "#F59E0B", "#7C3AED"] },
  { id: "5", name: "Ocean Breeze", creator: "Yuki Aoi", status: "pending", downloads: 0, rating: 0, price: 0, colors: ["#0C1445", "#0EA5E9", "#06B6D4", "#22D3EE"] },
  { id: "6", name: "Retro Wave", creator: "Carlos Ruiz", status: "rejected", downloads: 0, rating: 0, price: 1.99, colors: ["#1a1a2e", "#FF6B6B", "#FFE66D", "#4ECDC4"] },
];

const statusConfig: Record<string, { badge: string; text: string }> = {
  approved: { badge: "bg-green/15", text: "text-green-light" },
  pending: { badge: "bg-amber/15", text: "text-amber-light" },
  rejected: { badge: "bg-pink/15", text: "text-pink-light" },
};

export default function AdminThemesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = mockThemes.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Theme Management</h1>
        <p className="text-sm text-dark-text-secondary">Review and manage marketplace themes</p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-secondary" />
          <input type="text" placeholder="Search themes..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm text-white placeholder-dark-text-secondary focus:border-violet/50 focus:outline-none focus:ring-1 focus:ring-violet/20 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === s ? "bg-violet/15 text-violet-light" : "bg-dark-card text-dark-text-secondary hover:text-white border border-dark-border"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s === "pending" && <span className="ml-1.5 px-1.5 py-0.5 bg-amber/20 text-amber-light rounded-full text-[10px]">{mockThemes.filter(t => t.status === "pending").length}</span>}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Theme Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((theme, i) => {
          const sc = statusConfig[theme.status] || statusConfig.pending;
          return (
            <motion.div key={theme.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-dark rounded-2xl border border-dark-border overflow-hidden group">
              {/* Color preview */}
              <div className="h-28 relative flex">
                {theme.colors.map((color, ci) => (
                  <div key={ci} className="flex-1" style={{ backgroundColor: color }} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent" />
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${sc.badge} ${sc.text}`}>{theme.status}</span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-white mb-0.5">{theme.name}</h4>
                <p className="text-xs text-dark-text-secondary mb-3">by {theme.creator}</p>

                <div className="flex items-center gap-3 text-xs text-dark-text-secondary mb-4">
                  {theme.downloads > 0 && <span className="flex items-center gap-1"><Download className="w-3 h-3" />{theme.downloads.toLocaleString()}</span>}
                  {theme.rating > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber text-amber" />{theme.rating}</span>}
                  {theme.price > 0 && <span className="text-green-light font-medium">${theme.price}</span>}
                  {theme.price === 0 && <span className="text-dark-text-secondary">Free</span>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-dark-card border border-dark-border text-xs text-dark-text-secondary hover:text-white hover:border-dark-text-secondary transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  {theme.status === "pending" && (
                    <>
                      <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-green/15 text-green-light text-xs font-medium hover:bg-green/25 transition-colors">
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-pink/15 text-pink-light text-xs font-medium hover:bg-pink/25 transition-colors">
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {theme.status === "approved" && (
                    <div className="flex items-center gap-1 px-3 py-2 text-xs text-green-light">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
