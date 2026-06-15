"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Download, Filter, MoreHorizontal, Sparkles, Loader2, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAudienceData } from "@/lib/supabase-actions";
import { useAuth } from "@/providers/auth-provider";
import { supabase } from "@/lib/supabase";

export default function AudiencesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [audienceData, setAudienceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!user?.uid) return;
      try {
        const data = await fetchAudienceData(user.uid);
        setAudienceData(data);
      } catch (error) {
        console.error("Failed to load audience data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    // Initial load
    loadData();

    // Auto-reload every 15 seconds as a fallback
    const interval = setInterval(loadData, 15000);
    
    // Supabase Realtime Hot-Reloading
    const channel = supabase.channel('audiences_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'submissions' },
        (payload) => {
          console.log('Hot Reload: New submission detected!', payload);
          loadData();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredData = audienceData.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ["Name,Email,Status,Forms Submitted,Last Active"];
    const rows = filteredData.map(u => `"${u.name}","${u.email}","${u.status}","${u.forms}","${u.lastActive}"`);
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "audience_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunAnalysis = async () => {
    if (audienceData.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/analyze-audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audienceData })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAnalysisResult("Failed to generate analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const totalContacts = audienceData.length;
  const activeUsers = audienceData.filter(u => u.status === 'Active').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-balsamiq text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            Audience
          </h1>
          <p className="text-gray-500 font-comic mt-1">Manage all the contacts you've collected across your forms.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl font-bold font-comic text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-purple-100 rounded-[1rem_3rem_1rem_2rem] -z-10 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem_1rem_3rem_1rem] border-2 border-dashed border-purple-200 overflow-hidden odd:rotate-1">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <motion.div animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-6 right-6 w-12 h-12 bg-white rounded-[1rem_0.5rem_1rem_0.5rem] flex items-center justify-center border-2 border-purple-200">
              <Users className="w-6 h-6 text-purple-500" />
            </motion.div>
            <p className="text-xs font-bold text-gray-500 font-comic uppercase tracking-widest mb-2 relative z-10">Total Contacts</p>
            <h3 className="text-4xl font-black font-balsamiq text-gray-900 relative z-10">{totalContacts}</h3>
            <p className="text-sm text-emerald-600 font-bold font-comic mt-2 relative z-10 flex items-center gap-1"><Check className="w-4 h-4" /> Captured leads</p>
          </motion.div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-100 rounded-[3rem_1rem_2rem_1rem] -z-10 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-[1rem_2rem_1rem_3rem] border-2 border-dashed border-blue-200 overflow-hidden even:-rotate-1">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <motion.div animate={{ y: [0, 5, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-6 right-6 w-12 h-12 bg-white rounded-[1rem_0.5rem_1rem_0.5rem] flex items-center justify-center border-2 border-blue-200">
              <Sparkles className="w-6 h-6 text-blue-500" />
            </motion.div>
            <p className="text-xs font-bold text-gray-500 font-comic uppercase tracking-widest mb-2 relative z-10">Active Users</p>
            <h3 className="text-4xl font-black font-balsamiq text-gray-900 relative z-10">{activeUsers}</h3>
            <p className="text-sm text-gray-500 font-bold font-comic mt-2 relative z-10">Responded recently</p>
          </motion.div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-200 rounded-[2rem_2rem_1rem_3rem] -z-10 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-[2rem_2rem_1rem_3rem] border-2 border-dashed border-indigo-300 flex flex-col justify-center text-white overflow-hidden odd:rotate-1">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute -right-10 -bottom-10 opacity-20">
              <Sparkles className="w-40 h-40" />
            </motion.div>
            <h3 className="text-xl font-bold font-balsamiq mb-2 relative z-10 flex items-center gap-2">Audience AI <Sparkles className="w-5 h-5 text-yellow-300" /></h3>
            <p className="text-sm font-comic opacity-90 mb-4 relative z-10">Analyze your contacts to find your most engaged users automatically.</p>
            <button onClick={handleRunAnalysis} disabled={isAnalyzing || audienceData.length === 0} className="relative z-10 self-start px-5 py-2.5 bg-white text-purple-700 rounded-[1rem_0.5rem_1rem_0.5rem] font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2 border-2 border-purple-200 hover:border-purple-300">
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gray-100 rounded-[3rem_2rem_3rem_1rem] -z-10 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
        <div className="bg-white rounded-[3rem_2rem_3rem_1rem] border-2 border-dashed border-gray-300 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-50 font-comic text-sm transition-all shadow-sm"
            />
          </div>
          <div className="relative z-20">
            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className={`flex items-center gap-2 px-4 py-2.5 bg-white border shadow-sm rounded-xl font-bold font-comic hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center ${statusFilter !== "All" ? "border-purple-300 text-purple-600 bg-purple-50 hover:bg-purple-100" : "border-gray-200 text-gray-600"}`}>
              <Filter className="w-4 h-4" /> 
              {statusFilter === "All" ? "Filters" : statusFilter}
            </button>
            
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 py-2 overflow-hidden"
                >
                  {["All", "Active", "Inactive"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setStatusFilter(opt); setShowFilterDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 font-comic text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between transition-colors"
                    >
                      {opt} Status
                      {statusFilter === opt && <Check className="w-4 h-4 text-purple-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-5 font-balsamiq font-bold text-gray-500 text-sm tracking-wide">Contact</th>
                <th className="px-6 py-5 font-balsamiq font-bold text-gray-500 text-sm tracking-wide">Status</th>
                <th className="px-6 py-5 font-balsamiq font-bold text-gray-500 text-sm tracking-wide">Forms Submitted</th>
                <th className="px-6 py-5 font-balsamiq font-bold text-gray-500 text-sm tracking-wide">Last Active</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-comic">
                    No contacts found. Try publishing a form and collecting responses!
                  </td>
                </tr>
              ) : filteredData.map((user, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={user.id} 
                  className="hover:bg-purple-50/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold font-balsamiq border border-white shadow-sm ${user.color}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 font-balsamiq">{user.name}</p>
                        <p className="text-sm text-gray-500 font-comic">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-comic ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-comic font-bold text-gray-600">
                    {user.forms}
                  </td>
                  <td className="px-6 py-4 font-comic text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-purple-200 shadow-sm">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Analysis Result Modal */}
      <AnimatePresence>
        {analysisResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] border border-gray-200 shadow-xl max-w-2xl w-full p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold font-balsamiq text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" /> Audience Insights
                </h2>
                <button onClick={() => setAnalysisResult(null)} className="p-2 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 font-comic text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                {analysisResult}
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button onClick={() => setAnalysisResult(null)} className="px-6 py-2.5 bg-purple-500 text-white rounded-xl font-bold font-comic shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-600 transition-all border border-purple-600">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
