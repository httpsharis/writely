/**
 * @file characterApi.ts
 * @description RTK Query API slice for character and world-building management.
 * Injects endpoints into the master apiSlice to share the base query and token logic.
 */

import { apiSlice } from "../../api/apiSlice";

/**
 * Defines the relationship between two characters in a novel
 */
export interface CharacterRelationship {
  targetCharacterId: string | { _id: string; name: string; role: string; avatarUrl?: string };
  relationshipType: string;
  _id?: string;
}

/**
 * Character INTERFACE
 * Represents a character within a novel or the global roster
 */
export interface Character {
  _id: string;
  novelId: { _id: string; title: string } | string | null;
  name: string;
  role: string;
  bio?: string;
  traits: string[];
  relationships: CharacterRelationship[];
  aliases: string[];
  avatarUrl?: string;
  status: "alive" | "dead" | "unknown";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterPayload {
  novelId: string;
  data: Partial<Character>;
}

export interface UpdateCharacterPayload {
  characterId: string;
  data: Partial<Character>;
}

/**
 * RTK Query Endpoints for managing characters.
 */
export const characterApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents hot-reload crashes in Next.js development
  endpoints: (builder) => ({
    
    /**
     * Fetches all the characters Associated with a specific Novel.
     * Falls back to 'global' if no novelId is provided.
     */
    getNovelCharacters: builder.query<{ characters: Character[] }, string | undefined>({
      query: (novelId = "global") => `/characters/novel/${novelId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.characters.map(({ _id }) => ({ type: "Character" as const, id: _id })),
              { type: "Character" as const, id: "LIST" },
            ]
          : [{ type: "Character" as const, id: "LIST" }],
    }),

    /**
     * Creates a new character and invalidates the novel's character list cache.
     */
    createCharacter: builder.mutation<{ character: Character }, CreateCharacterPayload>({
      query: ({ novelId, data }) => ({
        url: `/characters/novel/${novelId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Character", id: "LIST" }],
    }),

    /**
     * Updates an existing character's profile, bio, or traits.
     */
    updateCharacter: builder.mutation<{ character: Character }, UpdateCharacterPayload>({
      query: ({ characterId, data }) => ({
        url: `/characters/${characterId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { characterId }) => [
        { type: "Character", id: characterId },
      ],
    }),

    /**
     * Deletes Character by ID
     */
    deleteCharacter: builder.mutation<void, string>({
      query: (characterId) => ({
        url: `/characters/${characterId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, characterId) => [
        { type: "Character", id: "LIST" },
        { type: "Character", id: characterId },
      ],
    }),

    /**
     * Fetches a single character by its unique ID.
     */
    getCharacterById: builder.query<{ character: Character }, string>({
      query: (characterId) => `/characters/${characterId}`,
      providesTags: (result, error, id) => [{ type: "Character", id }],
    }),
    
  }),
});

// Export the auto-generated hooks for your UI components
export const {
  useGetNovelCharactersQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
  useGetCharacterByIdQuery,
} = characterApi;