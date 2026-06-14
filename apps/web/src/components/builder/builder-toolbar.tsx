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
    <div className="h-14 border-b-2 border-[#333333] bg-[#F5F3FF] px-4 flex items-center justify-between shrink-0 relative z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="p-1.5 bg-white rounded-lg border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:-translate-y-px hover:shadow-[3px_3px_0px_#333333] active:translate-y-px active:shadow-none text-[#333333] transition-all">
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
        </Link>
        <div className="flex items-center gap-2 group px-2 py-1 bg-[#FEF3C7] border-2 border-[#333333] shadow-[2px_2px_0px_#333333] rounded-lg transform -rotate-1 transition-colors">
          <Sparkles className="w-3 h-3 text-[#F59E0B] stroke-[2]" />
          <input type="text" value={title} onChange={(e) => setFormMeta({ title: e.target.value })}
            className="text-sm font-balsamiq font-black text-[#333333] bg-transparent border-none outline-none focus:ring-0 max-w-[200px] placeholder:text-gray-400" placeholder="Untitled Form" />
        </div>
      </div>

      {/* Center — Undo/Redo */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border-2 border-[#333333] shadow-[2px_2px_0px_#333333]">
        <motion.button whileTap={{ scale: 0.9 }} onClick={undo} disabled={historyIndex <= 0}
          className="p-1.5 rounded-md hover:bg-[#E9D5FF] text-[#333333] disabled:opacity-30 transition-all font-bold">
          <Undo2 className="w-4 h-4 stroke-[2]" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={redo} disabled={historyIndex >= history.length - 1}
          className="p-1.5 rounded-md hover:bg-[#D1FAE5] text-[#333333] disabled:opacity-30 transition-all font-bold">
          <Redo2 className="w-4 h-4 stroke-[2]" />
        </motion.button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end mr-1 bg-white px-2 py-0.5 border-2 border-[#333333] rounded-md shadow-[1px_1px_0px_#333333] transform rotate-1">
          {lastSaved && !isDirty && (
            <span className="text-[9px] font-comic font-bold text-[#10B981]">Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          )}
          {isDirty && (
             <span className="text-[9px] font-comic font-bold text-[#F59E0B] flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Unsaved</span>
          )}
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-balsamiq font-black rounded-lg border-2 border-[#333333] bg-[#E9D5FF] text-[#333333] shadow-[2px_2px_0px_#333333] hover:-translate-y-px hover:shadow-[3px_3px_0px_#333333] active:translate-y-px active:shadow-none transition-all group"
        >
          <Sparkles className="w-3 h-3 stroke-[2]" />
          AI Create
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPreviewMode(!previewMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-balsamiq font-black rounded-lg border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:-translate-y-px hover:shadow-[3px_3px_0px_#333333] active:translate-y-px active:shadow-none transition-all ${previewMode ? "bg-[#8B5CF6] text-white" : "bg-white text-[#333333]"}`}>
          {previewMode ? <EyeOff className="w-3 h-3 stroke-[2]" /> : <Eye className="w-3 h-3 stroke-[2]" />}
          {previewMode ? "Edit" : "Preview"}
        </motion.button>
        
        {formSlug && (
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 rounded-lg border-2 border-[#333333] bg-white hover:bg-[#D1FAE5] text-[#333333] shadow-[2px_2px_0px_#333333] hover:-translate-y-px hover:shadow-[3px_3px_0px_#333333] active:translate-y-px active:shadow-none transition-all group"
            title="Share Public Link"
          >
            <Share2 className="w-3 h-3 stroke-[2]" />
          </motion.button>
        )}

        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => handlePublish(false)}
          disabled={isPublishing}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-balsamiq font-black rounded-lg border-2 border-[#333333] shadow-[2px_2px_0px_#333333] hover:-translate-y-px hover:shadow-[3px_3px_0px_#333333] active:translate-y-px active:shadow-none transition-all disabled:opacity-70 ${status === 'Published' && !isDirty ? 'bg-[#34D399] text-[#333333]' : 'bg-[#F59E0B] text-[#333333]'}`}>
          {isPublishing && !autoSaveTimerRef.current ? <Loader2 className="w-3 h-3 animate-spin stroke-[2]" /> : <Save className="w-3 h-3 stroke-[2]" />}
          {status === 'Published' && !isDirty ? "Published" : isDirty ? "Save & Publish" : "Publish"}
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
