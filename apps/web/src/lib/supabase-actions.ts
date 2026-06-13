import { supabase } from "./supabase";
import type { BuilderField } from "@/stores/form-builder-store";

export async function saveFormToDatabase(
  firebaseUid: string | null,
  formId: string | null,
  formTitle: string,
  formDescription: string,
  layoutType: string,
  themeConfig: any,
  formSettings: any,
  fields: BuilderField[]
) {
  try {
    let userId = null;

    if (firebaseUid) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', firebaseUid)
        .single();
        
      if (!userError && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      const dummyUid = firebaseUid || `mock-uid-${Date.now()}`;
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          firebase_uid: dummyUid,
          email: `${dummyUid}@example.com`,
          name: "Test User",
        })
        .select('id')
        .single();

      if (insertError) {
        console.error("Failed to provision test user:", insertError);
        throw new Error("Could not link form to a user.");
      }
      userId = newUser.id;
    }

    const settingsObj = { themeConfig, formSettings };
    let formRecord;

    if (formId) {
      // Update existing form
      const { data: form, error: formError } = await supabase
        .from('forms')
        .update({
          title: formTitle,
          description: formDescription,
          status: 'published',
          layout_type: layoutType,
          settings: settingsObj,
        })
        .eq('id', formId)
        .select('id, slug')
        .single();

      if (formError || !form) {
        console.error("Form update error:", formError);
        throw new Error("Failed to update form metadata.");
      }
      formRecord = form;

      // Delete existing fields so we can recreate them clean (easier than complex diffing)
      await supabase.from('form_fields').delete().eq('form_id', formId);
    } else {
      // Insert new form
      const slug = Math.random().toString(36).substring(2, 10);
      const { data: form, error: formError } = await supabase
        .from('forms')
        .insert({
          user_id: userId,
          title: formTitle,
          description: formDescription,
          slug: slug,
          status: 'published',
          layout_type: layoutType,
          settings: settingsObj,
        })
        .select('id, slug')
        .single();

      if (formError || !form) {
        console.error("Form insert error:", formError);
        throw new Error("Failed to save form metadata.");
      }
      formRecord = form;
    }

    // 4. Insert into form_fields table
    const fieldsToInsert = fields.map((f, index) => ({
      form_id: formRecord.id,
      type: f.type,
      label: f.label,
      description: f.description || null,
      order: index,
      required: f.required,
      config: f.config || {},
      validation: f.validation || {},
      width: f.width || 'full',
    }));

    if (fieldsToInsert.length > 0) {
      const { error: fieldsError } = await supabase
        .from('form_fields')
        .insert(fieldsToInsert);

      if (fieldsError) {
        console.error("Fields insert error:", fieldsError);
        throw new Error("Failed to save form fields.");
      }
    }

    return { slug: formRecord.slug, formId: formRecord.id };

  } catch (error) {
    console.error("saveFormToDatabase failed:", error);
    throw error;
  }
}

export async function fetchFormBySlug(slug: string) {
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('slug', slug)
    .single();

  if (formError || !form) throw new Error("Form not found");

  // Increment view count in background (fire and forget)
  supabase.rpc('increment_form_views', { form_slug: slug }).then(({ error }) => {
    if (error) console.error("Failed to increment views:", error);
  });

  const { data: fields, error: fieldsError } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', form.id)
    .order('order', { ascending: true });

  if (fieldsError) throw new Error("Could not load form fields");

  return { form, fields };
}

export async function fetchFormById(id: string) {
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single();

  if (formError || !form) throw new Error("Form not found");

  const { data: fields, error: fieldsError } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', form.id)
    .order('order', { ascending: true });

  if (fieldsError) throw new Error("Could not load form fields");

  return { form, fields };
}

export async function submitFormResponse(formId: string, responseData: any) {
  const { error } = await supabase
    .from('submissions')
    .insert({
      form_id: formId,
      data: responseData,
      status: 'completed',
    });

  if (error) throw new Error("Failed to submit form");
  return true;
}

export async function fetchUserForms(firebaseUid: string | null) {
  if (!firebaseUid) return [];

  // Find the user ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebaseUid)
    .single();

  if (userError || !user) return [];

  // Fetch their forms along with submissions count
  const { data: forms, error: formsError } = await supabase
    .from('forms')
    .select('*, submissions(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (formsError) throw new Error("Could not load forms");

  // Format the data to match the dashboard's expected structure
  return forms.map((form: any) => ({
    id: form.id,
    slug: form.slug,
    title: form.title,
    status: form.status === 'published' ? 'Published' : 'Draft',
    responses: form.submissions?.[0]?.count || 0,
    views: form.views || 0,
    lastUpdated: new Date(form.updated_at || form.created_at).toLocaleDateString(),
    theme: form.settings?.themeConfig?.fontFamily || form.settings?.fontFamily || "Scribble"
  }));
}

export async function fetchFormSubmissions(formId: string) {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        id,
        started_at,
        data
      `)
      .eq('form_id', formId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    
    // Get form fields to map responses to actual questions
    const { data: fields, error: fieldsError } = await supabase
      .from('form_fields')
      .select('id, label, type')
      .eq('form_id', formId)
      .order('order', { ascending: true });
      
    if (fieldsError) throw fieldsError;

    // Get form metadata for views (fallback if views column doesn't exist)
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    // Don't throw on form metadata error just to allow submissions to load
    // in case the views column hasn't been added to the database yet.
    return { 
      submissions: submissions || [], 
      fields: fields || [], 
      form: form || { title: "Form Analytics", views: 0 } 
    };
  } catch (error) {
    console.error("fetchFormSubmissions failed:", error);
    throw error;
  }
}

export async function deleteForm(formId: string) {
  // Supabase RLS policies should allow the owner to delete, and cascade delete should handle form_fields and submissions
  // If not cascade, we need to delete fields and submissions first. 
  // Let's assume cascade is set up or we can delete them explicitly if not.
  const { error: fieldsError } = await supabase.from('form_fields').delete().eq('form_id', formId);
  const { error: subsError } = await supabase.from('submissions').delete().eq('form_id', formId);
  
  const { error } = await supabase.from('forms').delete().eq('id', formId);
  if (error) throw new Error("Failed to delete form");
  return true;
}
