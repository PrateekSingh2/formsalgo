"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFormBuilderStore, type BuilderField } from "@/stores/form-builder-store";
import { GripVertical, Trash2, Copy, Star, Type, Mail, AlignLeft, Hash, Calendar, Clock, Phone, CheckSquare, CircleDot, ChevronDown, Sliders, Upload, PenTool, MapPin, Link, Image, Grid3X3, BarChart, ArrowUpDown, Share2, List, Video, Sparkles } from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const fieldIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  short_text: Type, long_text: AlignLeft, email: Mail, phone: Phone,
  number: Hash, date: Calendar, time: Clock, rating: Star, stars: Star,
  slider: Sliders, file_upload: Upload, signature: PenTool, checkbox: CheckSquare,
  radio: CircleDot, dropdown: ChevronDown, multiple_select: List,
  image_choice: Image, video_choice: Video, matrix: Grid3X3,
  ranking: ArrowUpDown, likert: BarChart, nps: BarChart,
  address: MapPin, url: Link, social_links: Share2,
};

// ============================================================================
// LIVE FIELD PREVIEW — Disabled, visual-only representation
// ============================================================================
function LiveField({ field }: { field: BuilderField }) {
  const placeholder = field.config?.placeholder as string || `Enter ${field.label.toLowerCase()}...`;
  const opts = (field.config?.options as string[]) || ["Option A", "Option B", "Option C"];

  const inputCls = "w-full max-w-md bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400 pointer-events-none font-sans";

  switch (field.type) {
    case "short_text":
    case "email":
    case "phone":
    case "number":
    case "url":
      return <input type="text" className={inputCls} placeholder={placeholder} disabled />;

    case "long_text":
      return <textarea className={`${inputCls} h-20 resize-none`} placeholder={placeholder} disabled />;

    case "date":
      return <input type="date" className={inputCls} disabled />;

    case "time":
      return <input type="time" className={inputCls} disabled />;

    case "dropdown":
      return (
        <div className="relative">
          <select className={`${inputCls} appearance-none pr-8`} disabled>
            <option>Select an option...</option>
            {opts.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {opts.map((o) => (
            <div key={o} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
              <span className="text-sm text-gray-400">{o}</span>
            </div>
          ))}
        </div>
      );

    case "checkbox":
    case "multiple_select":
      return (
        <div className="space-y-2">
          {opts.map((o) => (
            <div key={o} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-gray-300 shrink-0" />
              <span className="text-sm text-gray-400">{o}</span>
            </div>
          ))}
        </div>
      );

    case "rating":
    case "stars":
      return (
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-lg grayscale opacity-60">⭐</div>
          ))}
        </div>
      );

    case "slider":
      return (
        <div className="space-y-1">
          <div className="w-full h-2 bg-gray-200 rounded-full relative">
            <div className="absolute left-0 top-0 w-1/2 h-full bg-[#8B5CF6]/30 rounded-full" />
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow" />
          </div>
          <div className="flex justify-between text-xs text-gray-300">
            <span>{String(field.config?.sliderMin ?? 0)}</span>
            <span>{String(field.config?.sliderMax ?? 100)}</span>
          </div>
        </div>
      );

    case "nps":
      return (
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-300 font-bold">{i}</div>
          ))}
        </div>
      );

    case "file_upload":
      return (
        <div className="h-24 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 gap-1">
          <Upload className="w-5 h-5" />
          <span className="text-xs">Click or drag file</span>
        </div>
      );

    case "address":
      return (
        <div className="space-y-2">
          <div className={`${inputCls}`} style={{ height: 34 }} />
          <div className="grid grid-cols-2 gap-2">
            <div className={`${inputCls}`} style={{ height: 34 }} />
            <div className={`${inputCls}`} style={{ height: 34 }} />
          </div>
        </div>
      );

    default:
      return <div className="h-9 rounded-lg bg-gray-50 border border-dashed border-gray-200" />;
  }
}

// ============================================================================
// SORTABLE CANVAS FIELD CARD
// ============================================================================
function SortableCanvasField({ field }: { field: BuilderField }) {
  const { activeFieldId, setActiveField, removeField, duplicateField, themeConfig } = useFormBuilderStore();
  const isActive = activeFieldId === field.id;
  const FieldIcon = fieldIcons[field.type] || Type;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => { e.stopPropagation(); setActiveField(field.id); }}
      className={`relative group rounded-2xl bg-white border transition-all duration-200 cursor-default flex flex-col
        ${isActive ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 shadow-sm" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity z-10 hover:bg-gray-50"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Action buttons — appear on hover / active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-3 right-3 flex gap-1 bg-white rounded-lg border border-gray-200 shadow-md p-0.5 z-20"
          >
            <button
              onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5 w-full">
        {/* Field Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg text-xs font-bold text-gray-500 font-sans">
              {(typeof field.order === 'number' && !isNaN(field.order) ? field.order : 0) + 1}
            </span>
            <span className="font-semibold text-[15px] text-[#333333] font-sans">
              {field.label}
            </span>
            {field.required && <span className="text-red-400 text-sm font-bold shrink-0">*</span>}
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <FieldIcon className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {field.description && (
          <p className="text-xs text-gray-400 mb-3 leading-relaxed ml-10 font-sans">{field.description}</p>
        )}

        <div className="pointer-events-none ml-10">
          <LiveField field={field} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CANVAS
// ============================================================================
export function BuilderCanvas() {
  const { fields, title, reorderFields, themeConfig, setFormMeta } = useFormBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === String(active.id));
      const newIndex = fields.findIndex((f) => f.id === String(over.id));
      reorderFields(oldIndex, newIndex);
    }
  };

  return (
    <div 
      className="max-w-2xl mx-auto pb-32 px-2 min-h-full"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/formforge-field')) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDrop={(e) => {
        const type = e.dataTransfer.getData('application/formforge-field');
        if (type) {
          e.preventDefault();
          useFormBuilderStore.getState().addField(type as any);
        }
      }}
    >
      {/* Form Title & Description */}
      <div className="mb-8 mt-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setFormMeta({ title: e.target.value })}
          className="w-full font-balsamiq text-3xl font-bold text-[#333333] bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 rounded-lg px-2 py-1.5 transition-all hover:bg-black/[0.02] placeholder:text-gray-300"
          placeholder="Untitled Form"
        />
        <div className="h-px bg-gradient-to-r from-[#8B5CF6]/30 to-transparent mt-2 ml-2 mb-2" />
        <textarea
          value={useFormBuilderStore.getState().description || ""}
          onChange={(e) => setFormMeta({ description: e.target.value })}
          className="w-full font-comic text-base text-gray-500 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 rounded-lg px-2 py-1.5 transition-all hover:bg-black/[0.02] placeholder:text-gray-300 resize-none overflow-hidden"
          placeholder="Add a description or instructions (optional)"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>

      {/* Fields */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 relative z-10">
            {fields.map((field) => (
              <SortableCanvasField key={field.id} field={field} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {fields.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center relative"
          >
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FEF3C7] rounded-full border-2 border-[#F59E0B] flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <Type className="w-10 h-10 text-gray-300" />
          </motion.div>

          <h3 className="font-balsamiq text-2xl font-bold text-[#333333] mb-2">Build your masterpiece</h3>
          <p className="text-gray-500 text-sm font-comic max-w-sm mx-auto">Drag and drop fields from the left panel to start creating your form. It's that easy!</p>
        </motion.div>
      )}
    </div>
  );
}
