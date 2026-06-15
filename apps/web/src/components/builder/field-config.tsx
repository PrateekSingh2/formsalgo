// ============================================================================
// RIGHT SIDEBAR — Field Properties & Theme Configuration
// ============================================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { Settings2, Palette, Paintbrush, SlidersHorizontal, Plus, X } from "lucide-react";

export function FieldConfig() {
  const { fields, activeFieldId, updateField, themeConfig, formSettings, setFormMeta } = useFormBuilderStore();
  const field = fields.find((f) => f.id === activeFieldId);
  const [activeTab, setActiveTab] = useState<"field" | "theme" | "settings">("field");

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm">

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white shadow-sm z-10 relative">
        <button
          onClick={() => setActiveTab("field")}
          className={`flex-1 py-3 text-sm font-balsamiq font-black flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'field' ? 'text-purple-600 bg-purple-50/50 border-b-2 border-b-purple-500' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
        >
          <Settings2 className="w-4 h-4 stroke-[2]" /> Properties
        </button>
        <button
          onClick={() => setActiveTab("theme")}
          className={`flex-1 py-3 text-sm font-balsamiq font-black flex flex-col items-center justify-center gap-1 transition-all border-l border-r border-gray-100 ${activeTab === 'theme' ? 'text-purple-600 bg-purple-50/50 border-b-2 border-b-purple-500' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
        >
          <Palette className="w-4 h-4 stroke-[2]" /> Theme
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-3 text-sm font-balsamiq font-black flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'settings' ? 'text-purple-600 bg-purple-50/50 border-b-2 border-b-purple-500' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[2]" /> Settings
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        {activeTab === "field" ? (
          <AnimatePresence mode="wait">
            {field ? (
              <motion.div key={field.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }} className="space-y-5 font-comic">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 bg-amber-50 w-fit px-2 py-0.5 rounded-[0.5rem_0.2rem_0.5rem_0.2rem] border border-dashed border-amber-200 transform -rotate-1">Label</label>
                  <input type="text" value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-[0.2rem_0.5rem_0.2rem_0.5rem] border border-dashed border-emerald-200 transform rotate-1">Description</label>
                  <textarea value={field.description || ""} onChange={(e) => updateField(field.id, { description: e.target.value })} rows={2}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all resize-none text-gray-900 font-bold" placeholder="Add a help text..." />
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <label className="text-sm font-black text-gray-900">Required Field</label>
                  <button onClick={() => updateField(field.id, { required: !field.required })}
                    className={`w-12 h-6 rounded-full transition-colors relative border border-gray-200 ${field.required ? "bg-emerald-400 border-emerald-500" : "bg-gray-100"}`}>
                    <motion.div animate={{ x: field.required ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm border border-gray-200" />
                  </button>
                </div>

                {["short_text", "long_text", "email", "phone", "number", "url"].includes(field.type) && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 bg-blue-50 w-fit px-2 py-0.5 rounded border border-dashed border-blue-200 transform rotate-1">Placeholder</label>
                      <input type="text" value={(field.config?.placeholder as string) || ""} onChange={(e) => updateField(field.id, { config: { ...field.config, placeholder: e.target.value } })}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" placeholder="Enter placeholder text..." />
                    </div>
                    {["short_text", "long_text"].includes(field.type) && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Min Length</label>
                          <input type="number" value={(field.config?.minLength as number) || ""} onChange={(e) => updateField(field.id, { config: { ...field.config, minLength: parseInt(e.target.value) || undefined } })}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-purple-300 focus:outline-none transition-all text-gray-900 font-bold" placeholder="e.g. 10" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Max Length</label>
                          <input type="number" value={(field.config?.maxLength as number) || ""} onChange={(e) => updateField(field.id, { config: { ...field.config, maxLength: parseInt(e.target.value) || undefined } })}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-purple-300 focus:outline-none transition-all text-gray-900 font-bold" placeholder="e.g. 500" />
                        </div>
                      </div>
                    )}
                    {field.type === "number" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Min Value</label>
                          <input type="number" value={(field.config?.min as number) || ""} onChange={(e) => updateField(field.id, { config: { ...field.config, min: parseInt(e.target.value) || undefined } })}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-purple-300 focus:outline-none transition-all text-gray-900 font-bold" placeholder="e.g. 0" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Max Value</label>
                          <input type="number" value={(field.config?.max as number) || ""} onChange={(e) => updateField(field.id, { config: { ...field.config, max: parseInt(e.target.value) || undefined } })}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-purple-300 focus:outline-none transition-all text-gray-900 font-bold" placeholder="e.g. 100" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {["multiple_select", "radio", "checkbox", "dropdown", "image_choice", "video_choice"].includes(field.type) && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 bg-pink-50 w-fit px-2 py-0.5 rounded border border-dashed border-pink-200 transform -rotate-2">Options</label>
                    {((field.config?.options as string[]) || ['Option 1', 'Option 2']).map((opt: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...((field.config?.options as string[]) || ['Option 1', 'Option 2'])];
                            newOptions[idx] = e.target.value;
                            updateField(field.id, { config: { ...field.config, options: newOptions } });
                          }}
                          className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold"
                        />
                        <button
                          onClick={() => {
                            const newOptions = [...((field.config?.options as string[]) || ['Option 1', 'Option 2'])];
                            newOptions.splice(idx, 1);
                            updateField(field.id, { config: { ...field.config, options: newOptions } });
                          }}
                          className="p-2.5 bg-white border border-gray-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-red-50 hover:border-red-200 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4 text-red-500 stroke-[2]" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const currentOpts = (field.config?.options as string[]) || ['Option 1', 'Option 2'];
                        const newOptions = [...currentOpts, `Option ${currentOpts.length + 1}`];
                        updateField(field.id, { config: { ...field.config, options: newOptions } });
                      }}
                      className="w-full py-2 px-3 bg-white border-2 border-dashed border-gray-300 rounded-xl shadow-sm text-sm font-black text-purple-600 hover:bg-purple-50 hover:border-purple-300 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Plus className="w-4 h-4 stroke-[2]" /> Add Option
                    </button>
                  </div>
                )}

                {["rating", "stars", "slider", "nps"].includes(field.type) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Min Range</label>
                        <input type="number" value={(field.config?.min as number) ?? 1} onChange={(e) => updateField(field.id, { config: { ...field.config, min: parseInt(e.target.value) } })}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Max Range</label>
                        <input type="number" value={(field.config?.max as number) ?? 5} onChange={(e) => updateField(field.id, { config: { ...field.config, max: parseInt(e.target.value) } })}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" />
                      </div>
                    </div>
                    {field.type === "slider" && (
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Step Size</label>
                        <input type="number" value={(field.config?.step as number) ?? 1} onChange={(e) => updateField(field.id, { config: { ...field.config, step: parseInt(e.target.value) } })}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" />
                      </div>
                    )}
                  </div>
                )}

                {field.type === "file_upload" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Max File Size (MB)</label>
                      <input type="number" value={(field.config?.maxSize as number) || 5} onChange={(e) => updateField(field.id, { config: { ...field.config, maxSize: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Allowed Formats (comma separated)</label>
                      <input type="text" value={(field.config?.allowedTypes as string) || ".pdf, .png, .jpg"} onChange={(e) => updateField(field.id, { config: { ...field.config, allowedTypes: e.target.value } })}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" />
                    </div>
                  </div>
                )}

                {["matrix", "likert"].includes(field.type) && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 bg-blue-50 w-fit px-2 py-0.5 rounded-[0.5rem_0.2rem_0.5rem_0.2rem] border border-dashed border-blue-200 transform rotate-2">Statements (Rows)</label>
                      <textarea value={((field.config?.rows as string[]) || ["Statement 1", "Statement 2"]).join('\n')} onChange={(e) => updateField(field.id, { config: { ...field.config, rows: e.target.value.split('\n') } })} rows={3}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" placeholder="One per line..." />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 bg-purple-50 w-fit px-2 py-0.5 rounded-[0.2rem_0.5rem_0.2rem_0.5rem] border border-dashed border-purple-200 transform -rotate-1">Scale (Columns)</label>
                      <textarea value={((field.config?.columns as string[]) || ["Poor", "Average", "Excellent"]).join('\n')} onChange={(e) => updateField(field.id, { config: { ...field.config, columns: e.target.value.split('\n') } })} rows={3}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all text-gray-900 font-bold" placeholder="One per line..." />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-dashed border-gray-200 mt-6">
                  <span className="text-xs font-bold text-gray-400">Type: </span>
                  <span className="text-xs font-bold text-[#8B5CF6] bg-[#E9D5FF] px-2.5 py-1 rounded-full ml-1 border border-[#8B5CF6]">{field.type.replace("_", " ")}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 bg-white border border-purple-200 shadow-sm rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
                  <Settings2 className="w-8 h-8 text-purple-500 stroke-[2]" />
                </div>
                <p className="text-sm font-comic font-bold text-gray-600 bg-amber-50 px-4 py-2 border border-dashed border-amber-200 rounded-xl shadow-sm transform rotate-2">Select a field to edit its properties</p>
              </motion.div>
            )}
          </AnimatePresence>
        ) : activeTab === "theme" ? (
          /* THEME TAB */
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 font-comic">

            {/* Quick Themes */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Quick Themes</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Programmer */}
                <button
                  onClick={() => setFormMeta({ themeConfig: { fontFamily: "font-mono", backgroundColor: "bg-transparent", accentColor: "border-emerald-500", borderStyle: "border border-emerald-500/50", rounded: "rounded-sm", formBgColor: "#0f172a", fieldBgColor: "rgba(15, 23, 42, 0.8)", textColor: "#10b981", glassmorphism: true, backgroundPattern: "programmer" } })}
                  className="p-3 border border-emerald-500/30 rounded-sm text-left relative overflow-hidden group transition-all bg-[#0f172a] hover:border-emerald-500"
                >
                  <div className="relative z-10 flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-sm bg-emerald-500 border border-emerald-400/50"></div>
                    <div className="w-4 h-4 rounded-sm bg-[#1e293b] border border-emerald-500/30"></div>
                  </div>
                  <span className="relative z-10 font-mono text-xs text-emerald-500">&lt;Programmer/&gt;</span>
                </button>

                {/* Healthcare */}
                <button
                  onClick={() => setFormMeta({ themeConfig: { fontFamily: "font-sans", backgroundColor: "bg-blue-50", accentColor: "border-red-500", borderStyle: "border-2", rounded: "rounded-2xl", formBgColor: "#f0f9ff", fieldBgColor: "rgba(255, 255, 255, 0.9)", textColor: "#0f172a", glassmorphism: true, backgroundPattern: "healthcare" } })}
                  className="p-3 border-2 border-red-200 rounded-2xl text-left bg-blue-50 hover:border-red-500 transition-all"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <div className="w-4 h-4 rounded-full bg-white border border-red-200"></div>
                  </div>
                  <span className="font-sans font-bold text-xs text-slate-800">Healthcare</span>
                </button>

                {/* Education */}
                <button
                  onClick={() => setFormMeta({ themeConfig: { fontFamily: "font-comic", backgroundColor: "bg-orange-50", accentColor: "border-orange-500", borderStyle: "border-4", rounded: "rounded-xl", formBgColor: "#fff7ed", fieldBgColor: "rgba(255,255,255,0.95)", textColor: "#9a3412", glassmorphism: true, backgroundPattern: "education" } })}
                  className="p-3 border-4 border-orange-200 rounded-xl text-left transition-all hover:border-orange-500 bg-orange-50"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-md bg-orange-500"></div>
                    <div className="w-4 h-4 rounded-md bg-white border-2 border-orange-200"></div>
                  </div>
                  <span className="font-comic font-bold text-xs text-orange-800">Education</span>
                </button>

                {/* Playful */}
                <button
                  onClick={() => setFormMeta({ themeConfig: { fontFamily: "font-balsamiq", backgroundColor: "bg-[#fdf4ff]", accentColor: "border-[#d946ef]", borderStyle: "border-2 border-dashed", rounded: "rounded-full", formBgColor: "#fdf4ff", fieldBgColor: "rgba(255,255,255,0.6)", textColor: "#701a75", glassmorphism: true, backgroundPattern: "playful" } })}
                  className="p-3 border-2 border-dashed border-[#d946ef] rounded-3xl text-left bg-[#fdf4ff] hover:bg-[#fae8ff] transition-all"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#d946ef]"></div>
                    <div className="w-4 h-4 rounded-full bg-white border border-[#d946ef]"></div>
                  </div>
                  <span className="font-balsamiq text-xs text-[#701a75] font-bold">Playful</span>
                </button>

                {/* Business */}
                <button
                  onClick={() => setFormMeta({ themeConfig: { fontFamily: "font-sans", backgroundColor: "bg-gray-100", accentColor: "border-blue-700", borderStyle: "border-2", rounded: "rounded-sm", formBgColor: "#ffffff", fieldBgColor: "#f8fafc", textColor: "#0f172a", glassmorphism: false, backgroundPattern: "business" } })}
                  className="p-3 border-2 border-blue-200 rounded-sm text-left bg-gray-50 hover:border-blue-500 transition-all"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-sm bg-blue-700"></div>
                    <div className="w-4 h-4 rounded-sm bg-white border-2 border-blue-200"></div>
                  </div>
                  <span className="font-sans font-bold text-xs text-slate-800">Business</span>
                </button>

                {/* Nature */}
                <button
                  onClick={() => setFormMeta({ themeConfig: { fontFamily: "font-comic", backgroundColor: "bg-green-50", accentColor: "border-green-600", borderStyle: "border-2", rounded: "rounded-2xl", formBgColor: "#f0fdf4", fieldBgColor: "rgba(255,255,255,0.8)", textColor: "#14532d", glassmorphism: true, backgroundPattern: "nature" } })}
                  className="p-3 border-2 border-green-200 rounded-2xl text-left bg-green-50 hover:border-green-500 transition-all"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-full bg-green-600"></div>
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-green-200"></div>
                  </div>
                  <span className="font-comic font-bold text-xs text-green-800">Nature</span>
                </button>

                {/* Food */}
                <button
                  onClick={() => setFormMeta({ themeConfig: { fontFamily: "font-balsamiq", backgroundColor: "bg-red-50", accentColor: "border-orange-500", borderStyle: "border-4", rounded: "rounded-xl", formBgColor: "#fef2f2", fieldBgColor: "#ffffff", textColor: "#7f1d1d", glassmorphism: false, backgroundPattern: "food" } })}
                  className="p-3 border-4 border-red-200 rounded-xl text-left bg-red-50 hover:border-orange-500 transition-all"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-md bg-orange-500"></div>
                    <div className="w-4 h-4 rounded-md bg-white border-4 border-red-200"></div>
                  </div>
                  <span className="font-balsamiq font-bold text-xs text-red-800">Food</span>
                </button>
              </div>
            </div>

            {/* Customization */}
            <div className="pt-6 border-t border-dashed border-gray-200">
              <h4 className="font-balsamiq font-bold text-gray-900 mb-4 flex items-center gap-2"><Paintbrush className="w-4 h-4 text-purple-500" /> Custom Styling</h4>

              <div className="space-y-4">

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Form Background Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={themeConfig?.formBgColor || "#FCFBF8"}
                      onChange={(e) => setFormMeta({ themeConfig: { ...themeConfig!, formBgColor: e.target.value } })}
                      className="w-10 h-10 p-1 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-700 uppercase">{themeConfig?.formBgColor || "#FCFBF8"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Field Background Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={themeConfig?.fieldBgColor || "#ffffff"}
                      onChange={(e) => setFormMeta({ themeConfig: { ...themeConfig!, fieldBgColor: e.target.value } })}
                      className="w-10 h-10 p-1 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-700 uppercase">{themeConfig?.fieldBgColor || "#ffffff"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={themeConfig?.textColor || "#333333"}
                      onChange={(e) => setFormMeta({ themeConfig: { ...themeConfig!, textColor: e.target.value } })}
                      className="w-10 h-10 p-1 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-700 uppercase">{themeConfig?.textColor || "#333333"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Font Style</label>
                  <select
                    value={themeConfig?.fontFamily || "font-balsamiq"}
                    onChange={(e) => setFormMeta({ themeConfig: { ...themeConfig!, fontFamily: e.target.value } })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300"
                  >
                    <option value="font-balsamiq">Balsamiq (Marker)</option>
                    <option value="font-comic">Comic (Handwriting)</option>
                    <option value="font-sans">Inter (Modern)</option>
                    <option value="font-mono">Monospace (Code)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Border Style</label>
                  <select
                    value={themeConfig?.borderStyle || "border-2"}
                    onChange={(e) => setFormMeta({ themeConfig: { ...themeConfig!, borderStyle: e.target.value } })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300"
                  >
                    <option value="border-2">Thick Solid</option>
                    <option value="border">Thin Solid</option>
                    <option value="border-2 border-dashed">Dashed</option>
                    <option value="border-0 shadow-sm">No Border (Shadow Only)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Corners</label>
                  <div className="flex gap-2">
                    {["rounded-none", "rounded-md", "rounded-2xl", "rounded-full"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setFormMeta({ themeConfig: { ...themeConfig!, rounded: r } })}
                        className={`flex-1 py-2 border ${themeConfig?.rounded === r ? 'border-purple-400 bg-purple-50 text-purple-600 shadow-sm' : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'} ${r} transition-all flex justify-center`}
                      >
                        <div className={`w-4 h-4 border-2 border-current ${r}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        ) : activeTab === "settings" ? (
          /* SETTINGS TAB */
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 font-comic">
            <div>
              <h4 className="font-balsamiq font-bold text-gray-900 mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-purple-500" /> Form Settings</h4>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2">Success Message</label>
                  <textarea
                    value={formSettings?.successMessage || ""}
                    onChange={(e) => setFormMeta({ formSettings: { ...formSettings!, successMessage: e.target.value } })}
                    rows={3}
                    placeholder="Thank You! Your response has been recorded."
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-purple-300 focus:outline-none transition-all resize-none text-gray-900 font-bold"
                  />
                  <p className="text-xs text-gray-400 mt-1 font-sans">Message shown to users after they submit the form.</p>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-dashed border-gray-200 pt-6">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block">Accept Responses</label>
                    <p className="text-xs text-gray-400 mt-1 font-sans">Turn off to stop accepting new submissions.</p>
                  </div>
                  <button onClick={() => setFormMeta({ formSettings: { ...formSettings!, isAcceptingResponses: formSettings?.isAcceptingResponses === false ? true : false } })}
                    className={`w-12 h-6 rounded-full transition-colors relative border border-gray-200 ${formSettings?.isAcceptingResponses !== false ? "bg-emerald-400 border-emerald-500" : "bg-red-400 border-red-500"}`}>
                    <motion.div animate={{ x: formSettings?.isAcceptingResponses !== false ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm border border-gray-200" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-dashed border-gray-200 pt-6">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block">Allow Multiple Responses</label>
                    <p className="text-xs text-gray-400 mt-1 font-sans">If disabled, users can only submit once.</p>
                  </div>
                  <button onClick={() => setFormMeta({ formSettings: { ...formSettings!, allowMultipleResponses: !formSettings?.allowMultipleResponses } })}
                    className={`w-12 h-6 rounded-full transition-colors relative border border-gray-200 ${formSettings?.allowMultipleResponses ? "bg-emerald-400 border-emerald-500" : "bg-gray-100"}`}>
                    <motion.div animate={{ x: formSettings?.allowMultipleResponses ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm border border-gray-200" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
