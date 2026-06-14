"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function FormViewTracker({ formSlug }: { formSlug: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per mount to prevent double counting in strict mode
    if (!tracked.current && formSlug) {
      tracked.current = true;
      
      // Increment view count in background (fire and forget)
      // Done client-side to avoid counting bots and server-side renders
      supabase.rpc('increment_form_views', { form_slug: formSlug }).then(({ error }) => {
        if (error) console.error("Failed to increment views:", error);
      });
    }
  }, [formSlug]);

  return null; // Invisible monitoring component
}
