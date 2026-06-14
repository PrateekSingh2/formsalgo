"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchFormSubmissions, fetchUserForms } from "@/lib/supabase-actions";
import { Loader2, ArrowLeft, Users, MousePointerClick, Calendar, BarChart3, TrendingUp, Download, Monitor, Smartphone, Tablet, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/providers/auth-provider";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const params = useParams();
  const formId = params.formId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topForms, setTopForms] = useState<any[]>([]);
  const [deviceStats, setDeviceStats] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const { submissions: subData, fields: fieldData, form: fData } = await fetchFormSubmissions(formId);
        setSubmissions(subData);
        setFields(fieldData);
        setFormData(fData);
        
        // Process data for chart
        const groupedByDay = subData.reduce((acc: Record<string, number>, sub: any) => {
          const date = new Date(sub.started_at).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        
        const chartDataArr = Object.entries(groupedByDay).map(([date, count]) => ({
          date,
          Responses: count
        })).reverse(); // Oldest to newest
        
        setChartData(chartDataArr);

        // Process Device Breakdown
        let desktop = 0;
        let mobile = 0;
        let tablet = 0;
        
        subData.forEach((sub: any) => {
          if (sub.device_type === "Mobile") mobile++;
          else if (sub.device_type === "Tablet") tablet++;
          else desktop++;
        });

        const total = subData.length || 1;
        setDeviceStats([
          { name: "Desktop", value: `${Math.round((desktop/total)*100)}%`, count: desktop, icon: Monitor, color: "text-[#8B5CF6]", bar: (desktop/total)*100 },
          { name: "Mobile", value: `${Math.round((mobile/total)*100)}%`, count: mobile, icon: Smartphone, color: "text-[#EC4899]", bar: (mobile/total)*100 },
          { name: "Tablet", value: `${Math.round((tablet/total)*100)}%`, count: tablet, icon: Tablet, color: "text-[#F59E0B]", bar: (tablet/total)*100 },
        ]);

        if (user?.uid) {
          const userForms = await fetchUserForms(user.uid);
          const sorted = userForms.sort((a: any, b: any) => b.responses - a.responses).slice(0, 5);
          setTopForms(sorted);
        }

      } catch (error) {
        toast.error("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [formId, user]);

  const handleExportCSV = () => {
    if (submissions.length === 0) return;

    const dataFields = fields.filter(f => f.type !== 'statement');
    const headers = ["Submitted At", ...dataFields.map(f => f.label.replace(/"/g, '""'))];
    const csvRows = [headers.map(h => `"${h}"`).join(",")];

    const formatVal = (val: any) => {
      if (!val) return '';
      if (Array.isArray(val)) return val.join(", ");
      if (typeof val === "object") return Object.entries(val).map(([k, v]) => `${k}: ${v}`).join(" | ");
      return String(val);
    };

    submissions.forEach(sub => {
      const row = [
        `"${new Date(sub.started_at).toLocaleString()}"`,
        ...dataFields.map(f => `"${formatVal(sub.data?.[f.id]).replace(/"/g, '""')}"`)
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${formData?.title || 'form_data'}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  const renderCellValue = (value: any) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-gray-300 italic">Empty</span>;
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");
    }
    return String(value);
  };

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
          <h1 className="text-2xl font-bold font-balsamiq text-[#333333]">{formData?.title || "Form Analytics"}</h1>
          <p className="text-sm text-gray-500 font-comic">Review your responses and insights.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
            <p className="text-3xl font-bold font-balsamiq text-[#333333]">{formData?.views || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border-2 border-[#F59E0B] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Conversion Rate</p>
            <p className="text-3xl font-bold font-balsamiq text-[#333333]">
              {formData?.views > 0 
                ? Math.round((submissions.length / formData.views) * 100) + "%" 
                : "0%"}
            </p>
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
                ? new Date(submissions[0].started_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                : "None"
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      {submissions.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] mb-10">
          <h2 className="text-lg font-bold font-balsamiq flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#8B5CF6]" /> Responses Over Time
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#F5F3FF' }} contentStyle={{ borderRadius: '12px', border: '2px solid #333333', boxShadow: '4px 4px 0px #333333', fontWeight: 'bold' }} />
                <Bar dataKey="Responses" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Forms & Devices Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {/* Top Forms */}
        <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-[#333333] bg-gray-50">
            <h3 className="text-lg font-balsamiq font-bold text-[#333333] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3B82F6]" /> Your Top Forms
            </h3>
          </div>
          <div className="divide-y-2 divide-dashed divide-gray-200">
            {topForms.map((form, i) => (
              <div key={form.id} className="p-4 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-500 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#333333] truncate">{form.title}</div>
                  <div className="text-xs font-bold text-gray-500">{form.responses} responses</div>
                </div>
                <Link href={`/dashboard/analytics/${form.id}`} className="text-xs font-bold text-[#8B5CF6] hover:underline">
                  View
                </Link>
              </div>
            ))}
            {topForms.length === 0 && (
              <div className="p-5 text-sm font-bold text-gray-500 text-center">
                No other forms found.
              </div>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-[#333333] bg-gray-50">
            <h3 className="text-lg font-balsamiq font-bold text-[#333333] flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[#F59E0B]" /> Device Breakdown
            </h3>
          </div>
          <div className="p-5 space-y-6">
            {deviceStats.map((d) => (
              <div key={d.name} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F9F9F9] flex items-center justify-center border-2 border-[#333333]">
                  <d.icon className={`w-6 h-6 ${d.color} stroke-[3]`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-500">{d.name} <span className="font-normal">({d.count})</span></span>
                    <span className="text-sm font-bold text-[#333333]">{d.value}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden border-2 border-[#333333]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${d.bar}%` }} transition={{ delay: 0.3, duration: 0.6 }} className="h-full bg-[#8B5CF6] border-r-2 border-[#333333]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] overflow-hidden">
        <div className="p-6 border-b-2 border-[#333333] bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-bold font-balsamiq flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8B5CF6]" /> All Submissions
          </h2>
          {submissions.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#333333] font-bold font-sans text-sm rounded-xl border-2 border-[#333333] hover:bg-[#E9D5FF] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
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
                      <td key={field.id} className="p-4 text-sm text-[#333333] max-w-[300px] truncate" title={typeof sub.data?.[field.id] === 'string' ? sub.data?.[field.id] : ""}>
                        {renderCellValue(sub.data?.[field.id])}
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
