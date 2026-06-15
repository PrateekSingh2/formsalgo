"use client";

import React, { useEffect, useState, useRef } from "react";
import { fetchFormBySlug, submitFormResponse } from "@/lib/supabase-actions";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Star, Upload, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { AnimatedBackground } from "@/components/builder/animated-background";
import { useAuth } from "@/providers/auth-provider";
import FormViewTracker from "@/components/FormViewTracker";

// ============================================================================
// Interactive Signature Pad
// ============================================================================
function SignaturePad({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#8B5CF6";
  }, []);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate the scale difference between actual size and CSS size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return { 
      x: (clientX - rect.left) * scaleX, 
      y: (clientY - rect.top) * scaleY 
    };
  };

  const startDrawing = (e: any) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL());
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="relative border border-dashed border-gray-300 rounded-xl shadow-sm overflow-hidden bg-white group hover:border-purple-300 hover:shadow-md transition-all">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full h-32 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {value ? (
        <button 
          type="button" 
          onClick={clear}
          className="absolute top-2 right-2 px-3 py-1 bg-gray-100 text-xs font-bold text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-500 transition-colors shadow-sm"
        >
          Clear Signature
        </button>
      ) : (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300 font-comic group-hover:text-gray-400 transition-colors">
          <span className="font-bold text-sm">✍️ Draw your signature here</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Field renderer for all supported types
// ============================================================================
function FieldInput({
  field,
  value,
  onChange,
  textColor,
}: {
  field: any;
  value: any;
  onChange: (val: any) => void;
  textColor: string;
}) {
  const baseInput =
    "w-full px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all font-comic text-gray-900 placeholder-gray-400";
  const opts: string[] = (field.config?.options as string[]) || ["Option 1", "Option 2"];

  switch (field.type) {
    case "short_text":
      return (
        <input
          type="text"
          required={field.required}
          minLength={field.config?.minLength as number | undefined}
          maxLength={field.config?.maxLength as number | undefined}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.config?.placeholder || "Type your answer here..."}
          className={baseInput}
        />
      );

    case "long_text":
      return (
        <textarea
          required={field.required}
          minLength={field.config?.minLength as number | undefined}
          maxLength={field.config?.maxLength as number | undefined}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.config?.placeholder || "Type your answer here..."}
          rows={4}
          className={`${baseInput} resize-y`}
        />
      );

    case "email":
      return (
        <input
          type="email"
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.config?.placeholder || "name@example.com"}
          className={baseInput}
        />
      );

    case "phone":
      return (
        <input
          type="tel"
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.config?.placeholder || "+1 234 567 8900"}
          className={baseInput}
        />
      );

    case "number":
      return (
        <input
          type="number"
          required={field.required}
          min={field.config?.min as number | undefined}
          max={field.config?.max as number | undefined}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.config?.placeholder || "0"}
          className={baseInput}
        />
      );

    case "url":
      return (
        <input
          type="url"
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.config?.placeholder || "https://example.com"}
          className={baseInput}
        />
      );

    case "date":
      return (
        <input
          type="date"
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      );

    case "time":
      return (
        <input
          type="time"
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      );

    case "dropdown":
      return (
        <div className="relative">
          <select
            required={field.required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInput} appearance-none pr-10`}
          >
            <option value="">Select an option...</option>
            {opts.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      );

    case "radio":
      return (
        <div className="space-y-3">
          {opts.map((opt, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                required={field.required}
                className="w-5 h-5 text-[#8B5CF6] border-2 border-gray-300 focus:ring-[#8B5CF6]"
              />
              <span className="font-comic text-[#333333] group-hover:text-[#8B5CF6] transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
    case "checkboxes":
      return (
        <div className="space-y-3">
          {opts.map((opt, i) => {
            const selected: string[] = value || [];
            const isChecked = selected.includes(opt);
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    if (isChecked) {
                      onChange(selected.filter((v) => v !== opt));
                    } else {
                      onChange([...selected, opt]);
                    }
                  }}
                  className="w-5 h-5 rounded text-[#8B5CF6] border-2 border-gray-300 focus:ring-[#8B5CF6]"
                />
                <span className="font-comic text-[#333333] group-hover:text-[#8B5CF6] transition-colors">{opt}</span>
              </label>
            );
          })}
        </div>
      );

    case "multiple_select":
      return (
        <div className="space-y-3">
          {opts.map((opt, i) => {
            const selected: string[] = value || [];
            const isChecked = selected.includes(opt);
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    if (isChecked) {
                      onChange(selected.filter((v) => v !== opt));
                    } else {
                      onChange([...selected, opt]);
                    }
                  }}
                  className="w-5 h-5 rounded text-[#8B5CF6] border-2 border-gray-300 focus:ring-[#8B5CF6]"
                />
                <span className="font-comic text-[#333333] group-hover:text-[#8B5CF6] transition-colors">{opt}</span>
              </label>
            );
          })}
        </div>
      );

    case "rating":
    case "stars": {
      const maxRating = (field.config?.max as number) || 5;
      const currentVal = Number(value) || 0;
      return (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star === currentVal ? 0 : star)}
              className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 text-xl transition-all hover:scale-110 ${star <= currentVal
                ? "border-[#8B5CF6] bg-[#E9D5FF] grayscale-0"
                : "border-gray-200 bg-white grayscale"
                }`}
            >
              ⭐
            </button>
          ))}
        </div>
      );
    }

    case "slider": {
      const min = (field.config?.min as number) ?? 0;
      const max = (field.config?.max as number) ?? 100;
      const step = (field.config?.step as number) ?? 1;
      const current = value ?? min;
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-[#8B5CF6]"
          />
          <div className="flex justify-between text-sm text-gray-500 font-comic font-bold">
            <span>{min}</span>
            <span className="text-[#8B5CF6] text-base font-bold">{current}</span>
            <span>{max}</span>
          </div>
        </div>
      );
    }

    case "nps": {
      const currentNps = Number(value);
      const min = (field.config?.min as number) ?? 0;
      const max = (field.config?.max as number) ?? 10;
      return (
        <div className="space-y-3">
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChange(num)}
                className={`w-10 h-10 rounded-lg border-2 font-bold font-comic text-sm transition-all hover:scale-105 ${currentNps === num
                  ? "border-[#8B5CF6] bg-[#8B5CF6] text-white"
                  : "border-gray-200 bg-white text-[#333333] hover:border-[#8B5CF6]"
                  }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-comic">
            <span>{field.config?.npsLeftLabel || "Not likely"}</span>
            <span>{field.config?.npsRightLabel || "Very likely"}</span>
          </div>
        </div>
      );
    }

    case "ranking": {
      const rankOpts: string[] = value || [...opts];
      return (
        <div className="space-y-2">
          {rankOpts.map((opt, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 shadow-sm rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all">
              <span className="w-7 h-7 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                {i + 1}
              </span>
              <span className="font-comic text-gray-900 flex-1">{opt}</span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    const newRank = [...rankOpts];
                    [newRank[i - 1], newRank[i]] = [newRank[i], newRank[i - 1]];
                    onChange(newRank);
                  }}
                  className="text-gray-400 hover:text-purple-500 disabled:opacity-30 text-xs leading-none"
                >▲</button>
                <button
                  type="button"
                  disabled={i === rankOpts.length - 1}
                  onClick={() => {
                    const newRank = [...rankOpts];
                    [newRank[i], newRank[i + 1]] = [newRank[i + 1], newRank[i]];
                    onChange(newRank);
                  }}
                  className="text-gray-400 hover:text-purple-500 disabled:opacity-30 text-xs leading-none"
                >▼</button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "address":
      return (
        <div className="space-y-3">
          <input type="text" placeholder="Street address" onChange={(e) => onChange({ ...(value || {}), street: e.target.value })} className={baseInput} />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="City" onChange={(e) => onChange({ ...(value || {}), city: e.target.value })} className={baseInput} />
            <input type="text" placeholder="State / Province" onChange={(e) => onChange({ ...(value || {}), state: e.target.value })} className={baseInput} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="ZIP / Postal code" onChange={(e) => onChange({ ...(value || {}), zip: e.target.value })} className={baseInput} />
            <input type="text" placeholder="Country" onChange={(e) => onChange({ ...(value || {}), country: e.target.value })} className={baseInput} />
          </div>
        </div>
      );

    case "social_links":
      return (
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <span className="w-8 flex justify-center text-xl">🐦</span>
            <input type="url" placeholder="Twitter / X profile URL" onChange={(e) => onChange({ ...(value || {}), twitter: e.target.value })} className={baseInput} />
          </div>
          <div className="flex gap-3 items-center">
            <span className="w-8 flex justify-center text-xl">💼</span>
            <input type="url" placeholder="LinkedIn profile URL" onChange={(e) => onChange({ ...(value || {}), linkedin: e.target.value })} className={baseInput} />
          </div>
          <div className="flex gap-3 items-center">
            <span className="w-8 flex justify-center text-xl">📸</span>
            <input type="url" placeholder="Instagram profile URL" onChange={(e) => onChange({ ...(value || {}), instagram: e.target.value })} className={baseInput} />
          </div>
        </div>
      );

    case "file_upload":
      return (
        <label className="block">
          <div className="h-32 rounded-xl border border-dashed border-gray-300 shadow-sm bg-white flex flex-col items-center justify-center text-gray-500 font-comic cursor-pointer hover:border-purple-300 hover:bg-purple-50 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <Upload className="w-6 h-6 mb-2 text-purple-500" />
            <span className="font-bold text-sm">Click to upload a file</span>
            <span className="text-xs mt-1">Max {field.config?.maxSize as number || 5}MB</span>
            <span className="text-[10px] mt-1 opacity-70">Allowed: {field.config?.allowedTypes as string || "Any"}</span>
          </div>
          <input
            type="file"
            accept={field.config?.allowedTypes as string || "*"}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const maxSize = (field.config?.maxSize as number || 5) * 1024 * 1024;
                if (file.size > maxSize) {
                  toast.error(`File size must be less than ${field.config?.maxSize || 5}MB`);
                  return;
                }
                onChange(file.name);
              }
            }}
          />
        </label>
      );

    case "signature":
      return <SignaturePad value={value || ""} onChange={(val) => onChange(val)} />;

    case "likert":
    case "matrix": {
      const rows: string[] = (field.config?.rows as string[]) || ["Row 1", "Row 2"];
      const cols: string[] = (field.config?.columns as string[]) || ["Col 1", "Col 2", "Col 3"];
      const matrixVal = value || {};
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-comic">
            <thead>
              <tr>
                <th className="py-2 pr-4"></th>
                {cols.map((col, ci) => (
                  <th key={ci} className="py-2 px-3 text-center text-[#333333] font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 pr-4 font-bold text-[#333333]">{row}</td>
                  {cols.map((col, ci) => (
                    <td key={ci} className="py-3 px-3 text-center">
                      <input
                        type="radio"
                        name={`${field.id}_${row}`}
                        checked={matrixVal[row] === col}
                        onChange={() => onChange({ ...matrixVal, [row]: col })}
                        className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-50 focus:ring-4 transition-all"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    default:
      return (
        <p className="text-sm text-gray-400 italic font-comic">
          Field type <strong>{field.type}</strong> is not yet supported in the preview.
        </p>
      );
  }
}

function linkify(text: string) {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#8B5CF6] hover:underline">${url}</a>`;
  });
}

