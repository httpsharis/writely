"use client";

import { use } from "react";
import Link from "next/link";
import { ContentShield } from "@/components/ui/ContentShield";
import LoadingState from "@/components/ui/LoadingState"; // Reusing from our previous refactor!
import { useChapterData, useScrollProgress } from "@/hooks/useReaderData";
import ChapterRenderer from "@/components/reader/ChapterRenderer";
import {
  ProgressBar,
  Header,
  ChapterTitle,
  Navigation,
  Footer,
  BackToTopButton,
} from "@/components/reader/ReaderUI";

interface Props {
  params: Promise<{ novelId: string; chapterId: string }>;
}

export default function ChapterReader({ params }: Props) {
  const { novelId, chapterId } = use(params);

  const { chapter, loading, error } = useChapterData(novelId, chapterId);
  const { progress, showTop, scrollToTop } = useScrollProgress();

  if (loading) return <LoadingState />;
  if (error || !chapter)
    return <ReaderErrorState error={error} novelId={novelId} />;

  return (
    <div className="min-h-dvh bg-grid">
      <ProgressBar progress={progress} />

      <Header chapter={chapter} novelId={novelId} />

      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <ChapterTitle chapter={chapter} />

        <ContentShield>
          <div className="reader-prose" style={{ fontSize: "14px" }}>
            <ChapterRenderer
              content={chapter.content}
              contentType={chapter.contentType}
            />
          </div>
        </ContentShield>

        <Navigation chapter={chapter} novelId={novelId} />
      </article>

      <Footer />

      {showTop && <BackToTopButton onClick={scrollToTop} />}
    </div>
  );
}

// Keeping this tiny custom error state here since it has a specific "Back to Novel" button
function ReaderErrorState({
  error,
  novelId,
}: {
  error: string | null;
  novelId: string;
}) {
  return (
    <div className="flex h-dvh items-center justify-center bg-grid px-4">
      <div className="w-full max-w-md border-[3px] border-black bg-white p-8 text-center shadow-[5px_5px_0px_black]">
        <div className="mb-4 text-4xl">📖</div>
        <h1 className="mb-2 font-mono text-lg font-bold uppercase tracking-wider">
          Chapter Not Found
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          {error || "This chapter doesn't exist or hasn't been published yet."}
        </p>
        <Link
          href={`/read/${novelId}`}
          className="inline-flex border-2 border-black bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black no-underline transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
        >
          Back to Novel
        </Link>
      </div>
    </div>
  );
}
