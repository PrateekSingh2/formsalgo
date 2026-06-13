// ============================================================================
// TRPC CLIENT — Next.js tRPC integration
// ============================================================================

"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@formforge/trpc";
import superjson from "superjson";
import { auth } from "@/lib/firebase";

// Create the tRPC + TanStack Query integration
const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export { TRPCProvider, useTRPC, useTRPCClient };

// Standalone vanilla tRPC client (for use outside React)
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/trpc`,
      transformer: superjson,
      async headers() {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          return {
            Authorization: `Bearer ${token}`,
          };
        }
        return {};
      },
    }),
  ],
});
