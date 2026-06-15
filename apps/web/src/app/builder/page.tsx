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
import { useEffect, useState, Suspense } from "react";
import { fetchFormById } from "@/lib/supabase-actions";
import { Loader2, Layers, MonitorSmartphone, SlidersHorizontal } from "lucide-react";
import { FORM_TEMPLATES } from "@/lib/templates";
import { AnimatedBackground } from "@/components/builder/animated-background";

function BuilderContent() {
  const { previewMode, themeConfig, loadForm, formId } = useFormBuilderStore();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const templateId = searchParams.get("template");
  const [loading, setLoading] = useState(!!id && id !== formId);
  const [activeMobileTab, setActiveMobileTab] = useState<"elements" | "canvas" | "properties">("canvas");

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
      <div className="h-screen flex flex-col bg-gray-50 relative overflow-hidden">
        {/* Decorative Background Elements - Only show if no custom pattern */}
        {!pattern && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[10%] left-[-15%] w-[45%] h-[45%] bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-[35%] h-[35%] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
            <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] bg-pink-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
          </div>
        )}
        
        <BuilderToolbar />

      <div className="flex-1 flex overflow-hidden relative z-10 pb-[60px] md:pb-0">
        {!previewMode && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className={`w-full md:w-64 border-r border-white/50 bg-white/70 backdrop-blur-xl overflow-y-auto shrink-0 z-20 shadow-xl ${activeMobileTab === "elements" ? "block" : "hidden md:block"}`}
          >
            <FieldPalette />
          </motion.aside>
        )}

        <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-colors relative ${activeMobileTab === "canvas" ? "block" : "hidden md:block"}`} style={bgStyles}>
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
            className={`w-full md:w-72 border-l border-white/50 bg-white/70 backdrop-blur-xl overflow-y-auto shrink-0 ${activeMobileTab === "properties" ? "block" : "hidden md:block"}`}
          >
            <FieldConfig />
          </motion.aside>
        )}
      </div>
      
      {/* Mobile Bottom Navigation */}
      {!previewMode && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center px-2">
          <button onClick={() => setActiveMobileTab("elements")} className={`flex flex-col items-center justify-center w-full h-full ${activeMobileTab === "elements" ? "text-purple-600" : "text-gray-500"}`}>
            <Layers className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold font-balsamiq">Elements</span>
          </button>
          <button onClick={() => setActiveMobileTab("canvas")} className={`flex flex-col items-center justify-center w-full h-full ${activeMobileTab === "canvas" ? "text-purple-600" : "text-gray-500"}`}>
            <MonitorSmartphone className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold font-balsamiq">Canvas</span>
          </button>
          <button onClick={() => setActiveMobileTab("properties")} className={`flex flex-col items-center justify-center w-full h-full ${activeMobileTab === "properties" ? "text-purple-600" : "text-gray-500"}`}>
            <SlidersHorizontal className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold font-balsamiq">Properties</span>
          </button>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
