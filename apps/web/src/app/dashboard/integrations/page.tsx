"use client";

import { motion } from "framer-motion";
import { Webhook, Slack, Database, Link as LinkIcon, Plus } from "lucide-react";
import Image from "next/image";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Webhooks",
      icon: <Webhook className="w-8 h-8 text-[#8B5CF6]" />,
      desc: "Send a payload to a URL every time a form is submitted.",
      status: "Available",
      color: "bg-[#F5F3FF]",
      border: "border-[#8B5CF6]"
    },
    {
      name: "Slack",
      icon: <Slack className="w-8 h-8 text-[#E11D48]" />,
      desc: "Get notified in a channel for new responses.",
      status: "Coming Soon",
      color: "bg-gray-50",
      border: "border-gray-200"
    },
    {
      name: "Google Sheets",
      icon: <Database className="w-8 h-8 text-[#10B981]" />,
      desc: "Automatically sync responses to a spreadsheet.",
      status: "Coming Soon",
      color: "bg-gray-50",
      border: "border-gray-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-balsamiq text-[#333333]">Integrations</h1>
        <p className="text-gray-500 font-comic mt-1">Connect your forms to the tools you use every day.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border-2 ${int.status === "Available" ? "bg-white border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333]" : "bg-gray-50 border-gray-200 opacity-70"} transition-all flex flex-col`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl ${int.color} border-2 ${int.border} flex items-center justify-center`}>
                {int.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-balsamiq ${int.status === "Available" ? "bg-[#D1FAE5] text-[#065F46] border border-[#34D399]" : "bg-gray-200 text-gray-500"}`}>
                {int.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold font-balsamiq text-[#333333] mb-2">{int.name}</h3>
            <p className="text-sm text-gray-500 font-comic mb-6 flex-1">{int.desc}</p>
            
            <button 
              disabled={int.status !== "Available"}
              className={`w-full py-3 rounded-xl font-bold font-balsamiq transition-all flex items-center justify-center gap-2 ${int.status === "Available" ? "bg-[#8B5CF6] text-white border-2 border-[#333333] shadow-[2px_2px_0px_#333333]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              {int.status === "Available" ? <><Plus className="w-5 h-5" /> Configure</> : "Not Yet"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
