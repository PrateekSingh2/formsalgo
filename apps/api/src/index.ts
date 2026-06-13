// ============================================================================
// FASTIFY API SERVER — FormForge Backend
// ============================================================================
// Fastify v5 with tRPC adapter, Firebase Admin auth, and Drizzle ORM.
// All API communication is done through tRPC — no REST endpoints.
// ============================================================================

import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "@formforge/trpc";
import type { TRPCContext } from "@formforge/trpc";
import { db } from "@formforge/db";
import { users } from "@formforge/db";
import { eq } from "drizzle-orm";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ============================================================================
// FIREBASE ADMIN INITIALIZATION
// ============================================================================

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const firebaseAuth = getAuth();

// ============================================================================
// CREATE TRPC CONTEXT — Extract user from Firebase token
// ============================================================================

async function createContext({
  req,
}: {
  req: { headers: Record<string, string | string[] | undefined> };
}): Promise<TRPCContext> {
  const authHeader = req.headers.authorization;
  let user: TRPCContext["user"] = null;

  if (authHeader && typeof authHeader === "string") {
    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = await firebaseAuth.verifyIdToken(token);

      // Look up user in our database
      const dbUser = await db.query.users.findFirst({
        where: eq(users.firebaseUid, decoded.uid),
      });

      if (dbUser) {
        user = {
          id: dbUser.id,
          firebaseUid: dbUser.firebaseUid,
          email: dbUser.email,
          role: dbUser.role,
        };
      }
    } catch (error) {
      // Invalid token — user stays null (unauthenticated)
      console.warn("Invalid auth token:", (error as Error).message);
    }
  }

  return { db, user };
}

// ============================================================================
// SERVER SETUP
// ============================================================================

async function startServer() {
  const server = Fastify({
    logger: true,
    maxParamLength: 5000,
  });

  // CORS for web app
  await server.register(cors, {
    origin: [
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  });

  // Register tRPC plugin — this is our ONLY API layer
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });

  // Health check (the only non-tRPC endpoint)
  server.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Start listening
  const port = parseInt(process.env.PORT || "3001", 10);
  const host = process.env.HOST || "0.0.0.0";

  try {
    await server.listen({ port, host });
    console.log(`🚀 FormForge API running on http://${host}:${port}`);
    console.log(`📡 tRPC endpoint: http://${host}:${port}/trpc`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
