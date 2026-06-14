import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not set in the environment variables.' }, { status: 500 });
    }

    const systemPrompt = `You are an expert form creator AI. Your job is to generate a JSON object containing a form based on the user's prompt.
You MUST reply with a JSON object containing a single key "fields", which is an array of field objects.

The field objects must match this exact TypeScript schema:
type FieldType = "short_text" | "long_text" | "email" | "number" | "phone" | "website" | "dropdown" | "multiple_choice" | "checkbox" | "date" | "time" | "file_upload" | "rating" | "matrix" | "signature" | "nps" | "statement";

interface BuilderField {
  id: string; // generate a unique string like "field_xxx"
  type: FieldType;
  label: string; // The question or label
  description?: string; // Optional helper text
  required: boolean;
  order: number;
  config: {
    placeholder?: string;
    options?: string[]; // Required for dropdown, multiple_choice, checkbox. E.g. ["Option 1", "Option 2"]
    rows?: string[]; // Required for matrix
    columns?: string[]; // Required for matrix
  };
}

Create a comprehensive and logical form based on the user's prompt. If the prompt is simple, infer the necessary fields a professional would use.
Output strictly a JSON object: { "fields": [ ... ] }`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Updated to currently supported model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Low temperature for consistent JSON
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json({ error: 'Failed to generate form via Groq' }, { status: response.status });
    }

    const data = await response.json();
    // Strip markdown formatting if present
    let content = data.choices[0].message.content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();
    }
    
    // If the model returned an object with a "fields" array, extract it.
    // Otherwise, try to parse it directly.
    let fields = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        fields = parsed;
      } else if (parsed.fields && Array.isArray(parsed.fields)) {
        fields = parsed.fields;
      } else {
        // Fallback: search for array inside the object
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) {
            fields = parsed[key];
            break;
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse AI JSON:", content);
      return NextResponse.json({ error: 'AI returned invalid JSON format.' }, { status: 500 });
    }

    return NextResponse.json({ fields });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
