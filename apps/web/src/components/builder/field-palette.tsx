// ============================================================================
// FIELD PALETTE — Draggable field types sidebar
// ============================================================================

"use client";

import { motion } from "framer-motion";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import type { FieldType } from "@formforge/types";
import {
  Type, AlignLeft, Mail, Phone, Hash, Calendar, Clock, Star,
  Sliders, Upload, PenTool, CheckSquare, CircleDot, ChevronDown,
  List, Image, Video, Grid3X3, ArrowUpDown, BarChart, MapPin, Link, Share2, Plus,
} from "lucide-react";

const fieldCategories = [
  {
    name: "Basic",
    fields: [
      { type: "short_text" as FieldType, label: "Short Text", icon: Type },
      { type: "long_text" as FieldType, label: "Long Text", icon: AlignLeft },
      { type: "email" as FieldType, label: "Email", icon: Mail },
      { type: "phone" as FieldType, label: "Phone", icon: Phone },
      { type: "number" as FieldType, label: "Number", icon: Hash },
      { type: "date" as FieldType, label: "Date", icon: Calendar },
      { type: "time" as FieldType, label: "Time", icon: Clock },
      { type: "url" as FieldType, label: "URL", icon: Link },
    ],
  },
  {
    name: "Choice",
    fields: [
      { type: "checkbox" as FieldType, label: "Checkbox", icon: CheckSquare },
      { type: "radio" as FieldType, label: "Radio", icon: CircleDot },
      { type: "dropdown" as FieldType, label: "Dropdown", icon: ChevronDown },
      { type: "multiple_select" as FieldType, label: "Multi Select", icon: List },
      { type: "image_choice" as FieldType, label: "Image Choice", icon: Image },
    ],
  },
  {
    name: "Rating",
    fields: [
      { type: "rating" as FieldType, label: "Rating", icon: Star },
      { type: "stars" as FieldType, label: "Stars", icon: Star },
      { type: "slider" as FieldType, label: "Slider", icon: Sliders },
      { type: "nps" as FieldType, label: "NPS", icon: BarChart },
      { type: "ranking" as FieldType, label: "Ranking", icon: ArrowUpDown },
    ],
  },
  {
    name: "Advanced",
    fields: [
      { type: "file_upload" as FieldType, label: "File Upload", icon: Upload },
      { type: "signature" as FieldType, label: "Signature", icon: PenTool },
      { type: "address" as FieldType, label: "Address", icon: MapPin },
      { type: "matrix" as FieldType, label: "Matrix", icon: Grid3X3 },
      { type: "social_links" as FieldType, label: "Social Links", icon: Share2 },
    ],
  },
];

export function FieldPalette() {
  const addField = useFormBuilderStore((s) => s.addField);

  return (
    <div className="p-4 bg-white/50 backdrop-blur-sm h-full border-r border-gray-200 shadow-[2px_0_10px_rgba(0,0,0,0.02)] relative z-10 overflow-y-auto">
      <h3 className="text-xl font-balsamiq font-black text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="w-10 h-10 rounded-[1rem_0.5rem_1rem_0.5rem] bg-amber-50 border-2 border-dashed border-amber-200 shadow-sm flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
          <Plus className="w-5 h-5 text-amber-500 stroke-[2]" />
        </div>
        Add Fields
      </h3>

      <div className="space-y-6">
        {fieldCategories.map((cat, ci) => (
          <div key={cat.name} className="mb-3">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-[0.5rem_1rem_0.5rem_1rem] border-2 border-dashed border-purple-200 w-fit transform -rotate-1">
              {cat.name}
            </p>
            <div className="space-y-2">
              {cat.fields.map((field, fi) => (
                <div
                  key={field.type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/formforge-field', field.type);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ci * 0.05 + fi * 0.02 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addField(field.type)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 font-bold font-balsamiq bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-[1rem_0.5rem_1rem_0.5rem] transition-all text-left group shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <field.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors stroke-[2]" />
                    {field.label}
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
