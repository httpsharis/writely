'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, User, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import {
  fetchPublicNovel,
  fetchPublicChapters,
  type PublicNovel,
  type PublicChapterSummary,
} from '@/lib/api-client';

interface Props {
  params: Promise<{ novelId: string }>;
}

export default function ReaderLanding({ params }: Props) {
  const { novelId } = use(params);
  const [novel, setNovel] = useState<PublicNovel | null>(null);
  const [chapters, setChapters] = useState<PublicChapterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [n, ch] = await Promise.all([
          fetchPublicNovel(novelId),
          fetchPublicChapters(novelId),
        ]);
        setNovel(n);
        setChapters(ch);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Novel not found');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [novelId]);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <Spinner />
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid px-4">
        <div className="w-full max-w-md border-[3px] border-black bg-white p-8 text-center shadow-[5px_5px_0px_black]">
          <div className="mb-4 text-4xl">📖</div>
          <h1 className="mb-2 font-mono text-lg font-bold uppercase tracking-wider">
            Novel Not Found
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            {error || 'This novel doesn\'t exist or hasn\'t been published yet.'}
          </p>
          <Link
            href="/"
            className="inline-flex border-2 border-black bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const totalWords = novel.stats?.currentWordCount ?? 0;
  const readingTime = Math.max(1, Math.ceil(totalWords / 250));

  // Chapters published in the last 7 days are "NEW"
  const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const isNew = (dateStr: string) => now - new Date(dateStr).getTime() < NEW_THRESHOLD_MS;

  return (
    <div className="min-h-dvh bg-grid">
      {/* Header bar */}
      <header className="border-b-[3px] border-black bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-mono text-sm font-extrabold tracking-[3px] text-black no-underline"
          >
            WRITELY_
          </Link>
          <span className="border border-gray-300 bg-gray-100 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider">
            READER
          </span>
        </div>
      </header>

      {/* Novel info */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 border-[3px] border-black bg-white p-6 shadow-[5px_5px_0px_black] sm:p-8">
          <h1 className="mb-3 text-2xl font-extrabold uppercase leading-tight sm:text-3xl lg:text-4xl">
            {novel.title}
          </h1>

          {novel.description && (
            <p className="mb-5 leading-relaxed text-gray-600 sm:text-lg">
              {novel.description}
            </p>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-gray-400 sm:text-[11px]">
            <span className="flex items-center gap-1">
              <User size={12} /> {novel.authorName}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} /> {novel.publishedChapterCount} chapter
              {novel.publishedChapterCount !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> ~{readingTime} min read
            </span>
            <span>{totalWords.toLocaleString()} words</span>
          </div>
        </div>

        {/* Chapter list */}
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-[2px]">
          Chapters
        </h2>

        {chapters.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center">
            <BookOpen size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="font-mono text-xs text-gray-400">
              No published chapters yet.
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {chapters.map((ch, idx) => (
              <Link
                key={ch._id}
                href={`/read/${novelId}/${ch._id}`}
                className="group flex items-center justify-between border-[3px] border-black bg-white px-4 py-3.5 text-black no-underline transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-primary/10 hover:shadow-[4px_4px_0px_black] sm:px-5 sm:py-4 -mt-[3px] first:mt-0"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-gray-100 font-mono text-[11px] font-bold group-hover:bg-primary sm:h-9 sm:w-9">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase sm:text-base">
                      {ch.title}
                      {isNew(ch.createdAt) && (
                        <span className="inline-flex items-center gap-0.5 border border-secondary/40 bg-secondary/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-secondary">
                          <Sparkles size={8} />
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[9px] text-gray-400 sm:text-[10px]">
                      {ch.wordCount.toLocaleString()} words
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-black"
                />
              </Link>
            ))}
          </div>
        )}

        {/* Start reading CTA */}
        {chapters.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href={`/read/${novelId}/${chapters[0]._id}`}
              className="inline-flex items-center gap-2 border-2 border-black bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black no-underline transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
            >
              <BookOpen size={14} />
              Start Reading
            </Link>
          </div>
        )}

        {/* Author's Notes */}
        {novel.authorNotes && novel.authorNotes.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[2px]">
              <MessageSquare size={14} />
              From the Author
            </h2>
            <div className="space-y-3">
              {[...novel.authorNotes].reverse().map((note, idx) => (
                <div
                  key={idx}
                  className="border-[3px] border-black bg-white p-4 shadow-[3px_3px_0px_black] sm:p-5"
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {note.text}
                  </p>
                  <div className="mt-2 font-mono text-[9px] text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-[3px] border-black bg-white py-4 text-center font-mono text-[9px] uppercase tracking-wider text-gray-400">
        Powered by WRITELY_
      </footer>
    </div>
  );
}
