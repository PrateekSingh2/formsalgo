import type { BuilderField } from "@/stores/form-builder-store";
import type { FieldType } from "@formforge/types";

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  themeConfig?: {
    fontFamily: string;
    backgroundColor: string;
    accentColor: string;
    borderStyle: string;
    rounded: string;
    formBgColor: string;
    fieldBgColor: string;
    textColor: string;
  };
  fields: Partial<BuilderField>[];
}

function genId() {
  return crypto.randomUUID();
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "contact-form",
    title: "Contact Us",
    description: "A clean and simple contact form for customer inquiries.",
    icon: "✉️",
    themeConfig: {
      fontFamily: "font-sans",
      backgroundColor: "bg-white",
      accentColor: "border-[#8B5CF6]",
      borderStyle: "border-2",
      rounded: "rounded-2xl",
      formBgColor: "#FCFBF8",
      fieldBgColor: "#ffffff",
      textColor: "#333333",
    },
    fields: [
      { id: genId(), type: "short_text" as FieldType, label: "Full Name", required: true, width: "full", config: { placeholder: "Jane Doe" } },
      { id: genId(), type: "email" as FieldType, label: "Email Address", required: true, width: "full", config: { placeholder: "jane@example.com" } },
      { id: genId(), type: "short_text" as FieldType, label: "Subject", required: false, width: "full", config: { placeholder: "What is this regarding?" } },
      { id: genId(), type: "long_text" as FieldType, label: "Message", required: true, width: "full", config: { placeholder: "Type your message here..." } },
    ]
  },
  {
    id: "feedback-form",
    title: "Customer Feedback",
    description: "Gather valuable feedback from your recent customers.",
    icon: "⭐",
    themeConfig: {
      fontFamily: "font-comic",
      backgroundColor: "bg-white",
      accentColor: "border-[#F59E0B]",
      borderStyle: "border-2",
      rounded: "rounded-xl",
      formBgColor: "#FEF3C7",
      fieldBgColor: "#ffffff",
      textColor: "#333333",
    },
    fields: [
      { id: genId(), type: "stars" as FieldType, label: "How would you rate your experience?", required: true, width: "full", config: { maxRating: 5 } },
      { id: genId(), type: "radio" as FieldType, label: "Would you recommend us to a friend?", required: true, width: "full", config: { options: ["Definitely", "Maybe", "Not really"] } },
      { id: genId(), type: "long_text" as FieldType, label: "How can we improve?", required: false, width: "full", config: { placeholder: "Any specific suggestions?" } },
    ]
  },
  {
    id: "event-registration",
    title: "Event Registration",
    description: "Register attendees for your upcoming event.",
    icon: "🎫",
    themeConfig: {
      fontFamily: "font-balsamiq",
      backgroundColor: "bg-[#111827]",
      accentColor: "border-[#34D399]",
      borderStyle: "border-2",
      rounded: "rounded-[2rem]",
      formBgColor: "#111827",
      fieldBgColor: "#1F2937",
      textColor: "#F9FAFB",
    },
    fields: [
      { id: genId(), type: "short_text" as FieldType, label: "Attendee Name", required: true, width: "full", config: {} },
      { id: genId(), type: "email" as FieldType, label: "Email Address", required: true, width: "full", config: {} },
      { id: genId(), type: "multiple_select" as FieldType, label: "Which sessions will you attend?", required: false, width: "full", config: { options: ["Morning Keynote", "Afternoon Workshop", "Networking Dinner"] } },
      { id: genId(), type: "radio" as FieldType, label: "Dietary Restrictions", required: true, width: "full", config: { options: ["None", "Vegetarian", "Vegan", "Gluten-Free"] } },
    ]
  }
];
