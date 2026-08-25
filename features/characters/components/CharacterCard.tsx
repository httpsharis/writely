import Link from "next/link";
import { Users, Trash2, Book } from "lucide-react";
import Image from "next/image";
import { Character } from "@/redux/features/characters/characterApi";
import { getAvatarUrl } from "@/lib/cloudinary";

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
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-1">
      <Link
        href={editLink}
        className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/30 flex items-center justify-center"
      >
        {char.avatarUrl ? (
          <Image
            src={getAvatarUrl(char.avatarUrl, 360)}
            alt={char.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover grayscale-[15%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <Users className="w-16 h-16 text-muted-foreground opacity-30 transition-transform duration-700 group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          <div>
            <h3 className="font-serif text-[22px] sm:text-[24px] font-medium text-foreground leading-tight mb-1 drop-shadow-md">
              {char.name}
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand drop-shadow-sm">
              {char.role || "Unassigned"}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-card/80 backdrop-blur-md border border-border text-[10px] font-bold text-foreground uppercase tracking-wider">
            {char.status}
          </span>
        </div>

        {/* Novel Tag Badge */}
        {showNovelTag && novelTitle && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-md border border-border flex items-center gap-1.5 z-10">
            <Book className="w-3 h-3 text-brand" />
            <span className="text-[10px] font-semibold text-foreground max-w-[120px] truncate">
              {novelTitle}
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1 relative z-10 bg-card">
        <div className="flex flex-wrap gap-2 mb-4">
          {char.traits && char.traits.length > 0 ? (
            char.traits.slice(0, 3).map((trait, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border text-xs font-medium text-muted-foreground transition-colors group-hover:bg-secondary"
              >
                {trait}
              </span>
            ))
          ) : (
            <span className="text-[11px] italic text-muted-foreground">No traits defined</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <Link
            href={editLink}
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-brand transition-colors"
          >
            Edit Profile
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(char._id, char.name);
            }}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 hover:bg-destructive/10 p-2 rounded-md cursor-pointer"
            title="Delete character"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
