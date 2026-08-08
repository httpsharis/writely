import { User, Eye, Brain, BookOpen } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10 mt-10 px-2">
      
      {/* Left Column: Portrait and Traits */}
      <div className="lg:col-span-4 flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          {avatarUrl ? (
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.05)]">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-full aspect-[3/4] rounded-2xl bg-[#17161b] border border-[rgba(255,255,255,0.03)] flex flex-col items-center justify-center text-[#5c5868] gap-4 shadow-inner">
              <User className="w-12 h-12 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Portrait</span>
            </div>
          )}
        </div>

        {traits.length > 0 && (
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-[#5c5868] uppercase tracking-widest">Core Traits</span>
            <div className="flex flex-wrap gap-2.5">
              {traits.map(trait => (
                <span key={trait} className="px-3.5 py-1.5 rounded-full bg-[#17161b] border border-[rgba(201,151,90,0.15)] text-[11px] font-bold tracking-wide text-[#c9975a]">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Bio Details */}
      <div className="lg:col-span-8 flex flex-col gap-14 pt-2">
        {/* Physical Appearance */}
        <div className="flex flex-col gap-4 group">
          <h3 className="text-[11px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-[#c9975a] opacity-80 group-hover:opacity-100 transition-opacity" /> 
            Physical Appearance
          </h3>
          <p className="font-serif text-[18px] leading-[1.8] text-[#ede9e2]/90 whitespace-pre-wrap font-light">
            {appearance || <span className="italic text-[#5c5868] font-sans text-[14px]">No physical appearance documented.</span>}
          </p>
        </div>

        {/* Personality & Flaws */}
        <div className="flex flex-col gap-4 group">
          <h3 className="text-[11px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2.5">
            <Brain className="w-4 h-4 text-[#7cbf8e] opacity-80 group-hover:opacity-100 transition-opacity" /> 
            Personality & Flaws
          </h3>
          <p className="font-serif text-[18px] leading-[1.8] text-[#ede9e2]/90 whitespace-pre-wrap font-light">
            {personality || <span className="italic text-[#5c5868] font-sans text-[14px]">No personality documented.</span>}
          </p>
        </div>

        {/* Backstory & History */}
        <div className="flex flex-col gap-4 group">
          <h3 className="text-[11px] font-bold text-[#5c5868] uppercase tracking-widest flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#e07a5f] opacity-80 group-hover:opacity-100 transition-opacity" /> 
            Backstory & History
          </h3>
          <p className="font-serif text-[18px] leading-[1.8] text-[#ede9e2]/90 whitespace-pre-wrap font-light">
            {history || <span className="italic text-[#5c5868] font-sans text-[14px]">No history documented.</span>}
          </p>
        </div>
      </div>

    </div>
  );
}
