// ============================================================================
// FORM BUILDER PAGE — /builder
// ============================================================================

"use client";

import { motion } from "framer-motion";
import { FieldPalette } from "@/components/builder/field-palette";
import { BuilderCanvas } from "@/components/builder/builder-canvas";
import { FieldConfig } from "@/components/builder/field-config";
import { BuilderToolbar } from "@/components/builder/builder-toolbar";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { AuthGuard } from "@/components/auth-guard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchFormById } from "@/lib/supabase-actions";
import { Loader2 } from "lucide-react";
import { FORM_TEMPLATES } from "@/lib/templates";
import { AnimatedBackground } from "@/components/builder/animated-background";

export default function BuilderPage() {
  const { previewMode, themeConfig, loadForm, formId } = useFormBuilderStore();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const templateId = searchParams.get("template");
  const [loading, setLoading] = useState(!!id && id !== formId);

  useEffect(() => {
    async function load() {
      if (id && id !== formId) {
        try {
          const { form, fields } = await fetchFormById(id);
          loadForm(
            form.id,
            form.title,
            form.description || "",
            fields as any // Hydrate fields
          );
        } catch (error) {
          console.error("Failed to load form:", error);
        }
      } else if (templateId && !id && !formId) {
        // Load template
        const template = FORM_TEMPLATES.find(t => t.id === templateId);
        if (template) {
          useFormBuilderStore.getState().resetStore();
          loadForm(
            "", // New form
            template.title,
            template.description,
            template.fields as any
          );
          // Force apply theme config
          useFormBuilderStore.getState().setFormMeta({ themeConfig: template.themeConfig as any });
        }
      } else if (!id && !templateId && !formId) {
        // Brand new form, check for global defaults
        const saved = localStorage.getItem("formforge_global_defaults");
        if (saved) {
          const defaults = JSON.parse(saved);
          useFormBuilderStore.getState().setFormMeta({
            themeConfig: {
              fontFamily: defaults.fontFamily,
              textColor: defaults.textColor,
              backgroundColor: defaults.backgroundColor,
              formBgColor: "#FCFBF8",
              fieldBgColor: "#ffffff",
              accentColor: "border-[#8B5CF6]",
              borderStyle: "border-2",
              rounded: "rounded-2xl"
            },
            formSettings: {
              successMessage: defaults.successMessage,
              allowMultipleResponses: true
            }
          });
        }
      }
      setLoading(false);
    }
    load();
  }, [id, templateId, formId, loadForm]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  const pattern = themeConfig?.backgroundPattern;
  const formBg = themeConfig?.formBgColor || "#FCFBF8";

  // Background styling mapping
  const bgStyles: any = {};
  if (["programmer", "healthcare", "education", "playful", "business", "nature", "food"].includes(pattern || "")) {
    if (pattern === "programmer") bgStyles.backgroundColor = "#0f172a";
    if (pattern === "healthcare") bgStyles.backgroundColor = "#f0f9ff";
    if (pattern === "education") bgStyles.backgroundColor = "#fff7ed";
    if (pattern === "playful") bgStyles.backgroundColor = "#fdf4ff";
    if (pattern === "business") bgStyles.backgroundColor = "#ffffff";
    if (pattern === "nature") bgStyles.backgroundColor = "#f0fdf4";
    if (pattern === "food") bgStyles.backgroundColor = "#fef2f2";
  } else if (pattern === "aurora") {
    bgStyles.background = "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)";
  } else if (pattern === "zen") {
    bgStyles.background = "linear-gradient(120deg, #ecfccb 0%, #d9f99d 100%)";
  } else if (pattern === "cybergrid") {
    bgStyles.backgroundColor = "#000000";
    bgStyles.backgroundImage = "linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)";
    bgStyles.backgroundSize = "20px 20px";
    bgStyles.backgroundPosition = "center center";
  } else if (pattern === "neo-grid") {
    bgStyles.backgroundColor = formBg;
    bgStyles.backgroundImage = "radial-gradient(#000 1px, transparent 1px)";
    bgStyles.backgroundSize = "20px 20px";
  } else {
    bgStyles.backgroundColor = formBg;
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="h-screen flex flex-col bg-[#FCFBF8] relative overflow-hidden">
        {/* Notebook Paper Dots Pattern - Only show if no custom pattern */}
        {!pattern && (
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333333 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        )}
        
        <BuilderToolbar />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {!previewMode && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-64 border-r border-gray-200 bg-white overflow-y-auto shrink-0 z-20 shadow-xl"
          >
            <FieldPalette />
          </motion.aside>
        )}

        <main className="flex-1 overflow-y-auto p-8 transition-colors relative" style={bgStyles}>
          {pattern && <AnimatedBackground pattern={pattern} />}
          <div className="relative z-10">
            <BuilderCanvas />
          </div>
        </main>

        {!previewMode && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-72 border-l border-gray-200 bg-white overflow-y-auto shrink-0"
          >
            <FieldConfig />
          </motion.aside>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}
