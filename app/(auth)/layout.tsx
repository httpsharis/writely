import { PenTool } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const quote = siteConfig.auth.quote;
  const author = siteConfig.auth.author;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background text-foreground selection:bg-primary/20">
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

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

        <div className="w-full flex flex-col items-center relative z-10 mx-auto">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-8 shadow-md mx-auto">
            <span className="font-serif italic font-bold text-xl pr-1 pt-1">{siteConfig.shortName}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
