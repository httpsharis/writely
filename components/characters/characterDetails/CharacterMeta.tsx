export default function CharacterMeta({ character }: { character: any }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
          Known Aliases
        </span>
        <div className="flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-[#1A1008] dark:text-[#F0EBE4]">
          {character.aliases.map((alias: string) => <span key={alias}>{alias}</span>)}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
          Appears In
        </span>
        <div className="flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-[#1A1008] dark:text-[#F0EBE4]">
          {character.appearsIn.map((book: string) => <span key={book} className="font-serif italic">{book}</span>)}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
          Archetype
        </span>
        <div className="flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-[#1A1008] dark:text-[#F0EBE4]">
          <span>{character.archetype}</span>
        </div>
      </div>
    </div>
  );
}