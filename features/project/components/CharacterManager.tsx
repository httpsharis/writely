"use client";

import { Plus, X, Users, Settings } from "lucide-react";
import type { ExtendedProject } from "../hooks/useProjectHub";
import { 
  useGetNovelCharactersQuery, 
  useDeleteCharacterMutation 
} from "@/redux/features/characters/characterApi";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CharacterSidebar } from "@/features/characters/components/CharacterSidebar";

interface CharacterManagerProps {
  project: ExtendedProject;
  handleUpdate: <K extends keyof ExtendedProject>(
    field: K,
    value: ExtendedProject[K],
  ) => Promise<void>;
}

export function CharacterManager({ project }: CharacterManagerProps) {
  const { data, isLoading } = useGetNovelCharactersQuery(project._id);
  const characters = data?.characters || [];
  const [deleteCharacter] = useDeleteCharacterMutation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setActiveCharacterId(null);
    setIsSidebarOpen(true);
  };

  const handleOpenView = (id: string) => {
    setActiveCharacterId(id);
    setIsSidebarOpen(true);
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (confirm("Are you sure you want to delete this character?")) {
      await deleteCharacter(characterId);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#5c5868] flex items-center gap-2">
          <Users className="w-4 h-4" />
          Characters
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c9975a] hover:text-[#ede9e2] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
          <Link
            href={`/project/${project._id}/characters`}
            className="flex items-center gap-1.5 text-xs font-medium text-[#5c5868] hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Manage
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <span className="text-[#5c5868] text-xs">Loading characters...</span>
        </div>
      ) : characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/10 rounded-lg">
          <p className="text-sm font-serif text-[#5c5868] italic text-center mb-4">
            No characters added yet. Mentioning characters adds depth to your story.
          </p>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 text-xs font-medium bg-[#c9975a]/10 text-[#c9975a] hover:bg-[#c9975a] hover:text-black px-4 py-2 rounded-full transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Character
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {characters.map((char) => (
            <button
              onClick={() => handleOpenView(char._id)}
              key={char._id}
              className="group relative flex items-start text-left gap-4 p-4 rounded-xl border border-white/5 bg-[#17161b] hover:bg-[#1a1920] hover:border-[#c9975a]/30 transition-all shadow-sm"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#c9975a]/40 transition-colors">
                {char.avatarUrl ? (
                  <Image src={char.avatarUrl} alt={char.name} width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#948fa0] text-sm font-bold uppercase group-hover:text-[#ede9e2] transition-colors">
                    {char.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-[#ede9e2] text-sm font-serif font-bold truncate mb-1.5 flex items-center gap-2 group-hover:text-[#c9975a] transition-colors">
                  {char.name}
                  {char.role && (
                    <span className="text-[9px] uppercase tracking-wider text-[#c9975a] border border-[#c9975a]/20 px-1.5 py-0.5 rounded-sm">
                      {char.role}
                    </span>
                  )}
                </h4>
                <p className="text-[#948fa0] text-xs line-clamp-2 leading-relaxed group-hover:text-[#ede9e2]/80 transition-colors">
                  {char.bio || "No description provided."}
                </p>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening sidebar when clicking delete
                  handleDeleteCharacter(char._id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-black/40 text-[#5c5868] opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-black transition-all cursor-pointer"
                title="Delete Character"
              >
                <X className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      )}
      
      <CharacterSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projectId={project._id}
        characterId={activeCharacterId}
      />
    </div>
  );
}
