import { Search } from "lucide-react";

interface LibraryControlsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function LibraryControls({ activeTab, setActiveTab, searchQuery, setSearchQuery }: LibraryControlsProps) {
  const tabs = ["All", "Planning", "Drafting", "Editing", "Published"];

  return (
    <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-8 mb-12">
      {/* Editorial Tabs: Minimal underline style instead of bulky background pill shapes */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0 border-b md:border-none border-border/40">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab 
                ? "text-foreground border-b-2 border-foreground" 
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Minimal Search */}
      <div className="relative w-full md:max-w-xs group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search manuscripts..." 
          className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-border/40 text-sm text-foreground focus:outline-none focus:border-foreground transition-all placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
}