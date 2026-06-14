// ============================================================================
// ADMIN FORMS — Form management with status toggles
// ============================================================================

"use client";

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

// Live data will replace this
const mockForms: any[] = [];

const statusColors: Record<string, { dot: string; badge: string; text: string }> = {
  published: { dot: "bg-[#4ADE80]", badge: "bg-[#4ADE80]/20 border-[#4ADE80]", text: "text-[#166534]" },
  draft: { dot: "bg-[#FBBF24]", badge: "bg-[#FBBF24]/20 border-[#FBBF24]", text: "text-[#B45309]" },
  archived: { dot: "bg-gray-400", badge: "bg-gray-100 border-gray-400", text: "text-gray-600" },
  closed: { dot: "bg-[#F472B6]", badge: "bg-[#F472B6]/20 border-[#F472B6]", text: "text-[#9D174D]" },
};

import { useState, useEffect } from "react";
import { fetchAllFormsAdmin, toggleFormStatusAdmin, archiveFormAdmin } from "@/lib/admin-actions";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminFormsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAllFormsAdmin(500); // 500 limit for safety
      setForms(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggleStatus = async (formId: string, currentStatus: string) => {
    const success = await toggleFormStatusAdmin(formId, currentStatus);
    if (success) {
      setForms(prev => prev.map(f => f.id === formId ? { ...f, status: currentStatus === 'published' ? 'draft' : 'published' } : f));
      toast.success("Status updated");
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleArchive = async (formId: string) => {
    if (!confirm("Are you sure you want to archive this form?")) return;
    const success = await archiveFormAdmin(formId);
    if (success) {
      setForms(prev => prev.map(f => f.id === formId ? { ...f, status: 'archived' } : f));
      toast.success("Form archived safely");
    } else {
      toast.error("Failed to archive form");
    }
  };

  const filtered = forms.filter((f) => {
    const creatorName = f.users?.name || f.users?.email || "Unknown";
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) || creatorName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || f.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 font-comic">
        <h1 className="text-3xl font-balsamiq font-bold text-[#333333] mb-1">Form Management</h1>
        <p className="text-sm font-bold text-gray-600">{forms.length} total forms across all users</p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-wrap gap-3 font-comic">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Search forms or creators..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-4 border-[#333333] rounded-xl text-sm font-bold text-[#333333] placeholder-gray-400 shadow-[4px_4px_0px_#333333] focus:outline-none focus:shadow-[4px_4px_0px_#8B5CF6] transition-shadow" />
        </div>
        <div className="flex gap-2">
          {["all", "published", "draft", "archived", "closed"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${filterStatus === s ? "bg-[#8B5CF6] text-white border-[#333333] shadow-[2px_2px_0px_#333333]" : "bg-white text-gray-600 border-transparent hover:border-[#333333] hover:text-[#333333] hover:shadow-[2px_2px_0px_#333333]"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] overflow-hidden font-comic">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-[#333333] bg-[#F9F9F9]">
                {["Form", "Creator", "Status", "Responses", "Views", "Created"].map((h) => (
                  <th key={h} className="px-5 py-4 text-xs font-balsamiq font-bold text-[#333333] uppercase tracking-wider">{h}</th>
                ))}
                <th className="px-5 py-4 text-xs font-balsamiq font-bold text-[#333333] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500 font-bold">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading forms...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500 font-bold">
                    No forms found matching your criteria.
                  </td>
                </tr>
              ) : filtered.map((form, i) => {
                const sc = statusColors[form.status] || statusColors.draft;
                const creatorName = form.users?.name || form.users?.email || "Unknown";
                const responseCount = form.submissions?.[0]?.count || 0;
                
                return (
                  <motion.tr key={form.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.03 }} className="hover:bg-[#F0EBFF] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#3B82F6] shrink-0" />
                        <span className="text-sm font-bold text-[#333333]">{form.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-600">{creatorName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${sc.badge} ${sc.text}`}>
                        <span className={`w-2 h-2 rounded-full border border-black/20 ${sc.dot}`} />
                        {form.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#333333]">{responseCount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-500">{(form.views || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-500">{new Date(form.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/f/${form.slug}`} target="_blank" className="p-2 rounded-xl bg-white border-2 border-[#333333] text-[#333333] hover:bg-[#EFF6FF] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#333333] transition-all" title="Open Link">
                          <ExternalLink className="w-4 h-4 stroke-[3]" />
                        </Link>
                        <button onClick={() => handleToggleStatus(form.id, form.status)} className="p-2 rounded-xl bg-white border-2 border-[#333333] text-[#333333] hover:bg-[#ECFDF5] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#333333] transition-all" title="Toggle status">
                          {form.status === "published" ? <ToggleRight className="w-4 h-4 text-[#22C55E] stroke-[3]" /> : <ToggleLeft className="w-4 h-4 stroke-[3]" />}
                        </button>
                        <button onClick={() => handleArchive(form.id)} className="p-2 rounded-xl bg-white border-2 border-[#333333] text-[#333333] hover:bg-[#FDF2F8] hover:text-[#EC4899] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#333333] transition-all" title="Archive safely">
                          <Trash2 className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t-4 border-[#333333] bg-[#F9F9F9] flex items-center justify-between font-comic">
          <span className="text-xs font-bold text-gray-500">Showing {filtered.length} of {forms.length}</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white border-2 border-transparent text-gray-400 hover:border-[#333333] hover:text-[#333333] hover:shadow-[2px_2px_0px_#333333] transition-all"><ChevronLeft className="w-5 h-5 stroke-[3]" /></button>
            <span className="px-4 py-1.5 rounded-xl bg-[#8B5CF6] text-white border-2 border-[#333333] text-sm font-bold shadow-[2px_2px_0px_#333333]">1</span>
            <button className="p-2 rounded-xl bg-white border-2 border-transparent text-gray-400 hover:border-[#333333] hover:text-[#333333] hover:shadow-[2px_2px_0px_#333333] transition-all"><ChevronRight className="w-5 h-5 stroke-[3]" /></button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
