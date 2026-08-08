import Link from "next/link";
import { Users, Trash2, Book } from "lucide-react";
import { Character } from "@/redux/features/characters/characterApi";

interface CharacterCardProps {
  char: Character;
  editLink: string;
  isDeleting: boolean;
  onDelete: (id: string, name: string) => void;
  showNovelTag?: boolean;
}

/**
 * Renders a single Character Card.
 * Displays character avatar, name, role, traits, and an optional novel tag.
 */
export function CharacterCard({
  char,
  editLink,
  isDeleting,
  onDelete,
  showNovelTag = false,
}: CharacterCardProps) {
  // Ensure we safely extract the novel title if it exists
  const novelTitle = char.novelId && typeof char.novelId === "object" ? char.novelId.title : null;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1b1a21] overflow-hidden transition-all duration-300 hover:border-[#c9975a]/30 hover:shadow-[0_8px_30px_rgba(201,151,90,0.1)] hover:-translate-y-1">
      <Link
        href={editLink}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#29272f] flex items-center justify-center"
      >
        {char.avatarUrl ? (
          <img
            src={char.avatarUrl}
            alt={char.name}
            className="w-full h-full object-cover grayscale-[20%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <Users className="w-16 h-16 text-[#5c5868] opacity-30 transition-transform duration-700 group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1a21] via-[#1b1a21]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          <div>
            <h3 className="font-serif text-[24px] font-medium text-[#ede9e2] leading-tight mb-1 drop-shadow-md">
              {char.name}
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c9975a] drop-shadow-sm">
              {char.role || "Unassigned"}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-[rgba(19,18,23,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-[#ede9e2] uppercase tracking-wider">
            {char.status}
          </span>
        </div>

        {/* Novel Tag Badge */}
        {showNovelTag && novelTitle && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[rgba(19,18,23,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] flex items-center gap-1.5 z-10">
            <Book className="w-3 h-3 text-[#c9975a]" />
            <span className="text-[10px] font-semibold text-[#ede9e2] max-w-[120px] truncate">
              {novelTitle}
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1 relative z-10 bg-[#1b1a21]">
        <div className="flex flex-wrap gap-2 mb-4">
          {char.traits && char.traits.length > 0 ? (
            char.traits.slice(0, 3).map((trait, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-[#29272f] border border-[rgba(255,255,255,0.05)] text-[11px] font-medium text-[#948fa0] transition-colors group-hover:bg-[#34313d]"
              >
                {trait}
              </span>
            ))
          ) : (
            <span className="text-[11px] italic text-[#5c5868]">No traits defined</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.07)] pt-4">
          <Link
            href={editLink}
            className="text-[11px] font-semibold text-[#948fa0] uppercase tracking-wider hover:text-[#c9975a] transition-colors"
          >
            Edit Profile
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(char._id, char.name);
            }}
            disabled={isDeleting}
            className="text-[#5c5868] hover:text-red-400 transition-colors disabled:opacity-50 hover:bg-red-400/10 p-2 rounded-md"
            title="Delete character"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
