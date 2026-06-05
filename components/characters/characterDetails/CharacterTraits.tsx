export default function CharacterTraits({ traits }: { traits: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
        Core Traits
      </span>
      <div className="flex flex-row flex-wrap gap-3">
        {traits.map((trait) => (
          <span
            key={trait}
            className="px-3.5 py-1.5 border border-[#E8E0D5] dark:border-[#242424] rounded-full text-[11px] uppercase tracking-widest text-[#1A1008] dark:text-[#F0EBE4] bg-transparent"
          >
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}