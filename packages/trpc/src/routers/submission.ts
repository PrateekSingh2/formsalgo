// ============================================================================
// SUBMISSION ROUTER — Form response management
// ============================================================================

import { z } from "zod";
import { eq, desc, count, and, gte, sql } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { submissions, forms, formAnalytics } from "@formforge/db";
import { CreateSubmissionInputSchema } from "@formforge/types";

export const submissionRouter = router({
  // Submit a form response (public — no auth needed)
  create: publicProcedure
    .input(CreateSubmissionInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the form exists and is published
      const form = await ctx.db.query.forms.findFirst({
        where: and(
          eq(forms.id, input.formId),
          eq(forms.status, "published")
        ),
      });

      if (!form) {
        throw new Error("Form not found or not accepting responses");
      }

      const [submission] = await ctx.db
        .insert(submissions)
        .values({
          formId: input.formId,
          data: input.data,
          status: "completed",
          metadata: input.metadata ?? {},
          completedAt: new Date(),
        })
        .returning();

      // Update analytics (upsert for today's date)
      const today = new Date().toISOString().split("T")[0]!;
      await ctx.db
        .insert(formAnalytics)
        .values({
          formId: input.formId,
          completions: 1,
          date: today,
        })
        .onConflictDoUpdate({
          target: [formAnalytics.formId, formAnalytics.date],
          set: {
            completions: sql`${formAnalytics.completions} + 1`,
          },
        });

      return submission;
    }),

  // Get all submissions for a form (requires auth)
  getByFormId: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const form = await ctx.db.query.forms.findFirst({
        where: and(
          eq(forms.id, input.formId),
          eq(forms.userId, ctx.user.id)
        ),
      });

      if (!form) {
        throw new Error("Form not found");
      }

      const results = await ctx.db.query.submissions.findMany({
        where: eq(submissions.formId, input.formId),
        orderBy: [desc(submissions.completedAt)],
        limit: input.limit,
        offset: input.offset,
      });

      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(submissions)
        .where(eq(submissions.formId, input.formId));

      return {
        submissions: results,
        total: totalResult?.count ?? 0,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Get a single submission
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db.query.submissions.findFirst({
        where: eq(submissions.id, input.id),
        with: {
          form: true,
        },
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      return submission;
    }),

  // Get submission stats for a form
  getStats: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(submissions)
        .where(eq(submissions.formId, input.formId));

      const [completedResult] = await ctx.db
        .select({ count: count() })
        .from(submissions)
        .where(
          and(
            eq(submissions.formId, input.formId),
            eq(submissions.status, "completed")
          )
        );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [todayResult] = await ctx.db
        .select({ count: count() })
        .from(submissions)
        .where(
          and(
            eq(submissions.formId, input.formId),
            gte(submissions.completedAt, today)
          )
        );

      return {
        total: totalResult?.count ?? 0,
        completed: completedResult?.count ?? 0,
        today: todayResult?.count ?? 0,
      };
    }),
});
