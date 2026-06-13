// ============================================================================
// DASHBOARD HOME
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Clock, MoreVertical, ExternalLink, Sparkles, Loader2, BarChart3, LayoutDashboard, FileText, Plus, Trophy, MousePointerClick, Calendar, Search, Trash2, X } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { fetchUserForms, deleteForm } from "@/lib/supabase-actions";
import { toast } from "sonner";
import { FORM_TEMPLATES } from "@/lib/templates";
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
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
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

      {/* Global Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-balsamiq text-[#333333]">Welcome back! 👋</h1>
          <p className="text-gray-500 font-comic mt-1">Here's what's happening with your forms today.</p>
        </div>
        <Link href="/builder" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all">
          <Plus className="w-5 h-5" /> Create New Form
        </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5F3FF] rounded-bl-full -z-10"></div>
                <p className="text-gray-500 font-comic font-bold text-sm mb-1">Total Responses</p>
                <h3 className="text-4xl font-balsamiq font-bold text-[#333333]">{totalResponses}</h3>
                <p className="text-[#34D399] font-comic text-xs font-bold mt-2 flex items-center gap-1">
                  {totalResponses > 0 ? "🎉 People are responding!" : "Waiting for responses..."}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#DBEAFE] rounded-bl-full -z-10"></div>
                <p className="text-gray-500 font-comic font-bold text-sm mb-1">Published Forms</p>
                <h3 className="text-4xl font-balsamiq font-bold text-[#333333]">{activeForms}</h3>
                <p className="text-gray-400 font-comic text-xs font-bold mt-2">
                  Out of {forms.length} total forms
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative overflow-hidden flex flex-col justify-center items-center text-center">
                <Sparkles className="w-8 h-8 text-[#FBBF24] mb-2" />
                <p className="font-balsamiq font-bold text-[#333333]">You're doing great!</p>
              </motion.div>
            </div>

            {/* Quick Actions & Recent Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Quick Actions */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-balsamiq text-xl font-bold text-[#333333]">Quick Actions</h3>

                <Link href="/builder" className="flex items-center gap-4 p-4 bg-white border-2 border-[#333333] rounded-2xl shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all group">
                  <div className="w-12 h-12 bg-[#E9D5FF] rounded-xl flex items-center justify-center border-2 border-[#8B5CF6] group-hover:scale-105 transition-transform">
                    <Plus className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="font-bold font-balsamiq text-[#333333]">Start from scratch</p>
                    <p className="text-xs text-gray-500 font-comic">Create a blank form</p>
                  </div>
                </Link>

                <button 
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="w-full flex items-center gap-4 p-4 bg-white border-2 border-[#333333] rounded-2xl shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all group"
                >
                  <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center border-2 border-[#F59E0B] group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold font-balsamiq text-[#333333]">Use Template</p>
                    <p className="text-xs text-gray-500 font-comic">Start from a preset</p>
                  </div>
                </button>
              </div>

              {/* Recent Forms */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-balsamiq text-xl font-bold text-[#333333]">Recently Updated</h3>
                  <button onClick={() => setActiveTab('forms')} className="text-sm font-bold text-[#8B5CF6] hover:underline font-comic">View all</button>
                </div>

                {forms.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <p className="text-gray-500 font-comic mb-4">No recent forms found.</p>
                    <Link href="/builder" className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-none transition-all">
                      Create your first form
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forms.slice(0, 3).map((form) => (
                      <div key={form.id} className="flex items-center justify-between p-4 bg-white border-2 border-[#333333] rounded-2xl shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${form.status === 'Published' ? 'bg-[#D1FAE5] border-[#10B981]' : 'bg-gray-100 border-gray-300'}`}>
                            <FileText className={`w-5 h-5 ${form.status === 'Published' ? 'text-[#10B981]' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h4 className="font-balsamiq font-bold text-[#333333] line-clamp-1">{form.title || "Untitled Form"}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${form.status === 'Published' ? 'text-[#065F46]' : 'text-gray-500'}`}>
                                {form.status}
                              </span>
                              <span className="text-[10px] text-gray-400 font-comic flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {form.lastUpdated}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/builder?id=${form.id}`} className="p-2 text-gray-500 hover:text-[#8B5CF6] hover:bg-[#E9D5FF] rounded-lg transition-colors">
                            Edit
                          </Link>
                          {form.slug && (
                            <Link href={`/dashboard/analytics/${form.id}`} className="p-2 text-[#8B5CF6] hover:bg-[#E9D5FF] rounded-lg transition-colors">
                              <BarChart3 className="w-5 h-5" />
                            </Link>
                          )}
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
                    <Link href="/builder" className="inline-block px-6 py-3 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all">
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
                        className="bg-white rounded-2xl border-2 border-[#333333] p-6 shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all flex flex-col"
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

                        <div className="mt-auto flex gap-2">
                          <Link href={`/builder?id=${form.id}`} className="flex-1 text-center py-2 bg-white border-2 border-[#333333] rounded-xl text-sm font-bold text-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-none font-comic transition-all">
                            Edit
                          </Link>
                          {form.slug ? (
                            <Link href={`/f/${form.slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#8B5CF6] text-white border-2 border-[#333333] rounded-xl text-sm font-bold shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-none font-comic transition-all">
                              <ExternalLink className="w-4 h-4" /> Open
                            </Link>
                          ) : (
                            <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-400 border-2 border-[#333333] rounded-xl text-sm font-bold font-comic cursor-not-allowed">
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
                  <div className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333]">
                    <p className="text-sm font-bold text-gray-500 uppercase mb-1">Total Form Views</p>
                    <p className="text-4xl font-balsamiq font-bold text-[#333333]">{totalViews}</p>
                  </div>
                  <div className="bg-[#E9D5FF] p-6 rounded-2xl border-2 border-[#8B5CF6] shadow-[4px_4px_0px_#8B5CF6]">
                    <p className="text-sm font-bold text-[#8B5CF6] uppercase mb-1">Total Responses</p>
                    <p className="text-4xl font-balsamiq font-bold text-[#333333]">{totalResponses}</p>
                  </div>
                  <div className="bg-[#FEF3C7] p-6 rounded-2xl border-2 border-[#F59E0B] shadow-[4px_4px_0px_#F59E0B]">
                    <p className="text-sm font-bold text-[#F59E0B] uppercase mb-1">Avg Conversion Rate</p>
                    <p className="text-4xl font-balsamiq font-bold text-[#333333]">{avgConversion}%</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] overflow-hidden">
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

          {/* Template Modal */}
          <AnimatePresence>
            {isTemplateModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                  <div className="p-6 border-b-2 border-[#333333] flex items-center justify-between bg-gray-50">
                    <div>
                      <h2 className="text-2xl font-bold font-balsamiq text-[#333333]">Choose a Template</h2>
                      <p className="text-gray-500 font-comic text-sm">Kickstart your next form with a pre-designed template.</p>
                    </div>
                    <button 
                      onClick={() => setIsTemplateModalOpen(false)}
                      className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      <X className="w-6 h-6 text-[#333333]" />
                    </button>
                  </div>
                  <div className="p-8 overflow-y-auto bg-[#FCFBF8]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {FORM_TEMPLATES.map((template) => (
                        <div 
                          key={template.id}
                          onClick={() => {
                            setIsTemplateModalOpen(false);
                            router.push(`/builder?template=${template.id}`);
                          }}
                          className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all cursor-pointer group flex flex-col"
                        >
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{template.icon}</div>
                          <h3 className="font-bold font-balsamiq text-[#333333] text-lg mb-2">{template.title}</h3>
                          <p className="text-sm font-comic text-gray-500 mb-6 flex-1">{template.description}</p>
                          <button className="w-full py-2 bg-gray-100 border-2 border-[#333333] rounded-xl font-bold font-balsamiq text-[#333333] group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors">
                            Use Template
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
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
                  className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] max-w-md w-full overflow-hidden p-8 text-center"
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
                      className="flex-1 py-3 px-4 rounded-xl font-bold font-balsamiq bg-red-500 text-white border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all flex items-center justify-center"
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
