// ============================================================================
// ADMIN FORMS — Form management with status toggles
// ============================================================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

const mockForms = [
  { id: "1", title: "Event Registration 2026", creator: "Sarah Chen", responses: 342, status: "published", views: 1240, createdAt: "2026-04-12" },
  { id: "2", title: "Customer Feedback Survey", creator: "Alex Rivera", responses: 89, status: "published", views: 456, createdAt: "2026-05-01" },
  { id: "3", title: "Job Application Form", creator: "Kira Tanaka", responses: 156, status: "published", views: 890, createdAt: "2026-03-18" },
  { id: "4", title: "Product Review Quiz", creator: "Marco Polo", responses: 0, status: "draft", views: 12, createdAt: "2026-06-02" },
  { id: "5", title: "Workshop Signup", creator: "Luna Park", responses: 67, status: "published", views: 234, createdAt: "2026-05-20" },
  { id: "6", title: "Team Standup Feedback", creator: "Dev Patel", responses: 23, status: "archived", views: 100, createdAt: "2026-01-10" },
  { id: "7", title: "Design Contest Entry", creator: "Yuki Aoi", responses: 512, status: "published", views: 2100, createdAt: "2026-02-14" },
  { id: "8", title: "Beta Tester Application", creator: "Carlos Ruiz", responses: 0, status: "closed", views: 45, createdAt: "2026-06-10" },
];

const statusColors: Record<string, { dot: string; badge: string; text: string }> = {
  published: { dot: "bg-green", badge: "bg-green/15", text: "text-green-light" },
  draft: { dot: "bg-amber", badge: "bg-amber/15", text: "text-amber-light" },
  archived: { dot: "bg-dark-text-secondary", badge: "bg-dark-card", text: "text-dark-text-secondary" },
  closed: { dot: "bg-pink", badge: "bg-pink/15", text: "text-pink-light" },
};

export default function AdminFormsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = mockForms.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.creator.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || f.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Form Management</h1>
        <p className="text-sm text-dark-text-secondary">{mockForms.length} total forms across all users</p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-secondary" />
          <input type="text" placeholder="Search forms or creators..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm text-white placeholder-dark-text-secondary focus:border-violet/50 focus:outline-none focus:ring-1 focus:ring-violet/20 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {["all", "published", "draft", "archived", "closed"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? "bg-violet/15 text-violet-light" : "bg-dark-card text-dark-text-secondary hover:text-white border border-dark-border"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-dark rounded-2xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                {["Form", "Creator", "Status", "Responses", "Views", "Created", "Actions"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-[10px] font-bold text-dark-text-secondary uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filtered.map((form, i) => {
                const sc = statusColors[form.status] || statusColors.draft;
                return (
                  <motion.tr key={form.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.03 }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-dark-text-secondary shrink-0" />
                        <span className="text-sm font-medium text-white">{form.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-dark-text-secondary">{form.creator}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${sc.badge} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {form.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-white font-medium">{form.responses.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-dark-text-secondary">{form.views.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-dark-text-secondary">{form.createdAt}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary hover:text-white transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary hover:text-white transition-colors" title="Open">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary hover:text-green-light transition-colors" title="Toggle status">
                          {form.status === "published" ? <ToggleRight className="w-4 h-4 text-green" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-pink/10 text-dark-text-secondary hover:text-pink-light transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-dark-border flex items-center justify-between">
          <span className="text-xs text-dark-text-secondary">Showing {filtered.length} of {mockForms.length}</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 py-1 rounded-lg bg-violet/15 text-violet-light text-xs font-medium">1</span>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
