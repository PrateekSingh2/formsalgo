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
    <div className="p-6 bg-white h-full border-r-2 border-[#333333]">
      <h3 className="text-xl font-balsamiq font-bold text-[#333333] mb-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border-2 border-[#F59E0B] flex items-center justify-center">
          <Plus className="w-5 h-5 text-[#F59E0B]" />
        </div>
        Add Fields
      </h3>

      <div className="space-y-6">
        {fieldCategories.map((cat, ci) => (
          <div key={cat.name} className="mb-2">
            <p className="text-xs font-bold text-black uppercase tracking-widest mb-3 flex items-center gap-2">
              {cat.name}
              <span className="flex-1 h-px bg-gray-200"></span>
            </p>
            <div className="space-y-3">
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
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#333333] bg-white border-2 border-[#333333] hover:bg-[#F5F3FF] rounded-xl transition-all text-left group shadow-[2px_2px_0px_#333333] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#333333]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-[#333333] flex items-center justify-center group-hover:bg-white transition-colors pointer-events-none">
                      <field.icon className="w-4 h-4 shrink-0 text-[#333333]" />
                    </div>
                    <span className="flex-1 font-bold font-balsamiq pointer-events-none">{field.label}</span>
                    <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#333333] pointer-events-none" />
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
