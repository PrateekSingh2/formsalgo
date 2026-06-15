"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, Send } from "lucide-react";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { toast } from "sonner";

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIGenerateModal({ isOpen, onClose }: AIGenerateModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setFields, setFormMeta } = useFormBuilderStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate form");
      }

      if (data.fields && Array.isArray(data.fields)) {
        // Overwrite fields
        setFields(data.fields);
        setFormMeta({ isDirty: true });
        toast.success("✨ Form generated successfully!");
        setPrompt("");
        onClose();
      } else {
        throw new Error("Invalid format received from AI");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during generation");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] max-w-lg w-full flex flex-col overflow-hidden relative"
          >
            {/* Background Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#E9D5FF] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

            <div className="p-6 border-b-2 border-[#333333] flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] border-2 border-[#8B5CF6] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-balsamiq text-[#333333]">Magic Create</h2>
                  <p className="text-gray-500 font-comic text-xs">Generate a complete form with AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-[#333333]"
              >
                <X className="w-5 h-5 text-[#333333]" />
              </button>
            </div>

            <div className="p-8 bg-[#FCFBF8] relative z-10">
              <label className="block text-sm font-bold text-[#333333] mb-3 font-sans">
                What kind of form do you want to build?
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A patient intake form for my dental clinic, including medical history and contact info."
                  className="w-full h-32 px-4 py-3 bg-white border-2 border-[#333333] rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/30 shadow-[2px_2px_0px_#333333] font-comic text-sm"
                  disabled={loading}
                />
                <div className="absolute bottom-3 right-3 text-xs font-bold text-gray-400">
                  {prompt.length} / 500
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading || prompt.length < 5}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#333333]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Generate Form
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-[#8B5CF6]" />
                </motion.div>
                <p className="mt-4 font-balsamiq font-bold text-lg text-[#333333] animate-pulse">
                  AI is crafting your form...
                </p>
                <p className="text-sm font-comic text-gray-500 mt-2">This usually takes about 5 seconds.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
