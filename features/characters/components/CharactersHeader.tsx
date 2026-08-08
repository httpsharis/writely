import Link from "next/link";
import { Plus, Users } from "lucide-react";

interface CharactersHeaderProps {
  projectId: string | undefined;
  newLink: string;
}

/**
 * Renders the header section for the Characters page.
 * Displays the page title and an "Add Character" button.
 */
export function CharactersHeader({ projectId, newLink }: CharactersHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6 mb-12">
      <div className="w-full">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-[#5c5868] mb-2.5">
          <span className="w-3 h-3">
            <Users className="w-full h-full" />
          </span>
          {projectId ? "Novel Roster" : "Global Cast"}
        </div>
        <h1 className="font-serif font-medium text-[40px] tracking-[-0.01em] m-0 text-[#ede9e2]">
          Characters
        </h1>
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <Link
          href={newLink}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-transparent bg-[#c9975a] text-[#131217] text-sm font-semibold transition-all hover:bg-[#d8a86c] hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(201,151,90,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Character
        </Link>
      </div>
    </div>
  );
}
