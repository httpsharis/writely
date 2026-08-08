import { Search } from "lucide-react";

interface CharacterSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Renders the search bar for filtering characters.
 */
export function CharacterSearch({ searchQuery, setSearchQuery }: CharacterSearchProps) {
  return (
    <div className="mb-10 max-w-[400px]">
      <div className="flex items-center gap-3 bg-[#1b1a21] p-3.5 rounded-xl border border-[rgba(255,255,255,0.07)] focus-within:border-[#c9975a] focus-within:shadow-[0_0_15px_rgba(201,151,90,0.1)] transition-all">
        <Search className="w-5 h-5 text-[#5c5868]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, role, traits, or novel..."
          className="bg-transparent border-none outline-none text-[14px] font-medium w-full text-[#ede9e2] placeholder:text-[#5c5868]"
        />
      </div>
    </div>
  );
}
