// ============================================================================
// tRPC INITIALIZATION — Core setup with context, middleware, and procedures
// ============================================================================

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Database } from "@formforge/db";

// ============================================================================
// CONTEXT — Available in every procedure
// ============================================================================

export interface TRPCContext {
  db: Database;
  user: {
    id: string;
    firebaseUid: string;
    email: string;
    role: string;
  } | null;
}

// ============================================================================
// TRPC INSTANCE
// ============================================================================

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error ? error.cause.message : null,
      },
    };
  },
});

// ============================================================================
// EXPORTS — Router, procedures, middleware
// ============================================================================

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// ============================================================================
// AUTH MIDDLEWARE — Ensures user is logged in
// ============================================================================

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

// ============================================================================
// ADMIN MIDDLEWARE — Ensures user is a superadmin
// ============================================================================

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in.",
    });
  }
  if (ctx.user.role !== "superadmin" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const adminProcedure = t.procedure.use(isAdmin);
