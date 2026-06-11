"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi"; 
import { useRouter, usePathname } from "next/navigation";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data, isLoading, error } = useGetCurrentUserQuery();

  useEffect(() => {
    // If there is an error (e.g., token expired or no cookie), kick them to login
    if (error && pathname !== "/login") {
      router.push("/login");
    }
  }, [error, router, pathname]);

  // While it's checking the cookie behind the scenes, show a sleek loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If the user is loaded or on the login page, render the app normally!
  return <>{children}</>;
}