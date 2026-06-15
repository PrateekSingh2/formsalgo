"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Type, AlignLeft, Mail, Hash, Calendar, CheckSquare, List, GripVertical, FileUp, Phone, Minus, Check, Star, Pencil, Sparkles, Trash2 } from "lucide-react";

const fieldTypes = [
  { icon: Type, label: "Short Text" },
  { icon: AlignLeft, label: "Long Text" },
  { icon: Mail, label: "Email" },
  { icon: Hash, label: "Number" },
  { icon: Calendar, label: "Date" },
  { icon: CheckSquare, label: "Single Select" },
  { icon: List, label: "Multi Select" },
  { icon: Check, label: "Checkbox" },
  { icon: Star, label: "Rating" },
  { icon: FileUp, label: "File Upload" },
  { icon: Phone, label: "Phone" },
  { icon: Minus, label: "Divider" },
];

export function BuilderDemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [fields, setFields] = useState([
    { id: 1, type: "Short Text", label: "What's your name?", placeholder: "Type your answer here..." },
    { id: 2, type: "Email", label: "Your email address", placeholder: "you@example.com" }
  ]);
  const [activeField, setActiveField] = useState(1);

  const handleAddField = (typeLabel: string) => {
    const newId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
    const newField = {
      id: newId,
      type: typeLabel,
      label: `New ${typeLabel} Field`,
      placeholder: "Enter value..."
    };
    setFields([...fields, newField]);
    setActiveField(newId);
  };

  const activeFieldData = fields.find(f => f.id === activeField);

  const handleUpdateActiveField = (key: string, value: string) => {
    setFields(fields.map(f => f.id === activeField ? { ...f, [key]: value } : f));
  };

  const handleDeleteField = (id: number) => {
    const newFields = fields.filter(f => f.id !== id);
    setFields(newFields);
    if (activeField === id) {
      setActiveField(newFields.length > 0 ? newFields[newFields.length - 1].id : 0);
    }
  };

  return (
    <section id="builder-demo" className="py-24 px-6 bg-gray-50 relative overflow-hidden border-t border-gray-200" ref={ref}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-15%] left-[20%] w-[45%] h-[45%] bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[-5%] left-[30%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-rose-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex px-6 py-2 bg-white border-2 border-purple-300 rounded-2xl shadow-sm mb-6 items-center gap-2 transform rotate-1"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="font-comic font-bold text-purple-800 tracking-wide uppercase text-sm">Experience the Builder</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-balsamiq text-4xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
          >
            Build at the <span className="text-gray-900">speed of thought</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="relative mx-auto rounded-xl border border-white/50 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden"
        >
          {/* Window Chrome */}
          <div className="bg-white/50 backdrop-blur-md border-b border-gray-200/50 p-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="font-comic text-xs font-bold text-gray-400 bg-white px-4 py-1 rounded-full border border-gray-200 shadow-sm">formforge.app/builder</div>
            <div className="w-16" /> {/* Spacer */}
          </div>

          <div className="relative flex flex-col md:flex-row min-h-[600px]">
            {/* Interactive Prompt Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, rotate: -10 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: -4 } : {}}
              transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
              className="absolute top-2 left-4 md:left-64 md:top-2 md:translate-x-4 z-30 flex flex-col items-center pointer-events-none"
            >
              <div className="bg-[#FFF1F2] border-2 border-rose-300 text-rose-800 px-3 py-2 md:p-4 rounded-xl shadow-lg transform">
                <p className="font-balsamiq font-black text-sm md:text-xl mb-0 md:mb-1">Hey visitors! 👋</p>
                <p className="font-comic font-bold text-xs md:text-sm">Add fields and click them!</p>
              </div>
              {/* Arrow pointing to sidebar */}
              <svg className="w-8 h-8 md:w-10 md:h-10 text-rose-400 mt-1 transform rotate-[160deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.div>
            {/* Left Sidebar (Add Fields) */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200/50 bg-white/40 flex flex-col z-10">
              <div className="p-4 border-b border-gray-200/50 bg-white/50">
                <h3 className="font-comic font-bold text-lg text-gray-900">Add Fields</h3>
              </div>
              <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto px-4 py-4 gap-2 md:space-y-2 pb-6 md:pb-4 scrollbar-hide z-40">
                {fieldTypes.map((type, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAddField(type.label)}
                    className="flex-shrink-0 flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-purple-200 cursor-pointer transition-all focus:outline-none"
                  >
                    <type.icon className="w-4 h-4 text-purple-500" />
                    <span className="font-comic text-sm font-bold text-gray-700 whitespace-nowrap">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center Canvas */}
            <div className="flex-1 bg-white p-8 relative overflow-hidden flex flex-col items-center">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

              <div className="max-w-md w-full relative z-10 mt-10">
                <div className="text-center mb-8 bg-[#FEF3C7] p-6 rounded-2xl border border-yellow-200 shadow-sm transform rotate-1">
                  <h2 className="font-balsamiq text-3xl font-black text-gray-900 mb-2">Customer Feedback</h2>
                  <p className="font-comic text-gray-600 font-bold">We'd love to hear your thoughts!</p>
                </div>

                <div className="space-y-6 w-full max-w-md">
                  <AnimatePresence>
                    {fields.map((field, index) => {
                      const isActive = activeField === field.id;
                      return (
                        <motion.div 
                          key={field.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={() => setActiveField(field.id)}
                          className={`bg-white border-2 rounded-xl p-5 relative cursor-pointer transition-all ${
                            isActive ? 'border-[#8B5CF6] shadow-md z-10' : 'border-gray-200 hover:border-gray-300 shadow-sm'
                          } ${index % 2 === 1 && !isActive ? 'transform -rotate-1' : ''}`}
                        >
                          {isActive && (
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-[#8B5CF6] text-white p-1 rounded shadow-sm">
                              <GripVertical className="w-4 h-4" />
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm font-comic ${
                                isActive ? 'bg-[#F3E8FF] text-[#8B5CF6]' : 'bg-gray-100 text-gray-600'
                              }`}>{index + 1}</span>
                              <span className="font-comic font-bold text-gray-900">{field.label}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 font-comic text-xs">
                              <span>{field.type}</span>
                            </div>
                          </div>
                          <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 flex justify-between items-center">
                            <span className="font-comic text-sm font-bold text-gray-400">{field.placeholder}</span>
                            {isActive && (
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id); }} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {fields.length === 0 && (
                    <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                      <p className="font-comic font-bold text-gray-500">Drag or click a field from the left to add it here!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar (Settings) */}
            <div className="hidden lg:flex w-72 border-l border-gray-100 bg-gray-50 p-6 flex-col overflow-y-auto">
              <h3 className="font-comic font-bold text-lg text-gray-900 mb-6 bg-white px-3 py-1 border border-gray-200 rounded-lg shadow-sm inline-block">Field Settings</h3>
              
              {activeFieldData ? (
                <div className="space-y-5 font-comic">
                  <div>
                    <label className="block text-sm font-comic font-bold text-gray-700 mb-2 uppercase tracking-wide">Field Label</label>
                    <input 
                      type="text" 
                      value={activeFieldData.label} 
                      onChange={(e) => handleUpdateActiveField('label', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-comic font-bold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-comic font-bold text-gray-700 mb-2 uppercase tracking-wide">Placeholder</label>
                    <input 
                      type="text" 
                      value={activeFieldData.placeholder} 
                      onChange={(e) => handleUpdateActiveField('placeholder', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 font-comic font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" 
                    />
                  </div>
                  <div className="space-y-2 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6] w-4 h-4" />
                      <span className="text-sm font-comic font-bold text-gray-700">Required</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6] w-4 h-4" />
                      <span className="text-sm font-comic font-bold text-gray-700">Show on summary</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-100 rounded-xl">
                  <p className="font-comic text-gray-500 font-bold text-sm">Select a field to edit its settings</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
