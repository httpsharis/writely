"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PenTool, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutation, useLoginMutation } from "@/redux/features/auth/authApi";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const GoogleLoginButton = dynamic(
  () => import("@/components/shared/GoogleLoginButton").then((mod) => mod.GoogleLoginButton),
  { ssr: false, loading: () => <div className="h-[44px] w-[300px] bg-muted animate-pulse rounded-md" /> }
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [googleLogin, { isLoading: isGoogleLoading, isSuccess: isGoogleSuccess, isError: isGoogleError }] = useGoogleLoginMutation();
  const [emailLogin, { isLoading: isEmailLoading, isSuccess: isEmailSuccess, error: emailError }] = useLoginMutation();

  const isLoading = isGoogleLoading || isEmailLoading;
  const isSuccess = isGoogleSuccess || isEmailSuccess;
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.push("/inbox");
    }
  }, [isSuccess, router]);

  const handleGoogleSuccess = async ({ credential: idToken }: CredentialResponse) => {
    if (!idToken) return;
    try {
      await googleLogin({ idToken }).unwrap();
    } catch (err) {
      console.error("Google Login failed:", err);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await emailLogin({ email, password }).unwrap();
    } catch (err) {
      console.error("Email Login failed:", err);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
        <p className="text-sm font-medium text-muted-foreground">Welcome! Redirecting you...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background text-foreground selection:bg-primary/20">
      {/* LEFT SIDE: Hero & Quote */}
      <div className="hidden lg:flex w-1/2 relative border-r border-border items-center justify-center p-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground mx-auto shadow-sm">
            <PenTool className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <blockquote className="space-y-6">
            <h1 className="font-serif font-medium italic text-4xl leading-tight text-foreground drop-shadow-sm">
              {siteConfig.auth.quote}
            </h1>
            <footer className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase">
              {siteConfig.auth.author}
            </footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE: Login Action */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

        <div className="w-full max-w-[380px] flex flex-col relative z-10">
          {/* Logo Block */}
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-6 shadow-md mx-auto">
            <span className="font-serif italic font-bold text-xl pr-1 pt-1">
              {siteConfig.shortName}
            </span>
          </div>

          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              Login to continue your writing journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@writely.com"
                required
                className="w-full h-11 px-4 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
            
            {emailError && (
              <p className="text-xs font-medium text-red-500 text-center">
                {(emailError as any)?.data?.error || "Login failed. Please check your credentials."}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 bg-brand text-white font-bold rounded-xl flex items-center justify-center transition-all hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isEmailLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-bold tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col items-center gap-4">
            <GoogleLoginButton onSuccess={handleGoogleSuccess} isLoading={isLoading} />
          </div>

          {isGoogleError && (
            <p className="text-sm text-red-500 mt-4 text-center">
              Google login failed. Please try again.
            </p>
          )}

          <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-foreground hover:text-brand font-bold transition-colors">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}