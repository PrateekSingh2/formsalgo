// ============================================================================
// BUILDER TOOLBAR — Top bar
// ============================================================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { ArrowLeft, Undo2, Redo2, Eye, EyeOff, Save, Sparkles, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveFormToDatabase } from "@/lib/supabase-actions";
import { useAuth } from "@/providers/auth-provider";

export function BuilderToolbar() {
  const { title, setFormMeta, previewMode, setPreviewMode, undo, redo, historyIndex, history, isDirty, status, fields, description, layoutType, themeConfig, formSettings, formId, formSlug } = useFormBuilderStore();
  const { user } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
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
      toast.success("Form successfully published!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish form. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between shrink-0 shadow-xs">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 text-muted hover:text-heading transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <input type="text" value={title} onChange={(e) => setFormMeta({ title: e.target.value })}
            className="text-sm font-semibold text-[#333333] bg-transparent border-none outline-none focus:ring-0 max-w-[200px]" placeholder="Untitled Form" />
        </div>
      </div>

      {/* Center — Undo/Redo */}
      <div className="flex items-center gap-1">
        <motion.button whileTap={{ scale: 0.9 }} onClick={undo} disabled={historyIndex <= 0}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-colors">
          <Undo2 className="w-4 h-4" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={redo} disabled={historyIndex >= history.length - 1}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-colors">
          <Redo2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPreviewMode(!previewMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${previewMode ? "bg-[#8B5CF6] text-white" : "bg-gray-100 text-gray-600 hover:bg-[#E9D5FF] hover:text-[#8B5CF6]"}`}>
          {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {previewMode ? "Edit" : "Preview"}
        </motion.button>
        
        {formSlug && (
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => {
              const url = `${window.location.origin}/f/${formSlug}`;
              navigator.clipboard.writeText(url);
              toast.success("Public link copied to clipboard!");
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Share Public Link"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        )}

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handlePublish}
          disabled={isPublishing}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-70 ${status === 'Published' && !isDirty ? 'bg-[#34D399] text-[#065F46]' : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'}`}>
          {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {isPublishing ? "Saving..." : status === 'Published' && !isDirty ? "Published" : isDirty ? "Save & Publish" : "Publish"}
        </motion.button>
      </div>
    </div>
  );
}
