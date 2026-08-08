import Link from "next/link";
import { ArrowLeft, Pencil, Book, Sparkles } from "lucide-react";

interface CharacterDetailHeaderProps {
  backLink: string;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  name: string;
  role: string;
  assignedNovel?: { title: string };
}

/**
 * Renders the top navigation and title area for the Character Details page.
 */
export function CharacterDetailHeader({
  backLink,
  isEditing,
  setIsEditing,
  name,
  role,
  assignedNovel,
}: CharacterDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full">
        <Link
          href={backLink}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#5c5868] hover:text-[#ede9e2] transition-colors w-fit group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Roster
        </Link>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(255,255,255,0.03)] text-[#ede9e2] hover:bg-[rgba(255,255,255,0.08)] transition-colors text-[11px] font-bold uppercase tracking-widest border border-[rgba(255,255,255,0.05)] shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Mode
          </button>
        )}
      </div>

      {/* Main Title Area */}
      <div className="flex flex-col gap-3 relative z-10 px-2">
        <h1 className="font-serif text-[48px] font-medium text-[#ede9e2] tracking-tight flex items-center gap-3 leading-none drop-shadow-sm">
          {isEditing ? "Edit Character" : name || "Unnamed Character"}
          {isEditing && <Sparkles className="w-8 h-8 text-[#c9975a]" />}
        </h1>
        
        <p className="text-[14px] text-[#948fa0] font-medium flex items-center gap-2">
          {isEditing ? (
            "Update the core identity, roles, and narrative traits."
          ) : (
            <span className="capitalize text-[#c9975a] font-bold tracking-wider">{role} Character</span>
          )}
          
          {!isEditing && assignedNovel && (
            <span className="flex items-center gap-1.5 opacity-60">
              <span className="w-1 h-1 rounded-full bg-current" />
              <Book className="w-3.5 h-3.5" />
              {assignedNovel.title}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
