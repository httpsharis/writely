'use client';

import { useState, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import type { ChapterFull } from '@/lib/api-client';

export function useChapterSync(chapter: ChapterFull | null, editor: Editor | null) {
  const [title, setTitle] = useState('');
  const [trackedId, setTrackedId] = useState<string | undefined>(undefined);
  const prevChapterIdRef = useRef<string | null>(null);

  // Sync Title State
  if (chapter?._id !== trackedId) {
    setTrackedId(chapter?._id);
    setTitle(chapter?.title ?? '');
  }

  // Sync Editor Content
  useEffect(() => {
    if (!chapter || !editor) return;
    
    if (prevChapterIdRef.current === chapter._id) return;
    prevChapterIdRef.current = chapter._id;

    if (chapter.content && typeof chapter.content === 'object') {
      editor.commands.setContent(chapter.content);
    } else if (typeof chapter.content === 'string' && chapter.content.length > 0) {
      editor.commands.setContent(chapter.content);
    } else {
      editor.commands.clearContent();
    }
  }, [chapter, editor]);

  return { title, setTitle };
}