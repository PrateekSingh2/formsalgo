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
          className="p-3 bg-white border border-gray-200 rounded-2xl hover:border-purple-300 hover:text-purple-600 transition-colors shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-balsamiq text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Template Gallery
          </h1>
          <p className="text-gray-500 font-comic mt-1">Kickstart your next form with a professionally designed preset.</p>
        </div>
      </div>

      {/* Decorative Visual Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-pink-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
      <div className="absolute top-40 right-40 w-16 h-16 bg-blue-100 rounded-full blur-xl opacity-60 pointer-events-none"></div>
      
      {/* Floating Animated Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute top-32 right-32 w-12 h-12 bg-white rounded-full border border-purple-200 shadow-sm flex items-center justify-center">
          <span className="text-xl text-purple-400">✨</span>
        </motion.div>
        <motion.div animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute bottom-32 left-12 w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-center transform -rotate-12">
          <span className="text-2xl">📋</span>
        </motion.div>
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
            className="relative bg-white p-8 rounded-[2rem_1rem_3rem_1rem] border-2 border-dashed border-gray-300 hover:-translate-y-1 hover:border-purple-300 transition-all cursor-pointer group flex flex-col h-full z-10 odd:rotate-1 even:-rotate-1 hover:rotate-0"
          >
            {/* Soft Pastel Offset Pseudo-Shadow */}
            <div className="absolute inset-0 bg-purple-50/50 rounded-[1rem_3rem_1rem_2rem] -z-10 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>

            <div className="w-16 h-16 bg-white rounded-[1rem_0.5rem_1rem_0.5rem] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all border-2 border-purple-200 shadow-sm">
              {template.icon}
            </div>
            <h3 className="font-bold font-balsamiq text-gray-900 text-2xl mb-3">{template.title}</h3>
            <p className="text-sm font-comic text-gray-500 mb-8 flex-1 leading-relaxed">{template.description}</p>
            <button className="w-full py-3 bg-white border-2 border-gray-200 rounded-[1rem_0.5rem_1rem_0.5rem] font-bold font-balsamiq text-gray-700 group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-600 transition-colors shadow-sm relative overflow-hidden">
              <span className="relative z-10">Use Template</span>
              <div className="absolute inset-0 bg-purple-100 scale-x-0 group-hover:scale-x-100 origin-left transition-transform opacity-20"></div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
