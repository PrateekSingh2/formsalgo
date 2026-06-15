// ============================================================================
// BUILDER TOOLBAR — Top bar
// ============================================================================

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { ArrowLeft, Undo2, Redo2, Eye, EyeOff, Save, Sparkles, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveFormToDatabase } from "@/lib/supabase-actions";
import { useAuth } from "@/providers/auth-provider";
import { QRShareModal } from "./qr-share-modal";
import { AIGenerateModal } from "./ai-generate-modal";

export function BuilderToolbar() {
  const { title, setFormMeta, previewMode, setPreviewMode, undo, redo, historyIndex, history, isDirty, status, fields, description, layoutType, themeConfig, formSettings, formId, formSlug } = useFormBuilderStore();
  const { user } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const handlePublish = async (isAutoSave = false) => {
    // Prevent multiple parallel saves
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    
    if (!isAutoSave) setIsPublishing(true);
    
    try {
      const result = await saveFormToDatabase(
        user?.uid || null,
        formId,
        title,
        description,
        layoutType,
        themeConfig,
        formSettings,
        fields
      );
      
      setFormMeta({ status: "Published", isDirty: false, formSlug: result.slug, formId: result.formId });
      setLastSaved(new Date());
      if (!isAutoSave) {
        toast.success("Form successfully published!");
      }
    } catch (error) {
      console.error(error);
      if (!isAutoSave) {
        toast.error("Failed to publish form. Please try again.");
      }
    } finally {
      isSavingRef.current = false;
      if (!isAutoSave) setIsPublishing(false);
    }
  };

  // Autosave mechanism
  useEffect(() => {
    if (isDirty && user?.uid) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Auto-save after 3 seconds of inactivity
      autoSaveTimerRef.current = setTimeout(() => {
        handlePublish(true);
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [isDirty, fields, title, themeConfig, user]);

  return (
    <div className="h-16 border-b border-white/50 bg-white/70 backdrop-blur-xl px-2 sm:px-4 flex items-center justify-between shrink-0 relative z-20 shadow-sm overflow-x-auto hide-scrollbar">
      {/* Left */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <Link href="/dashboard" className="p-1.5 sm:p-2 bg-white rounded-[1rem_0.5rem_1rem_0.5rem] border-2 border-dashed border-gray-300 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-purple-300 active:translate-y-0 text-gray-600 transition-all">
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 group px-2 sm:px-3 py-1.5 bg-amber-50 border-2 border-dashed border-amber-200 shadow-sm rounded-[0.5rem_1rem_0.5rem_1rem] transform -rotate-1 hover:rotate-0 transition-all">
          <Sparkles className="w-4 h-4 text-amber-500 stroke-[2] shrink-0" />
          <input type="text" value={title} onChange={(e) => setFormMeta({ title: e.target.value })}
            className="text-xs sm:text-sm font-balsamiq font-black text-gray-900 bg-transparent border-none outline-none focus:ring-0 w-24 sm:w-auto max-w-[100px] sm:max-w-[200px] placeholder:text-gray-400" placeholder="Untitled Form" />
        </div>
      </div>

      {/* Center — Undo/Redo */}
      <div className="hidden md:flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
        <motion.button whileTap={{ scale: 0.9 }} onClick={undo} disabled={historyIndex <= 0}
          className="p-1.5 rounded-xl hover:bg-purple-50 text-gray-700 disabled:opacity-30 transition-all font-bold">
          <Undo2 className="w-4 h-4 stroke-[2]" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={redo} disabled={historyIndex >= history.length - 1}
          className="p-1.5 rounded-xl hover:bg-emerald-50 text-gray-700 disabled:opacity-30 transition-all font-bold">
          <Redo2 className="w-4 h-4 stroke-[2]" />
        </motion.button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="hidden lg:flex flex-col items-end mr-2 bg-white px-3 py-1 border border-gray-200 rounded-[1rem_0.5rem_1rem_0.5rem] shadow-sm transform rotate-1">
          {lastSaved && !isDirty && (
            <span className="text-[10px] font-comic font-bold text-emerald-500">Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          )}
          {isDirty && (
             <span className="text-[10px] font-comic font-bold text-amber-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Unsaved</span>
          )}
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-2 text-xs font-balsamiq font-black rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 text-purple-700 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-100 transition-all group"
        >
          <Sparkles className="w-4 h-4 stroke-[2]" />
          <span className="hidden md:inline">AI Create</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPreviewMode(!previewMode)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-2 text-xs font-balsamiq font-black rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all ${previewMode ? "bg-purple-500 text-white border border-purple-600" : "bg-white text-gray-700 border border-gray-200"}`}>
          {previewMode ? <EyeOff className="w-4 h-4 stroke-[2]" /> : <Eye className="w-4 h-4 stroke-[2]" />}
          <span className="hidden sm:inline">{previewMode ? "Edit" : "Preview"}</span>
        </motion.button>
        
        {formSlug && (
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 rounded-2xl border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200 transition-all group"
            title="Share Public Link"
          >
            <Share2 className="w-4 h-4 stroke-[2]" />
          </motion.button>
        )}

        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => handlePublish(false)}
          disabled={isPublishing}
          className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3 md:px-5 py-2 text-xs font-balsamiq font-black rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all disabled:opacity-70 ${status === 'Published' && !isDirty ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-purple-500 text-white border border-purple-600 hover:bg-purple-600'}`}>
          {isPublishing && !autoSaveTimerRef.current ? <Loader2 className="w-4 h-4 animate-spin stroke-[2]" /> : <Save className="w-4 h-4 stroke-[2]" />}
          <span className="hidden sm:inline">{status === 'Published' && !isDirty ? "Published" : isDirty ? "Save & Publish" : "Publish"}</span>
        </motion.button>
      </div>

      <QRShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={formSlug ? `${window.location.origin}/f/${formSlug}` : ""} 
      />

      <AIGenerateModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
}
