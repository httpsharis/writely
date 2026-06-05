"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CharacterHero from "@/components/characters/characterDetails/CharacterHero";
import CharacterMeta from "@/components/characters/characterDetails/CharacterMeta";
import CharacterTraits from "@/components/characters/characterDetails/CharacterTraits";

const CHARACTER = {
  id: "1",
  name: "Aria Vance",
  role: "PROTAGONIST",
  archetype: "The Reluctant Hero",
  aliases: ["The Shadow Walker", "Market Rat", "Vance"],
  appearsIn: ["The Glass Citadel", "Shadows of the Past"],
  traits: ["Brave", "Reckless", "Cunning", "Claustrophobic", "Loyal"],
  appearance: "Aria stands at 5'4\", possessing a lithe build.",
  background: "Born in the slums of the Glass Citadel.",
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
};

export default function CharacterProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="max-w-[720px] mx-auto px-8 py-12 flex flex-col">
      <div className="flex items-center justify-between mb-16">
        <Link
          href="/characters"
          className="flex items-center gap-2 text-[13px] text-[#9C8870] dark:text-[#5C5652] hover:text-[#1A1008] dark:hover:text-[#F0EBE4]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roster
        </Link>
        <button className="px-4 py-1.5 rounded-md text-[12px] border border-[#E8E0D5] dark:border-[#242424] text-[#1A1008] dark:text-[#F0EBE4]">
          Edit Character
        </button>
      </div>

      <CharacterHero character={CHARACTER} />

      <div className="flex items-center gap-8 border-b border-[#E8E0D5] dark:border-[#242424] mb-10">
        {["Overview", "Appearance", "Backstory"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[12px] uppercase tracking-widest relative ${
              activeTab === tab
                ? "text-[#1A1008] dark:text-[#F0EBE4]"
                : "text-[#9C8870] dark:text-[#5C5652]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-[#1A1008] dark:bg-[#F0EBE4]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="flex flex-col animate-in fade-in duration-300">
          <CharacterMeta character={CHARACTER} />
          <hr className="border-t border-[#E8E0D5] dark:border-[#242424] my-10" />
          <CharacterTraits traits={CHARACTER.traits} />
        </div>
      )}

      {activeTab === "Appearance" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          <h3 className="text-[10px] uppercase text-[#C8973F] font-bold mb-2">
            Physical Appearance
          </h3>
          <p className="text-[14px] leading-[1.75] text-[#1A1008] dark:text-[#F0EBE4]">
            {CHARACTER.appearance}
          </p>
        </div>
      )}

      {activeTab === "Backstory" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          <h3 className="text-[10px] uppercase text-[#C8973F] font-bold mb-2">
            Background
          </h3>
          <p className="text-[14px] leading-[1.75] text-[#1A1008] dark:text-[#F0EBE4]">
            {CHARACTER.background}
          </p>
        </div>
      )}
    </div>
  );
}