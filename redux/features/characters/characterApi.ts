import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface StateWithAuth {
  auth: {
    accessToken: string | null;
  };
}

export interface CharacterReplationship {
  targetCharacterId:
    | string
    | { _id: string; name: string; role: string; avatarUrl?: string };
  relationshipType: string;
  _id?: string;
}

export interface Character {
  _id: string;
  novelId: string;
  name: string;
  role: string;
  bio?: string;
  traits: string[];
  relationships: CharacterReplationship[];
  aliases: string[];
  avatarUrl?: string;
  status: "alive" | "dead" | "unknown";
  createdAt: string;
  updateAt: string;
}

export interface CreateCharacterPayload {
  novelId: string;
  data: Partial<Character>;
}

export interface UpdateCharacterPayload {
  characterId: string;
  data: Partial<Character>;
}

// Api Slice
export const characterApi = createApi({
  reducerPath: "characterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api",
    prepareHeaders(headers, { getState }) {
      const state = getState() as StateWithAuth;
      const token = state.auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Character"],

  endpoints: (builder) => ({
    // GET /api/characters/novel/:novelId
    getNovelCharacters: builder.query<{ characters: Character[] }, string>({
      query: (novelId) => `/character/novel/${novelId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.characters.map(({ _id }) => ({
                type: "Character" as const,
                id: _id,
              })),
              { type: "Character", id: "LIST" },
            ]
          : [{ type: "Character", id: "LIST" }],
    }),

    // POST `/characters/novel/${novelId}`
    createCharacter: builder.mutation<
      { character: Character },
      CreateCharacterPayload
    >({
      query: ({ novelId, data }) => ({
        url: `/characters/novel/${novelId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Character", id: "LIST" }],
    }),

    // PUT /api/characters/:characterId
    updateCharacter: builder.mutation<
      { character: Character },
      UpdateCharacterPayload
    >({
      query: ({ characterId, data }) => ({
        url: `/character/${characterId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { characterId }) => [
        { type: "Character", id: characterId },
      ],
    }),

    // DELETE /api/characters/:characterId
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

    getCharacterById: builder.query<{ character: Character }, string>({
      query: (characterId) => `/character/${characterId}`,
      providesTags: (result, error, id) => [{ type: "Character", id }],
    }),
  }),
});

export const {
  useGetNovelCharactersQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
  useGetCharacterByIdQuery
} = characterApi;