// ============================================================================
// Page Flip Animation Variants
// ============================================================================
const getPageVariants = (isMobile: boolean) => ({
  enter: (direction: number) => ({
    rotateX: isMobile ? (direction > 0 ? 90 : -90) : 0,
    rotateY: !isMobile ? (direction > 0 ? 90 : -90) : 0,
    opacity: 0,
    transformPerspective: 2000,
    transformOrigin: isMobile ? "top center" : "left center",
  }),
  center: {
    rotateX: 0,
    rotateY: 0,
    opacity: 1,
    transformOrigin: isMobile ? "top center" : "left center",
    transition: {
      duration: 0.6,
      type: "spring" as const,
      bounce: 0.2,
    }
  },
  exit: (direction: number) => ({
    rotateX: isMobile ? (direction < 0 ? 90 : -90) : 0,
    rotateY: !isMobile ? (direction < 0 ? 90 : -90) : 0,
    opacity: 0,
    transformPerspective: 2000,
    transformOrigin: isMobile ? "top center" : "left center",
    transition: {
      duration: 0.4
    }
  })
});

// ============================================================================
// Main Published Form View
// ============================================================================
export default function PublicFormView() {
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Notebook Pagination State
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { user } = useAuth();
  const [respondentEmail, setRespondentEmail] = useState<string>("");
  const [respondentName, setRespondentName] = useState<string>("");
  const [hasEnteredEmail, setHasEnteredEmail] = useState<boolean>(false);

  // Auto-fill if user is logged in
  useEffect(() => {
    if (user) {
      if (user.email && !respondentEmail) setRespondentEmail(user.email);
      if (user.displayName && !respondentName) setRespondentName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    async function loadForm() {
      try {
        const { form, fields } = await fetchFormBySlug(slug);
        setFormData(form);
        setFields(fields);

        if (typeof window !== "undefined") {
          const submitted = localStorage.getItem(`form_submitted_${slug}`);
          if (submitted) setAlreadySubmitted(true);
        }
      } catch (err: any) {
        console.error(err);
        setErrorDetails(err.message || String(err));
        toast.error("Failed to load form. It may not exist.");
      } finally {
        setLoading(false);
      }
    }
    loadForm();
  }, [slug]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData) return;
    setSubmitting(true);
    try {
      const payload = { ...responses };
      if (respondentName) payload.__respondent_name = respondentName;
      
      let deviceType = "Desktop";
      if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent.toLowerCase();
        if (/ipad|tablet|playbook|silk/i.test(ua)) {
          deviceType = "Tablet";
        } else if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
          deviceType = "Mobile";
        } else if (window.innerWidth < 768) {
          deviceType = "Mobile";
        }
      }

      await submitFormResponse(formData.id, payload, respondentEmail, deviceType);
      setSuccess(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(`form_submitted_${slug}`, "true");
      }
      toast.success("Response submitted successfully!");
    } catch {
      toast.error("Failed to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextField = () => {
    const currentField = fields[currentFieldIndex];
    
    // Validate required fields before moving to next page
    if (currentField && currentField.required) {
      const val = responses[currentField.id];
      if (!val || (Array.isArray(val) && val.length === 0)) {
        toast.error(`"${currentField.label}" is required.`);
        return;
      }
    }

    if (currentFieldIndex < fields.length - 1) {
      setDirection(1);
      setCurrentFieldIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevField = () => {
    if (currentFieldIndex > 0) {
      setDirection(-1);
      setCurrentFieldIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBF8]">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  if (!formData && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBF8] font-comic">
        <div className="text-center">
          <p className="text-6xl mb-4">🕵️‍♂️</p>
          <h1 className="text-2xl font-bold text-[#333333]">Form not found!</h1>
          <p className="text-gray-500 mt-2">This link may be invalid or the form has been removed.</p>
          {errorDetails && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-sans border border-red-200 inline-block max-w-md text-left">
              <strong>Error Details:</strong> {errorDetails}
            </div>
          )}
        </div>
      </div>
    );
  }

  const theme = formData?.settings?.themeConfig || {};
  const settings = formData?.settings?.formSettings || {
    successMessage: "Thank You! 🎉 Your response has been recorded.",
    allowMultipleResponses: true,
    isAcceptingResponses: true,
  };

  if (settings.isAcceptingResponses === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFBF8] font-comic p-4 text-center">
        <p className="text-6xl mb-4">⛔</p>
        <h1 className="text-3xl font-bold text-[#333333] mb-2 font-balsamiq">Form Closed</h1>
        <p className="text-gray-500">This form is currently not accepting new responses. Kindly contact to publisher</p>
      </div>
    );
  }

  if (alreadySubmitted && settings.allowMultipleResponses === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFBF8] font-comic p-4 text-center">
        <p className="text-6xl mb-4">✋</p>
        <h1 className="text-3xl font-bold text-[#333333] mb-2 font-balsamiq">Already responded!</h1>
        <p className="text-gray-500">This form only allows one submission per person.</p>
      </div>
    );
  }

  const textColor = theme.textColor || "#333333";
  const formBg = theme.formBgColor || "#FCFBF8";
  const fieldBg = theme.fieldBgColor || "#ffffff";
  const fontClass = theme.fontFamily || "font-comic";
  const roundedClass = theme.rounded || "rounded-2xl";
  const borderClass = theme.borderStyle || "border-2";
  const isGlass = theme.glassmorphism;

  // Email Gate
  if (!hasEnteredEmail && !success) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${theme.backgroundColor || "bg-[#FCFBF8]"}`}>
        <FormViewTracker formSlug={slug} />
        <AnimatedBackground pattern={theme.backgroundPattern || "solid"} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-[3rem_2rem_3rem_1rem] border-2 border-dashed border-gray-300 shadow-md overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-300 rounded-[1rem_0.5rem_1rem_0.5rem] border border-emerald-400 opacity-50 transform -rotate-12"></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-300 rounded-[1rem_0.5rem_1rem_0.5rem] border border-amber-400 opacity-50 transform rotate-6"></div>

          <div className="w-20 h-20 bg-purple-100 border border-purple-200 shadow-sm transform -rotate-6 rounded-[1rem_0.5rem_1rem_0.5rem] flex items-center justify-center mb-6 mx-auto relative z-10">
            <span className="text-3xl">👋</span>
          </div>
          
          <h2 className="text-3xl font-balsamiq font-black text-center text-gray-900 mb-3 relative z-10">Welcome!</h2>
          <p className="text-gray-500 font-comic text-center text-md mb-8 relative z-10 font-bold">
            Before we begin, please provide your email address to continue to the form.
          </p>

          <form onSubmit={(e) => { 
            e.preventDefault(); 
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(respondentEmail)) {
              toast.error("Please enter a valid email address.");
              return;
            }
            if (respondentEmail) setHasEnteredEmail(true); 
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold font-comic text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 font-comic font-bold transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold font-comic text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={respondentEmail}
                  onChange={(e) => setRespondentEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 font-comic font-bold transition-all shadow-sm"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 mt-2 bg-purple-500 text-white rounded-xl border border-purple-600 font-balsamiq font-bold text-xl shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-600 transition-all"
              >
                Continue to Form
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  const pattern = theme.backgroundPattern;

  // Background styling mapping
  const bgStyles: any = {};
  if (["programmer", "healthcare", "education", "playful"].includes(pattern || "")) {
    // These themes are handled by AnimatedBackground but we need a base color
    if (pattern === "programmer") bgStyles.backgroundColor = "#0f172a";
    if (pattern === "healthcare") bgStyles.backgroundColor = "#f0f9ff";
    if (pattern === "education") bgStyles.backgroundColor = "#fff7ed";
    if (pattern === "playful") bgStyles.backgroundColor = "#fdf4ff";
  } else if (pattern === "aurora") {
    bgStyles.background = "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)";
    bgStyles.backgroundAttachment = "fixed";
  } else if (pattern === "zen") {
    bgStyles.background = "linear-gradient(120deg, #ecfccb 0%, #d9f99d 100%)";
    bgStyles.backgroundAttachment = "fixed";
  } else if (pattern === "cybergrid") {
    bgStyles.backgroundColor = "#000000";
    bgStyles.backgroundImage = "linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)";
    bgStyles.backgroundSize = "20px 20px";
    bgStyles.backgroundPosition = "center center";
    bgStyles.backgroundAttachment = "fixed";
  } else if (pattern === "neo-grid") {
    bgStyles.backgroundColor = formBg;
    bgStyles.backgroundImage = "radial-gradient(#000 1px, transparent 1px)";
    bgStyles.backgroundSize = "20px 20px";
    bgStyles.backgroundAttachment = "fixed";
  } else {
    bgStyles.backgroundColor = formBg;
  }

  // Parse accent color for inline styles if needed
  const accentHex = theme.accentColor?.includes('[') 
    ? theme.accentColor.replace('border-[', '').replace(']', '') 
    : theme.accentColor?.replace('border-', '') || '#8B5CF6';

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors ${fontClass} relative flex flex-col justify-center`}
      style={bgStyles}
    >
      <AnimatedBackground pattern={pattern || "solid"} />
      
      <div className="max-w-4xl w-full mx-auto relative z-10">
        {!success && fields.length > 0 ? (
          <div
            className={`bg-[#FCFBF8] p-6 md:p-12 rounded-[3rem_2rem_3rem_1rem] border-2 border-dashed border-gray-300 shadow-md relative overflow-hidden transition-all duration-500 w-full`}
          >
            {/* Spiral Binding Edge (Top on mobile, Left on desktop) */}
            <div className="absolute top-0 left-0 w-full h-12 md:h-full md:w-16 border-b md:border-b-0 md:border-r border-gray-200 bg-white shadow-sm flex flex-row md:flex-col justify-evenly px-4 md:px-0 py-0 md:py-8 z-20">
              {[...Array(isMobile ? 8 : 12)].map((_, i) => (
                <div key={i} className="w-4 h-8 md:w-10 md:h-5 bg-white border border-gray-200 rounded-[1rem_0.5rem_1rem_0.5rem] shadow-sm -mt-3 md:mt-0 md:ml-3 relative z-30 transform md:-rotate-12" />
              ))}
            </div>

            {/* Red Margin Line on the Paper (Hidden on mobile or just left) */}
            <div className="hidden md:block absolute top-0 left-24 w-1 h-full bg-red-400 opacity-20 z-10"></div>
            <div className="hidden md:block absolute top-0 left-26 w-[1px] h-full bg-red-400 opacity-10 z-10"></div>
            <div className="block md:hidden absolute top-0 left-6 w-1 h-full bg-red-400 opacity-20 z-10"></div>
            <div className="block md:hidden absolute top-0 left-8 w-[1px] h-full bg-red-400 opacity-10 z-10"></div>

            {/* Notebook Header */}
            <div className="mb-6 md:mb-8 pt-10 md:pt-0 pl-10 md:pl-16 flex justify-between items-center relative z-10">
                  <span className="text-sm font-bold font-comic text-gray-700 bg-white px-3 md:px-4 py-1 md:py-1.5 border border-dashed border-gray-300 rounded-[1rem_0.5rem_1rem_0.5rem] shadow-sm transform -rotate-1">
                    {formData.title || "Untitled Form"}
                  </span>
                  <span className="text-sm font-bold font-comic text-purple-700 bg-purple-50 px-3 md:px-4 py-1 md:py-1.5 border border-purple-200 rounded-[0.5rem_1rem_0.5rem_1rem] shadow-sm transform rotate-1">
                    {currentFieldIndex + 1} / {fields.length}
                  </span>
                </div>

              {/* Field Container */}
              <div className="pl-6 md:pl-16 relative z-10">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentFieldIndex}
                    custom={direction}
                    variants={getPageVariants(isMobile)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full bg-transparent p-2 md:p-4 min-h-[350px] flex flex-col justify-between"
                  >
                    <form onSubmit={(e) => { e.preventDefault(); nextField(); }} className="flex-1 flex flex-col justify-center">
                      <div className="w-full">
                        {(() => {
                          const field = fields[currentFieldIndex];
                          if (!field) return null;
                          
                          if (field.type === "statement") {
                            return (
                              <div className="mb-8">
                                <h2 className="text-3xl font-black font-balsamiq text-gray-900 mb-4 leading-tight">{field.label}</h2>
                                {field.description && (
                                  <p className="text-xl opacity-80 text-gray-600 font-comic leading-relaxed">{field.description}</p>
                                )}
                              </div>
                            );
                          }

                          return (
                            <div className="mb-8">
                              <label className="block text-3xl font-black mb-4 font-balsamiq text-gray-900 leading-tight">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-2">*</span>}
                              </label>
                              {field.description && (
                                <p className="text-lg mb-6 opacity-80 text-gray-600 font-comic">{field.description}</p>
                              )}
                              <div className="bg-white/50 p-4 rounded-2xl border border-dashed border-gray-300 shadow-sm focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-50 transition-all">
                                <FieldInput
                                  field={field}
                                  value={responses[field.id]}
                                  onChange={(val) => setResponses((prev) => ({ ...prev, [field.id]: val }))}
                                  textColor="#333333"
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-dashed border-gray-200">
                        <button
                          type="button"
                          onClick={prevField}
                          disabled={currentFieldIndex === 0}
                          className={`px-4 py-2 font-balsamiq font-black text-sm rounded-[1rem_0.5rem_1rem_0.5rem] transition-all flex items-center gap-2 ${
                            currentFieldIndex === 0 
                              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed" 
                              : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
                          }`}
                        >
                          Back
                        </button>
                        
                        <button
                          type="button"
                          onClick={nextField}
                          disabled={submitting}
                          className="flex-1 max-w-[140px] py-2 bg-purple-500 border border-purple-600 rounded-[0.5rem_1rem_0.5rem_1rem] font-balsamiq text-base font-black text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-600 transition-all flex justify-center items-center gap-2"
                        >
                          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : currentFieldIndex === fields.length - 1 ? "Submit ✨" : "Next ➔"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-dashed border-purple-200 p-12 rounded-[3rem_2rem_3rem_1rem] shadow-md text-center"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-[1rem_0.5rem_1rem_0.5rem] border border-emerald-200 shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-4xl font-black font-balsamiq text-gray-900 mb-4">Success! 🎉</h2>
              <p className="text-lg text-gray-600 font-bold mb-8 whitespace-pre-line">
                {settings.successMessage}
              </p>
              {settings.allowMultipleResponses && (
                <button
                  onClick={() => {
                    setSuccess(false);
                    setResponses({});
                    setCurrentFieldIndex(0);
                    setDirection(0);
                  }}
                  className="text-purple-600 font-bold hover:underline font-comic hover:text-purple-700"
                >
                  Submit another response
                </button>
              )}
            </motion.div>
          ) : null}

        <div className="mt-12 text-center">
          <a href="/" className="text-sm text-gray-400 font-comic hover:text-gray-600 transition-colors inline-block cursor-pointer">
            Powered by <span className="font-balsamiq text-[#8B5CF6] hover:underline">FormForge</span>
          </a>
        </div>
      </div>
    </div>
  );
}
