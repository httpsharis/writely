"use client";

import { signIn } from "next-auth/react";
import { PenTool } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="h-screen w-full flex overflow-hidden bg-background text-foreground selection:bg-foreground/20">

            <div className="hidden lg:flex w-1/2 relative border-r border-white/10 items-center justify-center p-16 overflow-hidden">

                <div className="absolute top-0 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-lg text-center space-y-8">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 mx-auto shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)]">
                        <PenTool className="w-6 h-6" strokeWidth={1.5} />
                    </div>

                    <blockquote className="space-y-6">
                        <h1 className="font-serif font-medium italic text-4xl leading-tight text-white/90 drop-shadow-sm">
                            "The scariest moment is always just before you start."
                        </h1>
                        <footer className="text-xs font-bold text-neutral-500 tracking-[0.2em] uppercase">
                            — Stephen King
                        </footer>
                    </blockquote>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />

                <div className="w-full max-w-[380px] flex flex-col items-center relative z-10">

                    <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(255,255,255,0.15)]">
                        <span className="font-serif italic font-bold text-xl pr-1 pt-1">W_</span>
                    </div>

                    <div className="text-center mb-8 space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white/95">
                            Welcome to Writely
                        </h2>
                        <p className="text-sm font-medium text-neutral-400">
                            Log in or sign up to continue your story.
                        </p>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200 font-medium text-sm shadow-sm cursor-pointer"
                    >
                        <svg className="w-4 h-4 bg-white rounded-full p-[1px]" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="mt-10 text-center text-[10px] font-medium text-neutral-500 uppercase tracking-widest leading-relaxed">
                        By continuing, you agree to our <br className="sm:hidden" />
                        <a href="/terms" className="hover:text-white transition-colors underline decoration-neutral-800 hover:decoration-neutral-600 underline-offset-4">Terms</a> &{" "}
                        <a href="/privacy" className="hover:text-white transition-colors underline decoration-neutral-800 hover:decoration-neutral-600 underline-offset-4">Privacy</a>
                    </p>

                </div>
            </div>

        </div>
    );
}