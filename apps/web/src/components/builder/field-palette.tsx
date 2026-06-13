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
    <div className="p-4">
      <h3 className="text-sm font-bold text-heading mb-4">Fields</h3>
      {fieldCategories.map((cat, ci) => (
        <div key={cat.name} className="mb-5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{cat.name}</p>
          <div className="space-y-0.5">
            {cat.fields.map((field, fi) => (
              <motion.button
                key={field.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.05 + fi * 0.02 }}
                whileHover={{ x: 4, backgroundColor: "rgba(139,92,246,0.06)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addField(field.type)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-body hover:text-violet rounded-lg transition-all text-left group"
              >
                <field.icon className="w-4 h-4 shrink-0 text-muted group-hover:text-violet transition-colors" />
                <span className="flex-1">{field.label}</span>
                <Plus className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
