"use client";

import { useParams } from "next/navigation";
import { 
  useGetNovelCharactersQuery, 
  useDeleteCharacterMutation 
} from "@/redux/features/characters/characterApi";

import { useCharacterSearch } from "@/features/characters/hooks/useCharacterSearch";
import { CharactersHeader } from "@/features/characters/components/CharactersHeader";
import { CharacterSearch } from "@/features/characters/components/CharacterSearch";
import { CharacterList } from "@/features/characters/components/CharacterList";

export default function ProjectCharactersPage() {
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;
  const isGlobal = !projectId; // If no projectId is present, we are in the Global view

  const { data, isLoading, isError } = useGetNovelCharactersQuery(projectId || 'global');
  const [deleteCharacter, { isLoading: isDeleting }] = useDeleteCharacterMutation();

  const characters = data?.characters || [];

  // Use the custom hook for search and filtering
  const { searchQuery, setSearchQuery, filteredCharacters } = useCharacterSearch(characters);

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
    <div className="min-h-screen bg-[#131217] text-[#ede9e2] font-sans antialiased overflow-y-auto px-6 md:px-10 py-12 pb-24">
      <div className="max-w-[1280px] mx-auto">
        <CharactersHeader projectId={projectId} newLink={newLink} />

        <CharacterSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <CharacterList 
          characters={filteredCharacters}
          isLoading={isLoading}
          isError={isError}
          projectId={projectId}
          newLink={newLink}
          isDeleting={isDeleting}
          onDelete={handleDelete}
          showNovelTag={isGlobal} // Show the novel tag only in the Global view
        />
      </div>
    </div>
  );
}