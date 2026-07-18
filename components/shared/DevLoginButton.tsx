"use client";

import { useDevLoginMutation } from "@/redux/features/auth/authApi";
import { Loader2 } from "lucide-react";

export default function DevLoginButton() {
  const [devLogin, { isLoading }] = useDevLoginMutation();

  const handleDevLogin = async () => {
    try {
      // 1. Call the API
      await devLogin().unwrap();
      
      // 2. That's it! 
      // The onQueryStarted in authApi.ts automatically dispatches setCredentials.
      // The AuthWrapper automatically detects the new user and redirects to "/".
    } catch (error) {
      console.error("Dev login failed. Is your backend running?", error);
    }
  };

  // 🛑 ULTIMATE SAFETY: Do not render if not in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <button
      onClick={handleDevLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-4 
                 bg-gray-900 text-white rounded-md font-medium
                 hover:bg-gray-800 transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Logging in...
        </>
      ) : (
        "🔥 Login as Dev User (Local Only)"
      )}
    </button>
  );
}