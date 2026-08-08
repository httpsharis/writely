import { useState, useMemo } from "react";
import { Character } from "@/redux/features/characters/characterApi";

/**
 * Hook to manage character search and filtering logic.
 * @param characters - The full array of characters to search through.
 * @returns Filtered list of characters and search state/setters.
 */
export function useCharacterSearch(characters: Character[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return characters;

    const query = searchQuery.toLowerCase().trim();

    return characters.filter((char) => {
      // Match name
      if (char.name.toLowerCase().includes(query)) return true;

      // Match role
      if (char.role && char.role.toLowerCase().includes(query)) return true;

      // Match traits
      if (char.traits && char.traits.some((trait) => trait.toLowerCase().includes(query))) {
        return true;
      }

      // Match novel title if populated
      if (char.novelId && typeof char.novelId === "object" && char.novelId.title) {
        if (char.novelId.title.toLowerCase().includes(query)) return true;
      }

      return false;
    });
  }, [characters, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCharacters,
  };
}
