import Link from "next/link";
import { Plus, Users, Loader2 } from "lucide-react";
import { Character } from "@/redux/features/characters/characterApi";
import { CharacterCard } from "./CharacterCard";

interface CharacterListProps {
  characters: Character[];
  isLoading: boolean;
  isError: boolean;
  projectId: string | undefined;
  newLink: string;
  isDeleting: boolean;
  onDelete: (id: string, name: string) => void;
  showNovelTag?: boolean;
}

/**
 * Renders the grid of Character Cards.
 * Handles loading, error, and empty states.
 */
export function CharacterList({
  characters,
  isLoading,
  isError,
  projectId,
  newLink,
  isDeleting,
  onDelete,
  showNovelTag = false,
}: CharacterListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#c9975a] gap-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-[13px] font-medium text-[#948fa0] animate-pulse">Loading roster...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-400 gap-4">
        <p className="text-sm font-bold">Failed to load characters.</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="col-span-full py-28 flex flex-col items-center justify-center text-center border border-dashed border-[rgba(255,255,255,0.14)] rounded-2xl bg-[#1b1a21]/50 shadow-inner">
        <Users className="w-14 h-14 text-[#5c5868] mb-5 opacity-80" />
        <p className="font-serif text-[22px] text-[#ede9e2] mb-2 font-medium">No characters found</p>
        <p className="text-[14px] text-[#5c5868] max-w-sm mb-8 leading-relaxed">
          It looks empty here. Create your first character to start populating this world.
        </p>
        <Link
          href={newLink}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-[13px] font-bold uppercase tracking-wider text-[#ede9e2] hover:bg-[#29272f] hover:border-[rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#c9975a]" />
          Add Character
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {characters.map((char) => {
        const editLink = projectId
          ? `/project/${projectId}/characters/${char._id}`
          : `/characters/${char._id}`;

        return (
          <CharacterCard
            key={char._id}
            char={char}
            editLink={editLink}
            isDeleting={isDeleting}
            onDelete={onDelete}
            showNovelTag={showNovelTag}
          />
        );
      })}
    </div>
  );
}
