import { PenTool, CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  isSuccess: boolean;
  successMessage: string;
  quote?: string;
  author?: string;
  children: ReactNode;
}

/**
 * Shared shell for /login and /signup: split-screen with a quote panel on
 * the left and the auth card on the right. Swaps to a success state once
 * `isSuccess` is true, right before the redirect hook kicks in.
 *
 * `quote`/`author` default to `siteConfig.auth` so both pages stay in sync
 * automatically instead of one hardcoding a copy of the other's text.
 */
export function AuthLayout({
  title,
  subtitle,
  isSuccess,
  successMessage,
  quote = siteConfig.auth?.quote ?? "The scariest moment is always just before you start.",
  author = siteConfig.auth?.author ?? "Stephen King",
  children,
}: AuthLayoutProps) {
  if (isSuccess) return <AuthSuccessScreen message={successMessage} />;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background text-foreground selection:bg-primary/20">
      <AuthHero quote={quote} author={author} />

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

        <div className="w-full max-w-[380px] flex flex-col relative z-10 mx-auto">
          <AuthLogo />

          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
            <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

/** Left-side quote panel. Only rendered on large screens (matches original `hidden lg:flex`). */
function AuthHero({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="hidden lg:flex w-1/2 relative border-r border-border items-center justify-center p-16 overflow-hidden">
      <div className="absolute top-0 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative z-10 max-w-lg text-center space-y-8">
        <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground mx-auto shadow-sm">
          <PenTool className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <blockquote className="space-y-6">
          <h1 className="font-serif font-medium italic text-4xl leading-tight text-foreground drop-shadow-sm">
            {quote}
          </h1>
          <footer className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase">
            {author}
          </footer>
        </blockquote>
      </div>
    </div>
  );
}

/** Square brand mark shown above the form heading. */
function AuthLogo() {
  return (
    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-6 shadow-md mx-auto">
      <span className="font-serif italic font-bold text-xl pr-1 pt-1">{siteConfig.shortName}</span>
    </div>
  );
}

/** Full-screen success state shown briefly before `useAuthRedirect` navigates away. */
function AuthSuccessScreen({ message }: { message: string }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-4">
      <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
