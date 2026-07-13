"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetCharacterByIdQuery } from "@/redux/features/characters/characterApi"; // Adjust path
import CharacterHero from "@/components/characters/characterDetails/CharacterHero";
import CharacterMeta from "@/components/characters/characterDetails/CharacterMeta";
import CharacterTraits from "@/components/characters/characterDetails/CharacterTraits";

export default function CharacterProfilePage() {
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;
  const characterId = params.characterId as string;

  const [activeTab, setActiveTab] = useState("Overview");

  // Fetch real character data
  const { data, isLoading, isError } = useGetCharacterByIdQuery(characterId, {
    skip: !characterId,
  });

  const character = data?.character;

  // Smart Parser: Because we combined Appearance, Personality, and History into a single 'bio'
  // string during creation, we parse it back out here for the tabs.
  const parsedLore = useMemo(() => {
    if (!character?.bio)
      return { appearance: "", personality: "", history: character?.bio || "" };

    const bioStr = character.bio;

    // Extract sections using regex based on our Markdown compilation format
    const appearanceMatch = bioStr.match(
      /\*\*Physical Appearance & Body\*\*\n([\s\S]*?)(?=\*\*|$)/,
    );
    const personalityMatch = bioStr.match(
      /\*\*Personality & Flaws\*\*\n([\s\S]*?)(?=\*\*|$)/,
    );
    const historyMatch = bioStr.match(
      /\*\*Backstory & History\*\*\n([\s\S]*?)(?=\*\*|$)/,
    );

    return {
      appearance: appearanceMatch ? appearanceMatch[1].trim() : "",
      personality: personalityMatch ? personalityMatch[1].trim() : "",
      history: historyMatch ? historyMatch[1].trim() : bioStr, // Fallback to full bio if parsing fails
    };
  }, [character?.bio]);

  // Handle Loading State
  if (isLoading) {
    return (
      <div className="max-w-[720px] mx-auto px-8 py-32 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-[12px] font-bold uppercase tracking-widest">
          Loading Entity...
        </p>
      </div>
    );
  }

  // Handle Error/Not Found State
  if (isError || !character) {
    return (
      <div className="max-w-[720px] mx-auto px-8 py-32 flex flex-col items-center justify-center gap-4">
        <p className="text-[14px] text-red-500 font-bold">
          Failed to load character.
        </p>
        <Link
          href={`/project/${projectId}/characters`}
          className="text-[12px] underline"
        >
          Return to Roster
        </Link>
      </div>
    );
  }

  // Map backend character to the shape expected by your UI components
  // Adjust depending on how your CharacterHero/Meta components handle the props
  const mappedCharacterForUI = {
    ...character,
    imageUrl: character.avatarUrl,
    // aliases is already an array now, so we just pass it directly (or fallback to empty array)
    aliases: character.aliases || [],
  };

  return (
    <div className="max-w-[720px] mx-auto px-8 py-12 flex flex-col animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-16">
        <Link
          href={`/project/${projectId}/characters`}
          className="flex items-center gap-2 text-[13px] text-[#9C8870] dark:text-[#5C5652] hover:text-[#1A1008] dark:hover:text-[#F0EBE4] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Roster
        </Link>
        <Link
          href={`/project/${projectId}/characters/${characterId}/edit`}
          className="px-4 py-1.5 rounded-md text-[12px] border border-[#E8E0D5] dark:border-[#242424] text-[#1A1008] dark:text-[#F0EBE4] hover:bg-secondary/20 transition-colors"
        >
          Edit Character
        </Link>
      </div>

      {/* Profile Header */}
      <CharacterHero character={mappedCharacterForUI} />

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-[#E8E0D5] dark:border-[#242424] mb-10 overflow-x-auto no-scrollbar">
        {["Overview", "Appearance", "Personality", "Backstory"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[12px] uppercase tracking-widest relative whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "text-[#1A1008] dark:text-[#F0EBE4] font-bold"
                : "text-[#9C8870] dark:text-[#5C5652] hover:text-[#1A1008] dark:hover:text-[#F0EBE4]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-[#1A1008] dark:bg-[#F0EBE4]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[300px]">
        {activeTab === "Overview" && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <CharacterMeta character={mappedCharacterForUI} />
            <hr className="border-t border-[#E8E0D5] dark:border-[#242424] my-10" />
            <CharacterTraits traits={mappedCharacterForUI.traits || []} />
          </div>
        )}

        {activeTab === "Appearance" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <h3 className="text-[10px] uppercase text-[#C8973F] font-bold mb-2">
              Physical Appearance
            </h3>
            <p className="text-[14px] leading-[1.8] text-[#1A1008] dark:text-[#F0EBE4] whitespace-pre-wrap">
              {parsedLore.appearance || "No appearance details recorded."}
            </p>
          </div>
        )}

        {activeTab === "Personality" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <h3 className="text-[10px] uppercase text-emerald-600 dark:text-emerald-500 font-bold mb-2">
              Personality & Flaws
            </h3>
            <p className="text-[14px] leading-[1.8] text-[#1A1008] dark:text-[#F0EBE4] whitespace-pre-wrap">
              {parsedLore.personality || "No personality details recorded."}
            </p>
          </div>
        )}

        {activeTab === "Backstory" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <h3 className="text-[10px] uppercase text-[#C8973F] font-bold mb-2">
              Background & History
            </h3>
            <p className="text-[14px] leading-[1.8] text-[#1A1008] dark:text-[#F0EBE4] whitespace-pre-wrap">
              {parsedLore.history || "No backstory details recorded."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
