// ============================================================================
// FORM ROUTER — CRUD operations for forms
// ============================================================================

import { z } from "zod";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { forms, formFields } from "@formforge/db";
import { CreateFormInputSchema, UpdateFormInputSchema } from "@formforge/types";

export const formRouter = router({
  // Get all forms for the authenticated user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.forms.findMany({
      where: eq(forms.userId, ctx.user.id),
      orderBy: [desc(forms.updatedAt)],
      with: {
        fields: true,
        theme: true,
      },
    });
  }),

  // Get a specific form by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)),
        with: {
          fields: {
            orderBy: (fields, { asc }) => [asc(fields.order)],
          },
          theme: true,
        },
      });

      if (!form) {
        throw new Error("Form not found");
      }

      return form;
    }),

  // Get a public form by slug (for respondents)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.slug, input.slug), eq(forms.status, "published")),
        with: {
          fields: {
            orderBy: (fields, { asc }) => [asc(fields.order)],
          },
          theme: true,
        },
      });

      if (!form) {
        throw new Error("Form not found or not published");
      }

      return form;
    }),

  // Create a new form
  create: protectedProcedure
    .input(CreateFormInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Generate a unique slug from the title
      const baseSlug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      const [form] = await ctx.db
        .insert(forms)
        .values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          slug,
          layoutType: input.layoutType || "single_page",
          themeId: input.themeId,
        })
        .returning();

      return form;
    }),

  // Update a form
  update: protectedProcedure
    .input(UpdateFormInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updated] = await ctx.db
        .update(forms)
        .set({
          ...data,
          updatedAt: new Date(),
          ...(data.status === "published" ? { publishedAt: new Date() } : {}),
        })
        .where(and(eq(forms.id, id), eq(forms.userId, ctx.user.id)))
        .returning();

      if (!updated) {
        throw new Error("Form not found");
      }

      return updated;
    }),

  // Delete a form
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(forms)
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .returning();

      if (!deleted) {
        throw new Error("Form not found");
      }

      return { success: true };
    }),

  // Publish a form
  publish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [published] = await ctx.db
        .update(forms)
        .set({
          status: "published",
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .returning();

      if (!published) {
        throw new Error("Form not found");
      }

      return published;
    }),

  // Get form count for a user
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ count: count() })
      .from(forms)
      .where(eq(forms.userId, ctx.user.id));

    return result?.count ?? 0;
  }),
});
