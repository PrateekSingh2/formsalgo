// ============================================================================
// APP ROUTER — Root tRPC router merging all sub-routers
// ============================================================================

import { router } from "../trpc";
import { formRouter } from "./form";
import { fieldRouter } from "./field";
import { submissionRouter } from "./submission";
import { themeRouter } from "./theme";
import { adminRouter } from "./admin";

export const appRouter = router({
  form: formRouter,
  field: fieldRouter,
  submission: submissionRouter,
  theme: themeRouter,
  admin: adminRouter,
});

// Export the router type for client-side consumption
export type AppRouter = typeof appRouter;
