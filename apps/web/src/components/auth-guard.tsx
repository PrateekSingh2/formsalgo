"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children, requireAuth = true }: { children: React.ReactNode, requireAuth?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      router.push("/login");
    } else if (!requireAuth && user) {
      // If user is logged in, they shouldn't be on login/signup or landing page
      // They should go to dashboard
      router.push("/dashboard");
    }
  }, [user, loading, router, requireAuth, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBF8]">
        <Loader2 className="w-10 h-10 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  // Prevent flash of protected content before redirect
  if (requireAuth && !user) return null;
  if (!requireAuth && user) return null;

  return <>{children}</>;
}
