"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Search, Trash2, Users, Loader2 } from "lucide-react";
import { 
  useGetNovelCharactersQuery, 
  useDeleteCharacterMutation 
} from "@/redux/features/characters/characterApi";

export default function ProjectCharactersPage() {
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;

  const { data, isLoading, isError } = useGetNovelCharactersQuery(projectId || 'global');
  const [deleteCharacter, { isLoading: isDeleting }] = useDeleteCharacterMutation();

  const characters = data?.characters || [];

  const handleDelete = async (characterId: string, characterName: string) => {
    if (confirm(`Are you sure you want to delete ${characterName}?`)) {
      try {
        await deleteCharacter(characterId).unwrap();
      } catch (err) {
        console.error("Failed to delete character:", err);
      }
    }
  };

  const newLink = projectId ? `/project/${projectId}/characters/new` : `/characters/new`;

  return (
    <div className="min-h-screen bg-[#131217] text-[#ede9e2] font-sans antialiased overflow-y-auto px-10 py-12 pb-20">
      <div className="max-w-[1180px] mx-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-12">
          <div className="w-full">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-[#5c5868] mb-2.5">
              <span className="w-3 h-3"><Users className="w-full h-full" /></span>
              {projectId ? "Novel Roster" : "Global Cast"}
            </div>
            <h1 className="font-serif font-medium text-[40px] tracking-[-0.01em] m-0 text-[#ede9e2]">
              Characters
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 pt-1">
            <Link 
              href={newLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-transparent bg-[#c9975a] text-[#131217] text-sm font-semibold transition-all hover:bg-[#d8a86c] hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(201,151,90,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Add Character
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-[400px]">
          <div className="flex items-center gap-3 bg-[#1b1a21] p-3 rounded-xl border border-[rgba(255,255,255,0.07)] focus-within:border-[#c9975a] transition-colors">
            <Search className="w-4 h-4 text-[#5c5868]" />
            <input 
              type="text" 
              placeholder="Search roster..." 
              className="bg-transparent border-none outline-none text-[13px] font-medium w-full text-[#ede9e2] placeholder:text-[#5c5868]"
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-[#c9975a] gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-400 gap-4">
            <p className="text-sm font-bold">Failed to load characters.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => {
              const editLink = projectId ? `/project/${projectId}/characters/${char._id}` : `/characters/${char._id}`;
              
              return (
                <div 
                  key={char._id} 
                  className="group relative flex flex-col rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1b1a21] overflow-hidden transition-all hover:border-[rgba(255,255,255,0.15)] hover:shadow-xl hover:-translate-y-1"
                >
                  <Link href={editLink} className="relative aspect-[4/3] w-full overflow-hidden bg-[#29272f] flex items-center justify-center">
                    {char.avatarUrl ? (
                      <img 
                        src={char.avatarUrl} 
                        alt={char.name} 
                        className="w-full h-full object-cover grayscale-[40%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                      />
                    ) : (
                      <Users className="w-16 h-16 text-[#5c5868] opacity-30 transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1a21] via-[rgba(27,26,33,0.4)] to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <h3 className="font-serif text-[22px] font-medium text-[#ede9e2] leading-tight mb-1">
                          {char.name}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9975a]">
                          {char.role || "Unassigned"}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-[rgba(19,18,23,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-[#ede9e2] uppercase tracking-wider">
                        {char.status}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {char.traits && char.traits.length > 0 ? (
                        char.traits.slice(0, 3).map((trait, idx) => (
                          <span key={idx} className="px-2 py-1 rounded bg-[#29272f] border border-[rgba(255,255,255,0.05)] text-[10px] font-medium text-[#948fa0]">
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
                        className="text-[11px] font-semibold text-[#948fa0] uppercase tracking-wider hover:text-[#ede9e2] transition-colors"
                      >
                        Edit Profile
                      </Link>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleDelete(char._id, char.name); }}
                        disabled={isDeleting}
                        className="text-[#5c5868] hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {characters.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-[rgba(255,255,255,0.14)] rounded-2xl bg-[#1b1a21]/50">
                <Users className="w-12 h-12 text-[#5c5868] mb-4" />
                <p className="font-serif text-[20px] text-[#948fa0] mb-2">No characters found.</p>
                <p className="text-[13px] text-[#5c5868] max-w-sm mb-6">Create your first character to start populating this world.</p>
                <Link 
                  href={newLink}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(255,255,255,0.1)] text-[13px] font-semibold text-[#ede9e2] hover:bg-[#29272f] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Character
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}