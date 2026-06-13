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

export default function BuilderPage() {
  const { previewMode, themeConfig } = useFormBuilderStore();

  return (
    <AuthGuard requireAuth={true}>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <BuilderToolbar />

      <div className="flex-1 flex overflow-hidden">
        {!previewMode && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-64 border-r border-gray-200 bg-white overflow-y-auto shrink-0"
          >
            <FieldPalette />
          </motion.aside>
        )}

        <main className="flex-1 overflow-y-auto p-8 transition-colors" style={{ backgroundColor: themeConfig?.formBgColor || "#FCFBF8" }}>
          <BuilderCanvas />
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
