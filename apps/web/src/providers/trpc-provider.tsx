// ============================================================================
// TRPC PROVIDER — React Query + tRPC wrapper for Next.js
// ============================================================================

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { TRPCProvider } from "@/lib/trpc";
import type { AppRouter } from "@formforge/trpc";
import superjson from "superjson";
import { auth } from "@/lib/firebase";

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/trpc`,
          transformer: superjson,
          async headers() {
            const user = auth.currentUser;
            if (user) {
              const token = await user.getIdToken();
              return { Authorization: `Bearer ${token}` };
            }
            return {};
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
