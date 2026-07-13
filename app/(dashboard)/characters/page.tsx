"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Search, Book, Trash2, Users, PlusCircle, Loader2 } from "lucide-react";
import { 
  useGetNovelCharactersQuery, 
  useDeleteCharacterMutation 
} from "@/redux/features/characters/characterApi"; // Adjust path if needed

export default function ProjectCharactersPage() {
  const params = useParams();
  // Depending on your folder structure, it might be params.id or params.projectId
  const projectId = (params.projectId || params.id) as string;

  // 1. Fetch real data from Redux
  const { data, isLoading, isError } = useGetNovelCharactersQuery(projectId, {
    skip: !projectId, // Don't fetch until we have the ID from the URL
  });

  // 2. Setup Delete Mutation
  const [deleteCharacter, { isLoading: isDeleting }] = useDeleteCharacterMutation();

  const characters = data?.characters || [];

  // Handle Delete Action
  const handleDelete = async (characterId: string, characterName: string) => {
    if (confirm(`Are you sure you want to completely delete ${characterName}? This cannot be undone.`)) {
      try {
        await deleteCharacter(characterId).unwrap();
      } catch (err) {
        console.error("Failed to delete character:", err);
      }
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-12 md:py-24 animate-in fade-in duration-500 overflow-y-auto no-scrollbar h-screen bg-background">
      <div className="w-full max-w-[720px] flex flex-col gap-12 pb-32">
        
        {/* Section 1: Header & Actions */}
        <div className="flex flex-col gap-6 border-b border-border/20 pb-8">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black text-foreground tracking-tight drop-shadow-sm">
                Characters
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Manage the entities assigned to this novel.
              </p>
            </div>
            
            {/* 🔴 FIXED: Primary Action is now a dynamic Link */}
            <Link 
              href={`/characters/new`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all font-bold shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4 bg-secondary/20 p-3 rounded-2xl border border-border/20 focus-within:border-primary/30 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground ml-2" />
            <input 
              type="text" 
              placeholder="Search by name, role, or traits..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-bold animate-pulse">Loading roster...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-500/80 gap-4">
            <p className="text-sm font-bold">Failed to load characters. Please try again.</p>
          </div>
        )}

        {/* Section 2: The Grid (Real Data) */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {characters.map((char) => (
              <div 
                key={char._id} 
                className="flex flex-col rounded-[2rem] border border-border/20 overflow-hidden bg-secondary/5 hover:bg-secondary/10 transition-colors group relative"
              >
                {/* Card Header: Large Portrait */}
                <Link href={`/project/${projectId}/characters/${char._id}`} className="block relative w-full aspect-[4/5] bg-secondary/20 overflow-hidden border-b border-border/20">
                  <img 
                    src={char.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=800&q=80"} // Fallback image
                    alt={char.name} 
                    className="w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                    {char.status}
                  </div>
                </Link>

                {/* Card Body: Details & Controls */}
                <div className="flex flex-col gap-6 p-6 flex-1">
                  
                  {/* Info Header with Global Delete Button */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <Link href={`/project/${projectId}/characters/${char._id}`}>
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {char.name}
                        </h3>
                      </Link>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        {char.role}
                      </span>
                    </div>
                    
                    {/* Global Character Delete Button connected to Redux */}
                    <button 
                      onClick={() => handleDelete(char._id, char.name)}
                      disabled={isDeleting}
                      className="shrink-0 p-2 text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all active:scale-90 disabled:opacity-50"
                      title={`Delete ${char.name}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Traits / Aliases Preview */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                      <span>Quick Details</span>
                    </span>
                    
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {char.traits && char.traits.length > 0 ? (
                        char.traits.slice(0, 3).map((trait, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-md bg-background border border-border/30 text-[10px] font-bold text-foreground/80 uppercase tracking-widest">
                            {trait}
                          </span>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border/30 border-dashed text-xs font-bold text-muted-foreground/60 w-full">
                          <Users className="w-3.5 h-3.5" />
                          No traits defined
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* 🔴 FIXED: Empty State Fallback now has a link too! */}
            {characters.length === 0 && (
              <div className="col-span-1 sm:col-span-2 py-20 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground bg-secondary/10 rounded-[2rem] border border-border/20">
                <Users className="w-10 h-10 opacity-20" />
                <p className="text-sm font-medium">No characters found for this project. Create one to begin.</p>
                <Link 
                  href={`/project/${projectId}/characters/new`}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border/30 hover:border-primary/50 text-xs font-bold text-foreground transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-muted-foreground" />
                  Create First Character
                </Link>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}