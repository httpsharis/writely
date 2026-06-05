import Image from "next/image";

export default function CharacterHero({ character }: { character: any }) {
  return (
    <div className="flex flex-col md:flex-row gap-12 mb-12 items-end md:items-stretch">
      
      {/* Tall Portrait Wrapper (Fixes the Next.js Image Error) */}
      <div className="relative w-full md:w-[320px] h-[480px] shrink-0 rounded-[20px] overflow-hidden border border-[#E8E0D5] dark:border-[#242424] shadow-sm">
        <Image
          src={character.imageUrl || "/placeholder.jpg"} // Provide a fallback if possible
          alt={character.name || "Character Portrait"}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      {/* Character Identity & Quick Stats */}
      <div className="flex flex-col justify-end py-4 flex-1">
        
        {/* Name & Archetype */}
        <h1 className="text-[48px] md:text-[64px] font-semibold tracking-tight text-[#1A1008] dark:text-[#F0EBE4] leading-none mb-3">
          {character.name}
        </h1>
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[12px] uppercase tracking-[0.2em] text-[#C8973F] font-bold">
            {character.role || "Role"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4C8B8] dark:bg-[#3A3A3A]"></span>
          <span className="text-[17px] font-serif italic text-[#8B7A67] dark:text-[#7A736E]">
            {character.archetype || "Archetype"}
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-8 border-t border-[#E8E0D5] dark:border-[#242424] pt-8 mt-auto">
          
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#A69480] dark:text-[#6E6762] font-semibold">
              Age & Origin
            </span>
            <span className="text-[15px] font-medium text-[#1A1008] dark:text-[#D1CBC5]">
              {character.age} • {character.location}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#A69480] dark:text-[#6E6762] font-semibold">
              Build & Features
            </span>
            <span className="text-[15px] font-medium text-[#1A1008] dark:text-[#D1CBC5]">
              {character.build}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#A69480] dark:text-[#6E6762] font-semibold">
              Fatal Flaw
            </span>
            <span className="text-[15px] font-medium text-[#1A1008] dark:text-[#D1CBC5]">
              {character.flaw}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#A69480] dark:text-[#6E6762] font-semibold">
              Internal Motivation
            </span>
            <span className="text-[15px] font-medium text-[#1A1008] dark:text-[#D1CBC5]">
              {character.internalMotivation}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}