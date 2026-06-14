// ============================================================================
// DASHBOARD HOME
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Clock, MoreVertical, ExternalLink, Sparkles, Loader2, BarChart3, LayoutDashboard, FileText, Plus, Trophy, MousePointerClick, Calendar, Search, Trash2, X, PenLine, User, Lightbulb, Rocket, Zap, Paintbrush, Boxes, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { fetchUserForms, deleteForm } from "@/lib/supabase-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type TabType = "overview" | "forms" | "analytics";

export default function DashboardPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const router = useRouter();

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setIsDeleting(id);
    try {
      await deleteForm(id);
      setForms((prev) => prev.filter((f) => f.id !== id));
      toast.success("Form deleted successfully.");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("Failed to delete form.");
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    async function loadForms() {
      if (user?.uid) {
        try {
          const userForms = await fetchUserForms(user.uid);
          setForms(userForms);
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    }
    loadForms();
  }, [user]);

  const totalResponses = forms.reduce((acc, form) => acc + (form.responses || 0), 0);
  const totalViews = forms.reduce((acc, form) => acc + (form.views || 0), 0);
  const activeForms = forms.filter(f => f.status === 'Published').length;
  const avgConversion = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

  const filteredForms = forms
    .filter(f => f.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      if (sortOption === "oldest") return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      if (sortOption === "responses") return (b.responses || 0) - (a.responses || 0);
      if (sortOption === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">

      {/* Massive Scribble Hero Banner */}
      <div className="relative w-full bg-[#E9D5FF] border-2 border-[#333333] rounded-[2rem] p-8 md:p-12 mb-10 overflow-hidden shadow-[4px_4px_0px_#333333]">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>

        {/* Decorative Floating SVG Scribble Elements (Persons, Objects, Man) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden md:block">
          <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-10 right-20 w-16 h-16 bg-white border-2 border-[#333333] rounded-full flex items-center justify-center shadow-[2px_2px_0px_#333333]">
            <User className="w-8 h-8 text-[#8B5CF6] stroke-[2]" />
          </motion.div>
          <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute bottom-12 right-10 w-14 h-14 bg-[#FEF3C7] border-2 border-[#333333] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#333333] -rotate-6">
            <Lightbulb className="w-7 h-7 text-[#F59E0B] stroke-[2]" />
          </motion.div>
          <motion.div animate={{ x: [0, 10, 0], y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }} className="absolute top-24 right-48 w-12 h-12 bg-[#D1FAE5] border-2 border-[#333333] rounded-full flex items-center justify-center shadow-[2px_2px_0px_#333333] rotate-12">
            <Rocket className="w-6 h-6 text-[#10B981] stroke-[2]" />
          </motion.div>
          <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute bottom-20 right-40 w-20 h-20 bg-[#FBCFE8] border-2 border-[#333333] rounded-[2rem] flex items-center justify-center shadow-[2px_2px_0px_#333333] rotate-45">
            <Boxes className="w-10 h-10 text-[#EC4899] stroke-[2] -rotate-45" />
          </motion.div>

          {/* Scribble Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path d="M 50,250 C 100,200 150,300 250,150 S 350,200 400,100" fill="none" stroke="#333333" strokeWidth="6" strokeDasharray="10 15" strokeLinecap="round" />
            <path d="M 100,50 Q 200,20 250,100 T 350,150" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" />
            <circle cx="300" cy="80" r="15" fill="none" stroke="#F59E0B" strokeWidth="5" />
            <path d="M 280,60 L 320,100 M 320,60 L 280,100" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#333333] rounded-full shadow-[2px_2px_0px_#333333] mb-6">
            <Zap className="w-4 h-4 text-[#F59E0B] fill-current" />
            <span className="text-xs font-bold font-balsamiq text-[#333333] uppercase tracking-wider">Welcome Back</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-balsamiq text-[#333333] leading-tight mb-4 tracking-tight">
            Let's build some<span className="text-[#8B5CF6] underline decoration-4 underline-offset-4"> awesome forms.</span>
          </h1>
          <p className="text-lg text-[#333333] font-comic font-bold mb-8 max-w-md">
            Here's what's happening with your forms today. Jump right back in and keep the creativity flowing!
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/builder" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#8B5CF6] text-white text-lg font-black font-balsamiq rounded-xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] active:translate-y-[2px] active:shadow-none transition-all">
              <Plus className="w-6 h-6 stroke-[2]" /> Create New Form
            </Link>
            <button onClick={() => setActiveTab('forms')} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#333333] text-lg font-black font-balsamiq rounded-xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:bg-gray-50 hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] active:translate-y-[2px] active:shadow-none transition-all">
              View Forms <ArrowRight className="w-6 h-6 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b-2 border-gray-200 pb-px overflow-x-auto hide-scrollbar">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "forms", label: "My Forms", icon: FileText },
          { id: "analytics", label: "Global Analytics", icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-3 font-balsamiq font-bold text-sm rounded-t-xl border-2 border-b-0 transition-colors ${isActive
                ? 'bg-white border-[#333333] text-[#8B5CF6] relative translate-y-px z-10'
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FEF3C7] p-8 rounded-none border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-red-400 border-2 border-[#333333] opacity-80 rotate-3"></div> {/* Tape */}
                <p className="text-gray-600 font-comic font-black text-sm mb-2 uppercase tracking-widest">Total Responses</p>
                <h3 className="text-5xl font-black font-balsamiq text-[#333333]">{totalResponses}</h3>
                <p className="text-[#333333] font-comic text-sm font-bold mt-4 flex items-center gap-2 border-t-2 border-dashed border-[#333333] pt-4">
                  {totalResponses > 0 ? "🎉 People are responding!" : "Waiting for responses..."}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#D1FAE5] p-8 rounded-none border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative transform rotate-2 hover:rotate-0 transition-transform">
                <div className="absolute -top-3 right-8 w-12 h-6 bg-blue-400 border-2 border-[#333333] opacity-80 -rotate-6"></div> {/* Tape */}
                <p className="text-gray-600 font-comic font-black text-sm mb-2 uppercase tracking-widest">Published Forms</p>
                <h3 className="text-5xl font-black font-balsamiq text-[#333333]">{activeForms}</h3>
                <p className="text-[#333333] font-comic text-sm font-bold mt-4 border-t-2 border-dashed border-[#333333] pt-4">
                  Out of {forms.length} total forms
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#FBCFE8] p-8 rounded-none border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative transform -rotate-2 hover:rotate-0 transition-transform flex flex-col justify-center items-center text-center">
                <div className="absolute -top-4 left-4 w-6 h-6 rounded-full bg-yellow-400 border-2 border-[#333333] shadow-[2px_2px_0px_#333333]"></div> {/* Pin */}
                <Sparkles className="w-12 h-12 text-[#333333] mb-4 stroke-[2]" />
                <p className="font-balsamiq font-black text-2xl text-[#333333]">You're doing great!</p>
              </motion.div>
            </div>

            {/* Quick Actions & Recent Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="font-balsamiq text-2xl font-black text-[#333333] border-b-4 border-[#333333] inline-block pb-1">Quick Actions</h3>

                <Link href="/builder" className="flex items-center gap-4 p-5 bg-white border-2 border-[#333333] rounded-[1.5rem] shadow-[4px_4px_0px_#333333] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#333333] active:translate-y-[3px] active:shadow-none transition-all group">
                  <div className="w-14 h-14 bg-[#E9D5FF] rounded-2xl flex items-center justify-center border-2 border-[#333333] group-hover:rotate-6 transition-transform">
                    <Plus className="w-8 h-8 text-[#333333] stroke-[2]" />
                  </div>
                  <div>
                    <p className="font-black text-lg font-balsamiq text-[#333333]">Start from scratch</p>
                    <p className="text-sm text-gray-500 font-comic font-bold">Create a blank form</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/templates"
                  className="w-full flex items-center gap-4 p-5 bg-white border-2 border-[#333333] rounded-[1.5rem] shadow-[4px_4px_0px_#333333] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#333333] active:translate-y-[3px] active:shadow-none transition-all group"
                >
                  <div className="w-14 h-14 bg-[#FEF3C7] rounded-2xl flex items-center justify-center border-2 border-[#333333] group-hover:-rotate-6 transition-transform">
                    <Paintbrush className="w-7 h-7 text-[#333333] stroke-[2]" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg font-balsamiq text-[#333333]">Use Template</p>
                    <p className="text-sm text-gray-500 font-comic font-bold">Start from a preset</p>
                  </div>
                </Link>
              </div>

              {/* Recent Forms */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-balsamiq text-2xl font-black text-[#333333] border-b-4 border-[#333333] inline-block pb-1">Recently Updated</h3>
                  <button onClick={() => setActiveTab('forms')} className="text-sm font-black text-[#8B5CF6] hover:underline font-comic uppercase tracking-widest">View all</button>
                </div>

                {forms.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-[#333333] rounded-3xl p-10 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
                    <div className="w-20 h-20 bg-[#F3F4F6] border-2 border-[#333333] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[2px_2px_0px_#333333]">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-comic font-bold mb-6 text-lg">No recent forms found.</p>
                    <Link href="/builder" className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-black font-balsamiq rounded-xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] active:translate-y-[2px] active:shadow-none transition-all">
                      Create your first form
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forms.slice(0, 3).map((form) => (
                      <div key={form.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border-2 border-[#333333] rounded-2xl shadow-[2px_2px_0px_#333333] hover:-translate-y-px hover:shadow-[3px_3px_0px_#333333] transition-all gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl border-2 border-[#333333] shadow-[1px_1px_0px_#333333] flex items-center justify-center ${form.status === 'Published' ? 'bg-[#D1FAE5]' : 'bg-gray-100'}`}>
                            {form.status === 'Published' ? <CheckCircle2 className="w-6 h-6 text-[#10B981] stroke-[2]" /> : <FileText className="w-6 h-6 text-gray-500 stroke-[2]" />}
                          </div>
                          <div>
                            <h4 className="font-balsamiq font-black text-lg text-[#333333] truncate max-w-[200px] md:max-w-xs">
                              {form.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-comic font-bold flex items-center gap-2 mt-1">
                              {form.status === 'Published' ? (
                                <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] border border-[#333333]"></span>
                              ) : (
                                <span className="inline-block w-2 h-2 rounded-full bg-gray-400 border border-[#333333]"></span>
                              )}
                              {form.status} • Updated {form.lastUpdated}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 sm:ml-auto">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 font-comic font-bold uppercase tracking-wider">Responses</p>
                            <p className="font-balsamiq font-black text-xl text-[#333333]">{form.responses || 0}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/dashboard/analytics/${form.id}`}
                              className="p-3 bg-[#E9D5FF] text-[#8B5CF6] rounded-xl border-2 border-[#333333] hover:bg-[#8B5CF6] hover:text-white transition-colors shadow-[2px_2px_0px_#333333] hover:translate-y-px hover:shadow-[1px_1px_0px_#333333]"
                              title="Analytics"
                            >
                              <BarChart3 className="w-5 h-5 stroke-[3]" />
                            </Link>
                            <Link
                              href={`/builder/${form.id}`}
                              className="p-3 bg-[#DBEAFE] text-[#3B82F6] rounded-xl border-2 border-[#333333] hover:bg-[#3B82F6] hover:text-white transition-colors shadow-[2px_2px_0px_#333333] hover:translate-y-px hover:shadow-[1px_1px_0px_#333333]"
                              title="Edit Form"
                            >
                              <PenLine className="w-5 h-5 stroke-[3]" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "forms" && (
          <motion.div key="forms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold font-balsamiq text-[#333333]">All Forms</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search forms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border-2 border-[#333333] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 shadow-[2px_2px_0px_#333333]"
                  />
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border-2 border-[#333333] rounded-xl text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 shadow-[2px_2px_0px_#333333] appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="responses">Most Responses</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>

            {forms.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-2 font-balsamiq">No forms yet</h3>
                <p className="text-gray-500 mb-6 font-comic">Create your first form to start collecting responses.</p>
                <Link href="/builder" className="inline-block px-6 py-3 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] transition-all">
                  Create Form ✨
                </Link>
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <h3 className="text-xl font-bold text-[#333333] mb-2 font-balsamiq">No matches found</h3>
                <p className="text-gray-500 font-comic">Try adjusting your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredForms.map((form, i) => (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="bg-white rounded-2xl border-2 border-[#333333] p-6 shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${form.status === 'Published' ? 'bg-[#D1FAE5] text-[#065F46] border border-[#34D399]' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                        {form.status}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/analytics/${form.id}`} className="text-[#8B5CF6] hover:bg-[#E9D5FF] p-1.5 rounded-lg transition-colors" title="View Analytics">
                          <BarChart3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(form.id)}
                          disabled={isDeleting === form.id}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                          title="Delete Form"
                        >
                          {isDeleting === form.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <h4 className="font-balsamiq text-xl font-bold text-[#333333] mb-1 line-clamp-1">{form.title || "Untitled"}</h4>
                    <p className="text-xs font-comic text-gray-500 mb-6 flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {form.lastUpdated}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-3 border border-[#333333]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Views</p>
                        <p className="font-balsamiq font-bold text-lg text-[#333333]">{form.views}</p>
                      </div>
                      <div className="bg-[#F5F3FF] rounded-xl p-3 border border-[#333333]">
                        <p className="text-[10px] font-bold text-[#8B5CF6] uppercase">Responses</p>
                        <p className="font-balsamiq font-bold text-lg text-[#8B5CF6]">{form.responses}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-2 pt-4 border-t-2 border-gray-100">
                      <Link href={`/builder?id=${form.id}`} className="w-full flex items-center justify-center gap-2 py-2 bg-white border-2 border-[#333333] rounded-xl text-sm font-bold text-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-none font-comic transition-all">
                        <PenLine className="w-4 h-4" /> Edit Form
                      </Link>
                      {form.slug ? (
                        <Link href={`/f/${form.slug}`} target="_blank" className="w-full flex items-center justify-center gap-2 py-2 bg-[#8B5CF6] text-white border-2 border-[#333333] rounded-xl text-sm font-bold shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-none font-comic transition-all">
                          <ExternalLink className="w-4 h-4" /> Open Live
                        </Link>
                      ) : (
                        <button className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-400 border-2 border-[#333333] rounded-xl text-sm font-bold font-comic cursor-not-allowed">
                          Draft
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333]">
                <p className="text-sm font-bold text-gray-500 uppercase mb-1">Total Form Views</p>
                <p className="text-4xl font-balsamiq font-bold text-[#333333]">{totalViews}</p>
              </div>
              <div className="bg-[#E9D5FF] p-6 rounded-2xl border-2 border-[#8B5CF6] shadow-[2px_2px_0px_#8B5CF6]">
                <p className="text-sm font-bold text-[#8B5CF6] uppercase mb-1">Total Responses</p>
                <p className="text-4xl font-balsamiq font-bold text-[#333333]">{totalResponses}</p>
              </div>
              <div className="bg-[#FEF3C7] p-6 rounded-2xl border-2 border-[#F59E0B] shadow-[2px_2px_0px_#F59E0B]">
                <p className="text-sm font-bold text-[#F59E0B] uppercase mb-1">Avg Conversion Rate</p>
                <p className="text-4xl font-balsamiq font-bold text-[#333333]">{avgConversion}%</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333] overflow-hidden">
              <div className="p-6 border-b-2 border-[#333333] bg-gray-50 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-[#F59E0B]" />
                <h2 className="text-xl font-bold font-balsamiq text-[#333333]">Top Performing Forms</h2>
              </div>
              <div className="p-6">
                {forms.length === 0 ? (
                  <p className="text-gray-500 font-comic text-center py-8">No forms to display.</p>
                ) : (
                  <div className="space-y-4">
                    {forms.sort((a, b) => (b.responses || 0) - (a.responses || 0)).slice(0, 5).map((form, i) => (
                      <div key={form.id} className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#E9D5FF] text-[#8B5CF6] font-bold flex items-center justify-center border-2 border-[#333333]">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-bold font-balsamiq text-[#333333]">{form.title}</p>
                            <p className="text-xs text-gray-500 font-comic">{form.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Responses</p>
                            <p className="font-balsamiq font-bold text-lg text-[#8B5CF6]">{form.responses}</p>
                          </div>
                          <Link href={`/dashboard/analytics/${form.id}`} className="px-4 py-2 bg-white border-2 border-[#333333] rounded-xl text-xs font-bold shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-none transition-all">
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] max-w-md w-full overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold font-balsamiq text-[#333333] mb-2">Delete Form?</h2>
              <p className="text-gray-500 font-comic mb-8">Are you sure you want to delete this form? All responses will be permanently removed. This action cannot be undone.</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={!!isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl font-bold font-balsamiq bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!!isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl font-bold font-balsamiq bg-red-500 text-white border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] transition-all flex items-center justify-center"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
