import { useRouter } from "next/navigation";
import { Heart, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { Document } from "@/redux/features/documents/documentApi";

interface ReaderFooterProps {
  chapter: Document;
  prevChapter: Document | null;
  nextChapter: Document | null;
  displayLikes: number;
  hasLiked: boolean;
  isLiking: boolean;
  handleLike: () => void;
}

export const ReaderFooter = ({ chapter, prevChapter, nextChapter, displayLikes, hasLiked, isLiking, handleLike }: ReaderFooterProps) => {
  const router = useRouter();

  return (
    <footer className="mt-20 border-t border-white/10 pt-12 pb-24">
      
      {/* Prominent Like Button & Stats */}
      <div className="mb-16 flex flex-col items-center justify-center gap-4">
        <button 
          onClick={handleLike} 
          disabled={hasLiked || isLiking} 
          className={`group flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${
            hasLiked 
              ? "border-[#c9975a] bg-[#c9975a]/10 text-[#c9975a]" 
              : "border-white/10 bg-[#1b1a21] text-[#948fa0] hover:border-[#c9975a]/50 hover:text-[#c9975a]"
          }`}
        >
          <Heart className={`h-6 w-6 transition-transform group-active:scale-95 ${hasLiked ? "fill-[#c9975a]" : "group-hover:scale-110"}`} />
        </button>
        <div className="flex items-center gap-4 text-[13px] font-medium text-[#5c5868]">
          <span className="flex items-center gap-1.5" title="Views">
            <Eye className="h-4 w-4" /> {(chapter.viewsCount || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5" title="Likes">
            <Heart className="h-4 w-4" /> {displayLikes.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {prevChapter ? (
          <div onClick={() => router.push(`/chapter/${prevChapter.slug}`)} className="group flex cursor-pointer flex-col gap-1.5 rounded-xl border border-white/5 bg-[#1b1a21] p-4 md:p-5 transition-colors hover:border-[#c9975a]/30 hover:bg-white/5">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#5c5868] group-hover:text-[#c9975a]"><ChevronLeft className="h-3.5 w-3.5" /> Prev</span>
            <span className="line-clamp-2 font-serif text-[14px] md:text-[15px] text-[#ede9e2] leading-snug">{prevChapter.title}</span>
          </div>
        ) : <div />}

        {nextChapter ? (
          <div onClick={() => router.push(`/chapter/${nextChapter.slug}`)} className="group flex cursor-pointer flex-col items-end gap-1.5 rounded-xl border border-white/5 bg-[#1b1a21] p-4 md:p-5 text-right transition-colors hover:border-[#c9975a]/30 hover:bg-white/5">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#5c5868] group-hover:text-[#c9975a]">Next <ChevronRight className="h-3.5 w-3.5" /></span>
            <span className="line-clamp-2 font-serif text-[14px] md:text-[15px] text-[#ede9e2] leading-snug">{nextChapter.title}</span>
          </div>
        ) : <div />}
      </div>
    </footer>
  );
};