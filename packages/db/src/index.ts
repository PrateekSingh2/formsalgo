// ============================================================================
// DATABASE CONNECTION — Drizzle ORM + postgres.js
// ============================================================================

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create the postgres.js connection
const connectionString = process.env.DATABASE_URL!;

// For Supabase, we use connection pooling with specific settings
const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the Drizzle database instance with schema for relational queries
export const db = drizzle(queryClient, { schema });

// Export the schema for use in other packages
export * from "./schema";

// Export the drizzle instance type for tRPC context
export type Database = typeof db;
