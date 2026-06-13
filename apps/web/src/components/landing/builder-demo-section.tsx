"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Type, AlignLeft, Mail, Hash, Calendar, CheckSquare, List, GripVertical, FileUp, Phone, Minus, Check, Star, Pencil } from "lucide-react";

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

  return (
    <section id="builder-demo" className="py-20 px-6 bg-[#FCFBF8]" ref={ref}>
      <div className="max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-12 items-start justify-between">

        {/* Left Text Content (matching the first screenshot) */}
        <div className="lg:w-[350px] shrink-0 pt-10">
          <ul className="space-y-4 mb-10 font-comic font-bold text-[#333333]">
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Drag & drop builder</li>
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> 10+ field types</li>
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Conditional logic</li>
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Custom themes</li>
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Real-time preview</li>
          </ul>
        </div>

        {/* Builder Interface Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 w-full bg-white rounded-2xl border-2 border-[#333333] shadow-sticker overflow-hidden flex flex-col h-[700px]"
        >
          {/* Mac-style Window Top Bar */}
          <div className="h-10 border-b-2 border-[#333333] bg-[#FCFBF8] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full border border-[#333333] bg-red-400"></div>
            <div className="w-3 h-3 rounded-full border border-[#333333] bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full border border-[#333333] bg-green-400"></div>
          </div>

          <div className="flex flex-1 overflow-hidden">

            {/* Left Sidebar (Add Fields) */}
            <div className="w-64 border-r-2 border-[#333333] bg-white flex flex-col">
              <div className="p-4">
                <h3 className="font-balsamiq font-bold text-lg mb-1">Add Fields</h3>
                <p className="font-comic text-xs text-gray-500">Drag and drop to add</p>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {fieldTypes.map((type, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 border border-gray-200 rounded-lg cursor-grab hover:border-[#8B5CF6] hover:bg-[#F3E8FF] transition-colors group">
                    <type.icon className="w-4 h-4 text-[#8B5CF6] group-hover:text-[#7C3AED]" />
                    <span className="font-comic font-bold text-sm text-[#333333]">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Canvas */}
            <div className="flex-1 bg-dot-grid bg-[#FCFBF8] p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h2 className="font-balsamiq text-3xl font-bold text-[#333333] flex items-center gap-2">
                    Anime Convention Registration <Pencil className="w-4 h-4 text-[#8B5CF6]" />
                  </h2>
                  <p className="font-comic text-gray-500 mt-2">Tell us about yourself! Let's make this event unforgettable.</p>
                </div>

                <div className="space-y-4">
                  {/* Field 1 (Active) */}
                  <div className="bg-white border-2 border-[#8B5CF6] rounded-xl p-5 shadow-[4px_4px_0px_#E9D5FF] relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E9D5FF] text-[#8B5CF6] flex items-center justify-center font-bold text-sm font-comic">1</span>
                        <span className="font-balsamiq font-bold text-[#333333]">What's your name?</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 font-comic text-xs">
                        <span>Short Text</span>
                        <div className="flex gap-2">
                          <button className="hover:text-gray-600"><GripVertical className="w-4 h-4" /></button>
                          <button className="hover:text-red-500">×</button>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg px-3 py-2 bg-[#FCFBF8]">
                      <span className="font-comic text-sm text-gray-400">Type your answer here...</span>
                    </div>
                  </div>

                  {/* Field 2 */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center font-bold text-sm font-comic">2</span>
                        <span className="font-balsamiq font-bold text-[#333333]">Your email address</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 font-comic text-xs">
                        <span>Email</span>
                        <button>≡</button>
                        <button>×</button>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg px-3 py-2 bg-[#FCFBF8]">
                      <span className="font-comic text-sm text-gray-400">you@example.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar (Settings) */}
            <div className="w-72 border-l-2 border-[#333333] bg-white flex flex-col p-5 overflow-y-auto">
              <h3 className="font-balsamiq font-bold text-lg mb-6">Field Settings</h3>

              <div className="bg-[#E9D5FF] border border-[#8B5CF6] rounded-xl p-3 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Type className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="font-balsamiq font-bold text-sm text-[#333333]">What's your name?</span>
                </div>
                <span className="font-comic text-xs text-[#8B5CF6] font-bold">Short Text</span>
              </div>

              <div className="space-y-5 font-comic">
                <div>
                  <label className="block text-sm font-bold text-[#333333] mb-1">Field Label</label>
                  <input type="text" value="What's your name?" readOnly className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#333333] mb-1">Placeholder</label>
                  <input type="text" value="Type your answer here..." readOnly className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-500" />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked readOnly className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                    <span className="text-sm font-bold">Required</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked readOnly className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                    <span className="text-sm font-bold">Show on summary</span>
                  </label>
                </div>

                {/* Tooltip Note */}
                <div className="mt-8 sticky-note">
                  <div className="flex items-center gap-1 mb-1 text-yellow-800">
                    <span className="font-bold font-balsamiq">💡 Tip</span>
                  </div>
                  <p className="text-xs text-yellow-900 leading-snug">Hover over a field in the form to edit it quickly!</p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
