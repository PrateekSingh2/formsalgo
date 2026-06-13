// ============================================================================
// ADMIN ROUTER — Superadmin dashboard management
// ============================================================================

import { z } from "zod";
import { eq, desc, count, sql, gte, and } from "drizzle-orm";
import { router, adminProcedure } from "../trpc";
import { users, forms, submissions, themes, formAnalytics } from "@formforge/db";

export const adminRouter = router({
  // Get platform-wide statistics
  getStats: adminProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [usersCount] = await ctx.db.select({ count: count() }).from(users);
    const [formsCount] = await ctx.db.select({ count: count() }).from(forms);
    const [subsCount] = await ctx.db.select({ count: count() }).from(submissions);
    const [activeFormsCount] = await ctx.db
      .select({ count: count() })
      .from(forms)
      .where(eq(forms.status, "published"));
    const [themesCount] = await ctx.db.select({ count: count() }).from(themes);

    const [newUsersToday] = await ctx.db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, today));
    const [subsToday] = await ctx.db
      .select({ count: count() })
      .from(submissions)
      .where(gte(submissions.completedAt, today));
    const [formsToday] = await ctx.db
      .select({ count: count() })
      .from(forms)
      .where(gte(forms.createdAt, today));

    return {
      totalUsers: usersCount?.count ?? 0,
      totalForms: formsCount?.count ?? 0,
      totalSubmissions: subsCount?.count ?? 0,
      activeForms: activeFormsCount?.count ?? 0,
      totalThemes: themesCount?.count ?? 0,
      newUsersToday: newUsersToday?.count ?? 0,
      submissionsToday: subsToday?.count ?? 0,
      formsCreatedToday: formsToday?.count ?? 0,
    };
  }),

  // Get all users with pagination
  getAllUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
        limit: input.limit,
        offset: input.offset,
      });

      const [totalResult] = await ctx.db.select({ count: count() }).from(users);

      return {
        users: results,
        total: totalResult?.count ?? 0,
      };
    }),

  // Get all forms with pagination
  getAllForms: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        offset: z.number().min(0).default(0),
        status: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = input.status
        ? eq(forms.status, input.status)
        : undefined;

      const results = await ctx.db.query.forms.findMany({
        where: conditions,
        orderBy: [desc(forms.createdAt)],
        limit: input.limit,
        offset: input.offset,
        with: {
          user: true,
        },
      });

      const [totalResult] = await ctx.db.select({ count: count() }).from(forms);

      return {
        forms: results,
        total: totalResult?.count ?? 0,
      };
    }),

  // Toggle form publish status
  toggleFormStatus: adminProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
        status: z.enum(["draft", "published", "archived", "closed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(forms)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(forms.id, input.formId))
        .returning();

      return updated;
    }),

  // Delete a form (admin override — no ownership check)
  deleteForm: adminProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(forms).where(eq(forms.id, input.formId));
      return { success: true };
    }),

  // Delete a user
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // Update user role
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(["user", "creator", "admin", "superadmin"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId))
        .returning();

      return updated;
    }),

  // Get recent submissions across all forms
  getRecentSubmissions: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.submissions.findMany({
        orderBy: [desc(submissions.completedAt)],
        limit: input.limit,
        with: {
          form: true,
        },
      });
    }),
});
