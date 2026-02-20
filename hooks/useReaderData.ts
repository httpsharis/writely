import { useState, useEffect, useCallback } from 'react';
import { fetchPublicChapter, type PublicChapter } from '../lib/api-client';

export function useChapterData(novelId: string, chapterId: string) {
  const fetchKey = `${novelId}/${chapterId}`;
  const [result, setResult] = useState<{ key: string; chapter: PublicChapter | null; error: string | null; }>({ key: '', chapter: null, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchPublicChapter(novelId, chapterId)
      .then((data) => { if (!cancelled) setResult({ key: fetchKey, chapter: data, error: null }); })
      .catch((err) => { if (!cancelled) setResult({ key: fetchKey, chapter: null, error: err instanceof Error ? err.message : 'Chapter not found' }); });

    return () => { cancelled = true; };
  }, [novelId, chapterId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { chapter: result.chapter, loading: result.key !== fetchKey, error: result.error };
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

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

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { progress, showTop, scrollToTop };
}