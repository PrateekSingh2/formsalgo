// ============================================================================
// FIELD ROUTER — CRUD operations for form fields
// ============================================================================

import { z } from "zod";
import { eq, and, asc } from "drizzle-orm";
import { router, protectedProcedure } from "../trpc";
import { formFields, forms } from "@formforge/db";
import { CreateFieldInputSchema, UpdateFieldInputSchema } from "@formforge/types";

export const fieldRouter = router({
  // Get all fields for a form
  getByFormId: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.formFields.findMany({
        where: eq(formFields.formId, input.formId),
        orderBy: [asc(formFields.order)],
      });
    }),

  // Create a new field
  create: protectedProcedure
    .input(CreateFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const [field] = await ctx.db
        .insert(formFields)
        .values({
          formId: input.formId,
          type: input.type,
          label: input.label,
          description: input.description,
          order: input.order,
          required: input.required ?? false,
          config: input.config ?? {},
          validation: input.validation ?? {},
          width: input.width ?? "full",
        })
        .returning();

      return field;
    }),

  // Update a field
  update: protectedProcedure
    .input(UpdateFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updated] = await ctx.db
        .update(formFields)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(formFields.id, id))
        .returning();

      if (!updated) {
        throw new Error("Field not found");
      }

      return updated;
    }),

  // Delete a field
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(formFields)
        .where(eq(formFields.id, input.id))
        .returning();

      if (!deleted) {
        throw new Error("Field not found");
      }

      return { success: true };
    }),

  // Reorder fields (batch update)
  reorder: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
        fieldOrders: z.array(
          z.object({
            id: z.string().uuid(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update each field's order in a transaction-like fashion
      const updates = input.fieldOrders.map((fo) =>
        ctx.db
          .update(formFields)
          .set({ order: fo.order, updatedAt: new Date() })
          .where(
            and(
              eq(formFields.id, fo.id),
              eq(formFields.formId, input.formId)
            )
          )
      );

      await Promise.all(updates);

      return { success: true };
    }),
});
