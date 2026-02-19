'use client';

import { useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { UpdateChapterInput } from '@/types/chapter';
import type { SaveStatus } from './useEditor';

const AUTOSAVE_MS = 1500;

export function useEditorAutoSave(
  onAutoSave: (data: UpdateChapterInput) => Promise<void>,
  saveStatus: SaveStatus,
  getLatestContent?: () => Record<string, unknown> | undefined,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDataRef = useRef<UpdateChapterInput | null>(null);

  // Keep latest onAutoSave + getLatestContent in refs so callbacks are stable.
  // Wrapped in useEffect to satisfy React compiler (no ref writes during render).
  const onAutoSaveRef = useRef(onAutoSave);
  const getLatestContentRef = useRef(getLatestContent);

  useEffect(() => {
    onAutoSaveRef.current = onAutoSave;
    getLatestContentRef.current = getLatestContent;
  }, [onAutoSave, getLatestContent]);

  // Instantly save any pending data
  const flushSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingDataRef.current) {
      const data = pendingDataRef.current;
      pendingDataRef.current = null;
      onAutoSaveRef.current(data);
    }
  }, []); // stable — uses ref, never recreated

  // Wait for the user to stop typing before saving
  // Merges title + content updates so they fire as one request
  const scheduleSave = useCallback((data: UpdateChapterInput) => {
    pendingDataRef.current = { ...pendingDataRef.current, ...data };

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const dataToSave = pendingDataRef.current;
      pendingDataRef.current = null;
      if (dataToSave) onAutoSaveRef.current(dataToSave);
    }, AUTOSAVE_MS);
  }, []); // stable — uses ref, never recreated

  // Save if the user closes the tab or switches apps
  useEffect(() => {
    const handleBeforeUnload = () => flushSave();
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flushSave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      flushSave();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [flushSave]);

  // Handle Ctrl+S / Cmd+S manual save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (pendingDataRef.current) {
          flushSave();
        } else {
          const latest = getLatestContentRef.current?.();
          if (latest) onAutoSaveRef.current({ content: latest });
        }
        toast.success('Saved');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flushSave]); // stable — refs handle the rest

  // Toast on save error
  useEffect(() => {
    if (saveStatus === 'error') {
      toast.error('Save failed — check your connection');
    }
  }, [saveStatus]);

  return { scheduleSave, flushSave };
}
