import { supabase } from "./supabase";

/**
 * PRODUCTION SAFE ADMIN ACTIONS
 * These actions use strict limits and count queries to ensure they don't overload
 * the browser or database when dealing with large production datasets.
 */

export async function fetchAdminOverview() {
  try {
    // Perform parallel fast count queries instead of loading all rows
    const [userRes, formRes, subRes, activeFormRes] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('forms').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase.from('forms').select('*', { count: 'exact', head: true }).eq('status', 'published')
    ]);

    // Fetch only the 5 most recent users safely
    const { data: recentUsers } = await supabase
      .from('users')
      .select('name, email, created_at, forms(count)')
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch only the 5 most recent forms safely
    const { data: recentForms } = await supabase
      .from('forms')
      .select('title, status, created_at, users(name), submissions(count)')
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      stats: {
        totalUsers: userRes.count || 0,
        totalForms: formRes.count || 0,
        submissions: subRes.count || 0,
        activeForms: activeFormRes.count || 0,
      },
      recentUsers: recentUsers || [],
      recentForms: recentForms || []
    };
  } catch (error) {
    console.error("fetchAdminOverview error:", error);
    return null;
  }
}

export async function fetchAllFormsAdmin(limit = 250) {
  try {
    // Safe limited query to prevent massive payloads
    const { data, error } = await supabase
      .from('forms')
      .select(`
        id,
        title,
        status,
        views,
        created_at,
        slug,
        users (name, email),
        submissions (count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("fetchAllFormsAdmin error:", error);
    return [];
  }
}

export async function fetchAllUsersAdmin(limit = 250) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        created_at,
        forms (count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("fetchAllUsersAdmin error:", error);
    return [];
  }
}

// PRODUCTION SAFETY: Instead of hard-deleting, we archive.
export async function archiveFormAdmin(formId: string) {
  try {
    const { error } = await supabase
      .from('forms')
      .update({ status: 'archived' })
      .eq('id', formId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("archiveFormAdmin error:", error);
    return false;
  }
}

export async function toggleFormStatusAdmin(formId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('forms')
      .update({ status: newStatus })
      .eq('id', formId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("toggleFormStatusAdmin error:", error);
    return false;
  }
}

export async function changeUserRoleAdmin(userId: string, newRole: string) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("changeUserRoleAdmin error:", error);
    return false;
  }
}
