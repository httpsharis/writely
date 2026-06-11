import { BookOpen, MoreVertical, Loader2 } from "lucide-react";

export interface ChapterData {
  id: string | number;
  title: string;
  status: string;
  words: number;
  date?: string; 
}

interface ManuscriptListProps {
  chapters: ChapterData[];
  onCreateChapter: () => void;           // 👈 Added
  onChapterClick: (id: string) => void;  // 👈 Added
  isCreating?: boolean;                  // 👈 Added
}

export function ManuscriptList({ chapters, onCreateChapter, onChapterClick, isCreating }: ManuscriptListProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
          <BookOpen className="w-4 h-4 stroke-[1.5]" />
          Manuscript
        </h2>
        
        {/* 🟢 Wired up the Create Button */}
        <button 
          onClick={onCreateChapter}
          disabled={isCreating}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : "+ New Chapter"}
        </button>
      </div>

      <div className="flex flex-col divide-y divide-border/30 border-y border-border/30">
        {chapters.map((chapter) => (
          <div 
            key={chapter.id} 
            onClick={() => onChapterClick(chapter.id.toString())} // 👈 Wired up Chapter Click
            className="group grid grid-cols-12 gap-4 py-4 hover:bg-secondary/10 transition-colors items-center -mx-4 px-4 cursor-pointer"
          >
            <div className="col-span-8 flex flex-col gap-1">
              <span className="font-serif font-bold text-foreground group-hover:text-brand transition-colors truncate">
                {chapter.title}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {chapter.status}
              </span>
            </div>
            <div className="col-span-3 text-right text-[11px] font-bold text-muted-foreground tracking-widest">
              {chapter.words.toLocaleString()} w
            </div>
            <div className="col-span-1 text-right flex justify-end">
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}