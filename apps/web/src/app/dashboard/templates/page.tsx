"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { FORM_TEMPLATES } from "@/lib/templates";

export default function TemplatesGalleryPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard"
          className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-balsamiq text-[#333333] flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#8B5CF6]" />
            Template Gallery
          </h1>
          <p className="text-gray-500 font-comic mt-1">Kickstart your next form with a professionally designed preset.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FORM_TEMPLATES.map((template, i) => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => router.push(`/builder?template=${template.id}`)}
            className="bg-white p-8 rounded-3xl border-2 border-[#333333] shadow-[6px_6px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="w-16 h-16 bg-[#F5F3FF] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all border-2 border-[#8B5CF6]">
              {template.icon}
            </div>
            <h3 className="font-bold font-balsamiq text-[#333333] text-2xl mb-3">{template.title}</h3>
            <p className="text-sm font-comic text-gray-500 mb-8 flex-1 leading-relaxed">{template.description}</p>
            <button className="w-full py-3 bg-white border-2 border-[#333333] rounded-xl font-bold font-balsamiq text-[#333333] group-hover:bg-[#8B5CF6] group-hover:text-white group-hover:border-[#8B5CF6] transition-colors shadow-sm">
              Use Template
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
