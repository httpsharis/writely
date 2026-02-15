'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, ChevronUp } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { ContentShield } from '@/components/ui/ContentShield';
import { fetchPublicChapter, type PublicChapter } from '@/lib/api-client';

interface Props {
  params: Promise<{ novelId: string; chapterId: string }>;
}

/** Recursively render Tiptap JSON nodes as React elements. */
function renderTiptapNode(
  node: Record<string, unknown>,
  key: number | string,
): React.ReactNode {
  if (!node) return null;

  // Text node
  if (node.type === 'text' && typeof node.text === 'string') {
    let el: React.ReactNode = node.text;

    // Apply marks (bold, italic, underline, code, strike)
    const marks = node.marks as Array<{ type: string }> | undefined;
    if (marks) {
      for (const mark of marks) {
        switch (mark.type) {
          case 'bold':
            el = <strong key={key}>{el}</strong>;
            break;
          case 'italic':
            el = <em key={key}>{el}</em>;
            break;
          case 'underline':
            el = <u key={key}>{el}</u>;
            break;
          case 'strike':
            el = <s key={key}>{el}</s>;
            break;
          case 'code':
            el = <code key={key}>{el}</code>;
            break;
        }
      }
    }
    return el;
  }

  const children = (node.content as Record<string, unknown>[] | undefined)?.map(
    (child, i) => renderTiptapNode(child, i),
  );

  switch (node.type) {
    case 'doc':
      return <>{children}</>;
    case 'paragraph':
      return <p key={key}>{children}</p>;
    case 'heading': {
      const level = (node.attrs as { level?: number })?.level ?? 1;
      if (level === 1) return <h1 key={key}>{children}</h1>;
      if (level === 2) return <h2 key={key}>{children}</h2>;
      if (level === 3) return <h3 key={key}>{children}</h3>;
      if (level === 4) return <h4 key={key}>{children}</h4>;
      return <h5 key={key}>{children}</h5>;
    }
    case 'bulletList':
      return <ul key={key}>{children}</ul>;
    case 'orderedList':
      return <ol key={key}>{children}</ol>;
    case 'listItem':
      return <li key={key}>{children}</li>;
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>;
    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} />;
    case 'hardBreak':
      return <br key={key} />;
    default:
      return children ? <>{children}</> : null;
  }
}

export default function ChapterReader({ params }: Props) {
  const { novelId, chapterId } = use(params);
  const [chapter, setChapter] = useState<PublicChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  // Reading progress + back-to-top visibility
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
      }
      setShowTop(scrollTop > 400);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    let cancelled = false;

    fetchPublicChapter(novelId, chapterId)
      .then((data) => { if (!cancelled) { setChapter(data); setError(null); } })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Chapter not found');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [novelId, chapterId]);

  const renderedContent = useMemo(() => {
    if (!chapter) return null;
    const { content, contentType } = chapter;

    // HTML string
    if (contentType === 'html' && typeof content === 'string') {
      return (
        <div
          className="tiptap ProseMirror"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Tiptap JSON
    if (typeof content === 'object' && content !== null) {
      return (
        <div className="tiptap ProseMirror">
          {renderTiptapNode(content as Record<string, unknown>, 'root')}
        </div>
      );
    }

    // Plain text / markdown fallback
    if (typeof content === 'string') {
      return (
        <div className="tiptap ProseMirror whitespace-pre-wrap">{content}</div>
      );
    }

    return null;
  }, [chapter]);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <Spinner />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid px-4">
        <div className="w-full max-w-md border-[3px] border-black bg-white p-8 text-center shadow-[5px_5px_0px_black]">
          <div className="mb-4 text-4xl">📖</div>
          <h1 className="mb-2 font-mono text-lg font-bold uppercase tracking-wider">
            Chapter Not Found
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            {error || 'This chapter doesn\'t exist or hasn\'t been published yet.'}
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

  const readingTime = Math.max(1, Math.ceil(chapter.wordCount / 250));

  return (
    <div className="min-h-dvh bg-grid">
      {/* Reading progress bar */}
      <div className="fixed left-0 top-0 z-[100] h-1 w-full bg-gray-200">
        <div
          className="h-full bg-black reading-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b-[3px] border-black bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5 sm:px-6">
          <Link
            href={`/read/${novelId}`}
            className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black no-underline transition-all hover:text-secondary sm:text-[11px]"
          >
            <ArrowLeft size={14} />
            {chapter.novelTitle}
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
            Ch. {chapter.chapterNumber}/{chapter.totalChapters}
          </span>
        </div>
      </header>

      {/* Chapter content */}
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Chapter header */}
        <div className="mb-8 border-b-[3px] border-black pb-5 sm:mb-10">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-gray-400">
            Chapter {chapter.chapterNumber}
          </div>
          <h1 className="mb-3 text-2xl font-extrabold uppercase leading-tight sm:text-3xl">
            {chapter.title}
          </h1>
          <div className="flex gap-4 font-mono text-[9px] uppercase tracking-wider text-gray-400 sm:text-[10px]">
            <span>{chapter.wordCount.toLocaleString()} words</span>
            <span>~{readingTime} min read</span>
          </div>
        </div>

        {/* Prose */}
        <ContentShield>
          <div className="reader-prose" style={{ fontSize: '14px' }}>
            {renderedContent}
          </div>
        </ContentShield>

        {/* Navigation */}
        <nav className="mt-12 flex items-stretch gap-3 border-t-[3px] border-black pt-6 sm:mt-16">
          {chapter.prevChapter ? (
            <Link
              href={`/read/${novelId}/${chapter.prevChapter._id}`}
              className="flex flex-1 items-center gap-2 border-2 border-black bg-white px-4 py-3 text-black no-underline transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
            >
              <ChevronLeft size={16} />
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
                  Previous
                </div>
                <div className="truncate text-xs font-bold uppercase">
                  {chapter.prevChapter.title}
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          <Link
            href={`/read/${novelId}`}
            className="flex items-center justify-center border-2 border-black bg-gray-100 px-3 text-black no-underline transition-all hover:bg-primary"
            title="Back to chapters"
          >
            <BookOpen size={16} />
          </Link>

          {chapter.nextChapter ? (
            <Link
              href={`/read/${novelId}/${chapter.nextChapter._id}`}
              className="flex flex-1 items-center justify-end gap-2 border-2 border-black bg-white px-4 py-3 text-black no-underline transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
            >
              <div className="min-w-0 text-right">
                <div className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
                  Next
                </div>
                <div className="truncate text-xs font-bold uppercase">
                  {chapter.nextChapter.title}
                </div>
              </div>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>

      {/* Footer */}
      <footer className="border-t-[3px] border-black bg-white py-6 text-center">
        <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
          Powered by WRITELY_
        </p>
        <p className="mt-1 font-mono text-[8px] tracking-wider text-gray-300">
          &copy; {new Date().getFullYear()} DevHarry. All rights reserved.
        </p>
      </footer>

      {/* Back to top button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_black] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
          title="Back to top"
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
}
