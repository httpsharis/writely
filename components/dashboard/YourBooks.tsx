"use client";

import Link from "next/link";
import { Users, Heart, BookOpen, Plus } from "lucide-react";

const BOOKS = [
  {
    id: "bk-1",
    title: "The Neon Protocol",
    status: "published",
    readers: "12.4k",
    likes: "850",
    gradient: "from-blue-600 to-violet-600",
  },
  {
    id: "bk-2",
    title: "Echoes of Eternity",
    status: "writing",
    words: "24k",
    progress: "60%",
    gradient: "from-indigo-600 to-cyan-600",
  },
  {
    id: "bk-3",
    title: "Untitled Fantasy",
    status: "draft",
    words: "2k",
    progress: "5%",
    gradient: "from-zinc-600 to-neutral-800",
  }
];

type BookProps = {
  id: string;
  title: string;
  status: string;
  words?: string;
  readers?: string;
  likes?: string;
  progress?: string;
  gradient?: string;
};

export function YourBooks({ books = BOOKS }: { books?: BookProps[] }) {
  // If books array is empty, fallback to empty state or mock data?
  // Let's use the passed books if available, else fallback to mock if DB is empty.
  const displayBooks = books.length > 0 ? books : BOOKS;

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
      <h3 className="text-sm font-bold tracking-tight text-black dark:text-white mb-4 px-1">
        Your Books
      </h3>
      
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
        
        {displayBooks.map((book) => (
          <Link 
            key={book.id} 
            href={book.status === 'published' ? `/library/${book.id}` : `/editor/${book.id}`}
            className="relative min-w-[200px] aspect-[2/3] rounded-2xl overflow-hidden snap-start group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-black/5 dark:border-white/10"
          >
            {/* The Cover Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${book.gradient}`}></div>
            {/* SVG Noise Texture (simulated with CSS for now) */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between bg-black/20 group-hover:bg-transparent transition-colors duration-300">
              
              {/* Status Badge */}
              <div className={`self-start px-2.5 py-1 rounded-full backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-white
                ${book.status === 'published' ? 'bg-green-500/40 border border-green-500/50' : 
                  book.status === 'writing' ? 'bg-indigo-500/40 border border-indigo-500/50' : 
                  'bg-orange-500/40 border border-orange-500/50'}`}
                style={{
                  backgroundColor: book.status === 'published' ? 'rgba(34, 197, 94, 0.4)' : book.status === 'writing' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(249, 115, 22, 0.4)',
                  borderColor: book.status === 'published' ? 'rgba(34, 197, 94, 0.5)' : book.status === 'writing' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(249, 115, 22, 0.5)'
                }}
              >
                {book.status}
              </div>

              {/* Title & Stats */}
              <div className="space-y-2">
                <h4 className="text-white font-serif font-bold leading-tight drop-shadow-md">
                  {book.title}
                </h4>
                
                <div className="flex items-center gap-3 text-white/90 text-xs font-medium">
                  {book.status === 'published' ? (
                    <>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {book.readers}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3"/> {book.likes}</span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {book.words}</span>
                      <span className="opacity-70">{book.progress}</span>
                    </>
                  )}
                </div>
              </div>

            </div>
          </Link>
        ))}

        {/* The "New Book" Dashed Card */}
        <button className="min-w-[200px] aspect-[2/3] rounded-2xl snap-start border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white transition-colors">Start a new book</span>
        </button>

      </div>
    </div>
  );
}