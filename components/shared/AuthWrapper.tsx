"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useRouter, usePathname } from "next/navigation";

const authPages = ["/login"];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  useEffect(() => {
    // Token invalid/expired → go to login
    if (error && !authPages.includes(pathname)) {
      router.push("/login");
    }
  }, [error, router, pathname]);

  useEffect(() => {
    // Already authenticated → redirect away from auth pages
    if (user && authPages.includes(pathname)) {
      router.push("/");
    }
  }, [user, router, pathname]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
