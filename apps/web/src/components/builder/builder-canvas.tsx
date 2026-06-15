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
      const starsCount = Math.max(1, (field.config?.max as number) || 5);
      return (
        <div className="flex gap-1">
          {Array.from({ length: starsCount }).map((_, s) => (
            <div key={s} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-sm grayscale opacity-50 bg-[#F9FAFB]">⭐</div>
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
          <div className="flex justify-between text-[10px] text-gray-400 font-bold">
            <span>{String(field.config?.min ?? 0)}</span>
            <span>{String(field.config?.max ?? 100)}</span>
          </div>
        </div>
      );

    case "nps":
      return (
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: (field.config?.max as number ?? 10) - (field.config?.min as number ?? 0) + 1 }, (_, i) => (
            <div key={i} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold bg-[#F9FAFB]">
              {(field.config?.min as number ?? 0) + i}
            </div>
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
        <div className="space-y-2 max-w-md">
          <div className={`${inputCls}`} style={{ height: 34 }} />
          <div className="grid grid-cols-2 gap-2">
            <div className={`${inputCls}`} style={{ height: 34 }} />
            <div className={`${inputCls}`} style={{ height: 34 }} />
          </div>
        </div>
      );

    case "matrix":
    case "likert":
      const rows = (field.config?.rows as string[]) || ["Statement 1"];
      const cols = (field.config?.columns as string[]) || ["Scale 1", "Scale 2"];
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-400">
            <thead>
              <tr>
                <th className="p-2 font-normal border-b border-gray-200"></th>
                {cols.map((c, i) => <th key={i} className="p-2 font-normal text-center border-b border-gray-200">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 max-w-[150px] truncate">{r}</td>
                  {cols.map((_, ci) => (
                    <td key={ci} className="p-2 text-center">
                      <div className="w-3 h-3 rounded-full border-2 border-gray-300 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
      onClick={() => setActiveField(field.id)}
      className={`group relative rounded-[1rem_0.5rem_1rem_0.5rem] transition-all cursor-pointer bg-white border-2 border-dashed ${
        isActive 
          ? "border-purple-300 shadow-md z-20 ring-4 ring-purple-50" 
          : "border-transparent hover:border-gray-300 hover:shadow-sm"
      } ${isDragging ? "opacity-50 scale-105 shadow-lg z-50 border-purple-400" : ""}`}
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

      <div className="p-4 w-full">
        {/* Field Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center bg-purple-50 border border-purple-200 rounded-[0.3rem_0.5rem_0.2rem_0.5rem] text-[10px] font-black text-purple-600 font-balsamiq transform -rotate-2">
              {(typeof field.order === 'number' && !isNaN(field.order) ? field.order : 0) + 1}
            </span>
            <span className="font-black text-sm text-gray-900 font-balsamiq">
              {field.label}
            </span>
            {field.required && <span className="text-red-500 text-sm font-black shrink-0">*</span>}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <FieldIcon className="w-4 h-4 stroke-[2]" />
          </div>
        </div>

        {field.description && (
          <p className="text-[11px] text-gray-400 mb-2 leading-relaxed ml-7 font-sans">{field.description}</p>
        )}

        <div className="pointer-events-none ml-7">
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
          className="w-full font-balsamiq text-3xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-4 focus:ring-purple-50 rounded-[1rem_0.5rem_1rem_0.5rem] px-2 py-1.5 transition-all hover:bg-gray-50 placeholder:text-gray-300"
          placeholder="Untitled Form"
        />
        <div className="h-px bg-gradient-to-r from-purple-200 to-transparent mt-2 ml-2 mb-2" />
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
          className="mt-12 text-center py-16 bg-purple-50 rounded-[3rem_2rem_3rem_1rem] border-2 border-dashed border-purple-200 relative overflow-hidden group shadow-sm"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-6 rounded-[1rem_0.5rem_1rem_0.5rem] bg-white border border-purple-200 shadow-sm flex items-center justify-center relative"
          >
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-center shadow-sm animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-500 stroke-[2]" />
            </div>
            <Type className="w-8 h-8 text-purple-500 stroke-[2]" />
          </motion.div>

          <h3 className="font-balsamiq text-2xl font-black text-gray-900 mb-3">Build your masterpiece!</h3>
          <p className="text-gray-500 text-base font-comic font-bold max-w-sm mx-auto">Drag and drop fields from the left panel to start creating your form. It's that easy.</p>
        </motion.div>
      )}
    </div>
  );
}
