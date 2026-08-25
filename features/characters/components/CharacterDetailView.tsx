import { User, Eye, Brain, BookOpen } from "lucide-react";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/cloudinary";

interface CharacterDetailViewProps {
  avatarUrl: string;
  name: string;
  traits: string[];
  appearance: string;
  personality: string;
  history: string;
}

/**
 * Renders the read-only view of the Character Details.
 * Uses a minimal UI design with ample whitespace and clean typography.
 */
export function CharacterDetailView({
  avatarUrl,
  name,
  traits,
  appearance,
  personality,
  history,
}: CharacterDetailViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10 mt-8 px-2">
      
      {/* Left Column: Portrait and Traits */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          {avatarUrl ? (
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-border bg-card">
              <Image
                src={getAvatarUrl(avatarUrl, 600)}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-full aspect-[3/4] rounded-2xl bg-secondary/30 border border-border flex flex-col items-center justify-center text-muted-foreground gap-4">
              <User className="w-12 h-12 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">No Portrait</span>
            </div>
          )}
        </div>

        {traits.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Core Traits</span>
            <div className="flex flex-wrap gap-2">
              {traits.map(trait => (
                <span key={trait} className="px-3.5 py-1.5 rounded-full bg-secondary/40 border border-border text-[11px] font-bold tracking-wide text-brand">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Bio Details */}
      <div className="lg:col-span-8 flex flex-col gap-10 sm:gap-14 pt-2">
        {/* Physical Appearance */}
        <div className="flex flex-col gap-3 group">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-brand opacity-80 group-hover:opacity-100 transition-opacity" /> 
            Physical Appearance
          </h3>
          <p className="font-serif text-[17px] sm:text-[18px] leading-[1.8] text-foreground/90 whitespace-pre-wrap font-normal">
            {appearance || <span className="italic text-muted-foreground font-sans text-sm">No physical appearance documented.</span>}
          </p>
        </div>

        {/* Personality & Flaws */}
        <div className="flex flex-col gap-3 group">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2.5">
            <Brain className="w-4 h-4 text-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" /> 
            Personality & Flaws
          </h3>
          <p className="font-serif text-[17px] sm:text-[18px] leading-[1.8] text-foreground/90 whitespace-pre-wrap font-normal">
            {personality || <span className="italic text-muted-foreground font-sans text-sm">No personality documented.</span>}
          </p>
        </div>

        {/* Backstory & History */}
        <div className="flex flex-col gap-3 group">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" /> 
            Backstory & History
          </h3>
          <p className="font-serif text-[17px] sm:text-[18px] leading-[1.8] text-foreground/90 whitespace-pre-wrap font-normal">
            {history || <span className="italic text-muted-foreground font-sans text-sm">No history documented.</span>}
          </p>
        </div>
      </div>

    </div>
  );
}
