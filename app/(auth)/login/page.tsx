"use client";

import { PenTool } from "lucide-react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { User } from "@/types/user";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [googleLogin, { isLoading, isError }] = useGoogleLoginMutation();

  const handleGoogleSuccess = async ({
    credential: idToken,
  }: CredentialResponse) => {
    if (!idToken) return;
    try {
      const { user, accessToken } = await googleLogin({ idToken }).unwrap();

      // Explicitly map the backend _id to the required frontend id property
      // We cast to unknown first to safely bridge the strict interface gap
      dispatch(
        setCredentials({
          user: { ...user, id: String(user._id) } as unknown as User,
          accessToken,
        }),
      );

      router.push("/");
    } catch (err: unknown) {
      const apiError = err as { data?: { error?: string }; error?: string };
      console.error(
        "Login failed:",
        apiError?.data?.error || apiError?.error || "Unknown server error",
      );
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
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
          <div className="w-full max-w-[380px] flex flex-col items-center relative z-10">
            {/* Logo Block */}
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-6 shadow-md">
              <span className="font-serif italic font-bold text-xl pr-1 pt-1">
                {siteConfig.shortName}
              </span>
            </div>

            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {siteConfig.auth.welcomeTitle}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                {siteConfig.auth.welcomeSubtitle}
              </p>
            </div>

            {/* Google Button */}
            <div className="w-full flex flex-col items-center justify-center min-h-[50px]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error("Google Login Failed")}
                theme="filled_blue"
                size="large"
                shape="rectangular"
                width="300"
                text="continue_with"
              />
              {isLoading && (
                <p className="text-sm text-muted-foreground mt-4 animate-pulse">
                  Connecting to server...
                </p>
              )}
              {isError && (
                <p className="text-sm text-destructive mt-4">
                  Login failed. Please try again.
                </p>
              )}
            </div>

            {/* Footer Links */}
            <p className="mt-10 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
              By continuing, you agree to our <br className="sm:hidden" />
              <a
                href={siteConfig.links.terms}
                className="hover:text-foreground transition-colors underline decoration-border hover:decoration-muted-foreground underline-offset-4"
              >
                Terms
              </a>{" "}
              &{" "}
              <a
                href={siteConfig.links.privacy}
                className="hover:text-foreground transition-colors underline decoration-border hover:decoration-muted-foreground underline-offset-4"
              >
                Privacy
              </a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
