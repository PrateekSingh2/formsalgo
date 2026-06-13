"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchFormSubmissions } from "@/lib/supabase-actions";
import { Loader2, ArrowLeft, Users, MousePointerClick, Calendar, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const params = useParams();
  const formId = params.formId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const { submissions: subData, fields: fieldData } = await fetchFormSubmissions(formId);
        setSubmissions(subData);
        setFields(fieldData);
      } catch (error) {
        toast.error("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [formId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push("/dashboard")}
          className="p-2 rounded-xl bg-white border-2 border-[#333333] hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-[#333333]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-balsamiq text-[#333333]">Form Analytics</h1>
          <p className="text-sm text-gray-500 font-comic">Review your responses and insights.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E9D5FF] border-2 border-[#8B5CF6] flex items-center justify-center">
            <Users className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Total Responses</p>
            <p className="text-3xl font-bold font-balsamiq text-[#333333]">{submissions.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] border-2 border-[#10B981] flex items-center justify-center">
            <MousePointerClick className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Views</p>
            <p className="text-3xl font-bold font-balsamiq text-[#333333]">--</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] border-2 border-[#EF4444] flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#EF4444]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Latest Response</p>
            <p className="text-xl font-bold font-balsamiq text-[#333333]">
              {submissions.length > 0 
                ? new Date(submissions[0].started_at).toLocaleDateString()
                : "None"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] overflow-hidden">
        <div className="p-6 border-b-2 border-[#333333] bg-gray-50">
          <h2 className="text-lg font-bold font-balsamiq flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8B5CF6]" /> All Submissions
          </h2>
        </div>
        
        {submissions.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-comic">
            No responses yet. Share your form to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-[#333333]">
                  <th className="p-4 font-bold text-[#333333] whitespace-nowrap">Submitted At</th>
                  {fields.filter(f => f.type !== 'statement').map((field) => (
                    <th key={field.id} className="p-4 font-bold text-[#333333] min-w-[150px] max-w-[300px] truncate">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={sub.id} 
                    className="border-b border-gray-200 hover:bg-[#F5F3FF] transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(sub.started_at).toLocaleString()}
                    </td>
                    {fields.filter(f => f.type !== 'statement').map((field) => (
                      <td key={field.id} className="p-4 text-sm text-[#333333] max-w-[300px] truncate" title={sub.data?.[field.id]}>
                        {sub.data?.[field.id] || <span className="text-gray-300 italic">Empty</span>}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
