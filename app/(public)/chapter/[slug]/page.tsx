"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Logic Engine
import { useReaderEngine } from "@/features/reader/hooks/useReaderEngine";
import { useGetNovelCharactersQuery } from "@/redux/features/characters/characterApi";

// UI Components
import { ReaderMobileHeader } from "@/features/reader/components/ReaderMobileHeader";
import { ReaderSidebar } from "@/features/reader/components/ReaderSidebar";
import { ReadOnlyCanvas } from "@/features/reader/components/ReadOnlyCanvas";
import { ReaderFooter } from "@/features/reader/components/ReaderFooter";

export default function PublicChapterReaderPage() {
  const router = useRouter();
  const slug = useParams().slug as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Ignite the Engine
  const { 
    chapter, novel, chapters, prevChapter, nextChapter, 
    displayLikes, hasLiked, isLiking, handleLike, isLoading, error, currentIndex 
  } = useReaderEngine(slug);

  const { data: charData } = useGetNovelCharactersQuery(novel?._id || "", {
    skip: !novel?._id,
  });
  const characters = charData?.characters || novel?.characters || [];

  // 2. Network Guards
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#131217]">
        <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-[#c9975a]" />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#131217] text-[#ede9e2]">
        <p className="mb-4 font-serif text-2xl">Chapter not found.</p>
        <button 
          onClick={() => router.back()} 
          className="text-xs font-bold uppercase tracking-widest text-[#948fa0] transition-colors hover:text-[#ede9e2]"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 3. Render Tree
  return (
    <div className="min-h-screen bg-[#131217] font-sans text-[#ede9e2] antialiased lg:flex">
      
      <ReaderMobileHeader 
        novelTitle={novel?.title} 
        isOpen={isMobileMenuOpen} 
        toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />

      <ReaderSidebar 
        novel={novel} 
        chapters={chapters} 
        activeChapterId={chapter._id} 
        isMobileOpen={isMobileMenuOpen} 
        closeMobile={() => setIsMobileMenuOpen(false)} 
      />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-8 py-12 lg:py-24">
          
          <header className="mb-14">
            <div className="mb-5 flex items-center gap-2 font-mono text-[11px] text-[#c9975a]">
              Chapter {chapter.order || currentIndex + 1}
            </div>
            <h1 className="mb-6 font-serif text-[44px] leading-[1.1] tracking-tight text-[#ede9e2]">
              {chapter.title || "Untitled Chapter"}
            </h1>
          </header>

          <ReadOnlyCanvas content={chapter.content} characters={characters} />
          
          <ReaderFooter 
            chapter={chapter}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
            displayLikes={displayLikes}
            hasLiked={hasLiked}
            isLiking={isLiking}
            handleLike={handleLike}
          />

        </div>
      </main>
    </div>
  );
}