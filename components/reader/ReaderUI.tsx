import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, ChevronUp } from 'lucide-react';
import type { PublicChapter } from '@/lib/api-client';

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed left-0 top-0 z-100 h-1 w-full bg-gray-200">
      <div className="h-full bg-black reading-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function Header({ chapter, novelId }: { chapter: PublicChapter; novelId: string }) {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-black bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href={`/read/${novelId}`} className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black no-underline transition-all hover:text-secondary sm:text-[11px]">
          <ArrowLeft size={14} /> {chapter.novelTitle}
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
          Ch. {chapter.chapterNumber}/{chapter.totalChapters}
        </span>
      </div>
    </header>
  );
}

export function ChapterTitle({ chapter }: { chapter: PublicChapter }) {
  const readingTime = Math.max(1, Math.ceil(chapter.wordCount / 250));
  return (
    <div className="mb-8 border-b-[3px] border-black pb-5 sm:mb-10">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-gray-400">Chapter {chapter.chapterNumber}</div>
      <h1 className="mb-3 text-2xl font-extrabold uppercase leading-tight sm:text-3xl">{chapter.title}</h1>
      <div className="flex gap-4 font-mono text-[9px] uppercase tracking-wider text-gray-400 sm:text-[10px]">
        <span>{chapter.wordCount.toLocaleString()} words</span>
        <span>~{readingTime} min read</span>
      </div>
    </div>
  );
}

export function Navigation({ chapter, novelId }: { chapter: PublicChapter; novelId: string }) {
  return (
    <nav className="mt-12 flex items-stretch gap-3 border-t-[3px] border-black pt-6 sm:mt-16">
      {chapter.prevChapter ? (
        <Link href={`/read/${novelId}/${chapter.prevChapter._id}`} className="flex flex-1 items-center gap-2 border-2 border-black bg-white px-4 py-3 text-black no-underline transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]">
          <ChevronLeft size={16} />
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-wider text-gray-400">Previous</div>
            <div className="truncate text-xs font-bold uppercase">{chapter.prevChapter.title}</div>
          </div>
        </Link>
      ) : <div className="flex-1" />}

      <Link href={`/read/${novelId}`} className="flex items-center justify-center border-2 border-black bg-gray-100 px-3 text-black no-underline transition-all hover:bg-primary" title="Back to chapters">
        <BookOpen size={16} />
      </Link>

      {chapter.nextChapter ? (
        <Link href={`/read/${novelId}/${chapter.nextChapter._id}`} className="flex flex-1 items-center justify-end gap-2 border-2 border-black bg-white px-4 py-3 text-black no-underline transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]">
          <div className="min-w-0 text-right">
            <div className="font-mono text-[9px] uppercase tracking-wider text-gray-400">Next</div>
            <div className="truncate text-xs font-bold uppercase">{chapter.nextChapter.title}</div>
          </div>
          <ChevronRight size={16} />
        </Link>
      ) : <div className="flex-1" />}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t-[3px] border-black bg-white py-6 text-center">
      <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400">Powered by WRITELY_</p>
      <p className="mt-1 font-mono text-[8px] tracking-wider text-gray-300">&copy; {new Date().getFullYear()} DevHarry. All rights reserved.</p>
    </footer>
  );
}

export function BackToTopButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="fixed bottom-6 right-6 z-50 flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_black] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]" title="Back to top" aria-label="Back to top">
      <ChevronUp size={18} />
    </button>
  );
}