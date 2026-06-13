// ============================================================================
// SHARED UI COMPONENTS — FormForge Design System
// ============================================================================
// Reusable, styled components that can be used across apps.
// ============================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export from here so apps can import from @formforge/ui
export { cn as classNames };
