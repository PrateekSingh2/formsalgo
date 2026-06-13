// ============================================================================
// THEME ROUTER — Theme management and marketplace
// ============================================================================

import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { themes } from "@formforge/db";

export const themeRouter = router({
  // Get all built-in themes
  getBuiltIn: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.themes.findMany({
      where: eq(themes.isBuiltIn, true),
      orderBy: [desc(themes.createdAt)],
    });
  }),

  // Get all public themes (marketplace)
  getMarketplace: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.themes.findMany({
        where: and(
          eq(themes.isMarketplace, true),
          eq(themes.isPublic, true)
        ),
        orderBy: [desc(themes.downloads)],
        limit: input?.limit ?? 20,
        offset: input?.offset ?? 0,
        with: {
          creator: true,
        },
      });
    }),

  // Get a single theme
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const theme = await ctx.db.query.themes.findFirst({
        where: eq(themes.id, input.id),
        with: {
          creator: true,
        },
      });

      if (!theme) {
        throw new Error("Theme not found");
      }

      return theme;
    }),

  // Get themes created by the current user
  getMine: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.themes.findMany({
      where: eq(themes.creatorId, ctx.user.id),
      orderBy: [desc(themes.updatedAt)],
    });
  }),

  // Create a new theme
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        colors: z.record(z.string(), z.string()),
        typography: z.record(z.string(), z.unknown()),
        spacing: z.record(z.string(), z.unknown()),
        animations: z.record(z.string(), z.unknown()),
        texture: z.string().default("none"),
        isPublic: z.boolean().default(false),
        isMarketplace: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [theme] = await ctx.db
        .insert(themes)
        .values({
          creatorId: ctx.user.id,
          ...input,
        })
        .returning();

      return theme;
    }),
});
