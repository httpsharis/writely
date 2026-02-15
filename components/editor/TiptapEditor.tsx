'use client';

import { useRef, useCallback, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import { toast } from 'sonner';
import type { ChapterFull } from '@/lib/api-client';
import type { UpdateChapterInput } from '@/types/chapter';
import type { SaveStatus } from '@/hooks/useEditor';

export interface EditorSelection {
  from: number;
  to: number;
  quotedText: string;
}

export interface TiptapEditorHandle {
  getSelection: () => EditorSelection | null;
}

interface Props {
  chapter: ChapterFull | null;
  onAutoSave: (data: UpdateChapterInput) => Promise<void>;
  saveStatus: SaveStatus;
}

const AUTOSAVE_MS = 1500;
const DEFAULT_FONT_SIZE = 14;

const TiptapEditor = forwardRef<TiptapEditorHandle, Props>(function TiptapEditor(
  { chapter, onAutoSave, saveStatus },
  ref,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevChapterIdRef = useRef<string | null>(null);
  const pendingDataRef = useRef<UpdateChapterInput | null>(null);

  const [title, setTitle] = useState('');
  const [trackedId, setTrackedId] = useState<string | undefined>(undefined);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const currentId = chapter?._id;
  if (currentId !== trackedId) {
    setTrackedId(currentId);
    setTitle(chapter?.title ?? '');
  }

  // Tiptap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your masterpiece...' }),
    ],
    editorProps: { attributes: { class: 'tiptap' } },
    onUpdate: ({ editor: ed }) => scheduleSave({ content: ed.getJSON() }),
  });

  // Expose selection getter via ref
  useImperativeHandle(ref, () => ({
    getSelection(): EditorSelection | null {
      if (!editor) return null;
      const { from, to } = editor.state.selection;
      if (from === to) return null; // no selection
      const quotedText = editor.state.doc.textBetween(from, to, ' ');
      return { from, to, quotedText };
    },
  }), [editor]);

  // Flush any pending save immediately (called on beforeunload / visibilitychange)
  const flushSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingDataRef.current) {
      const data = pendingDataRef.current;
      pendingDataRef.current = null;
      onAutoSave(data);
    }
  }, [onAutoSave]);

  // Debounced auto-save
  const scheduleSave = useCallback(
    (data: UpdateChapterInput) => {
      pendingDataRef.current = data;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        pendingDataRef.current = null;
        onAutoSave(data);
      }, AUTOSAVE_MS);
    },
    [onAutoSave],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setTitle(val);
      scheduleSave({ title: val });
    },
    [scheduleSave],
  );

  // Load chapter content into editor when chapter changes
  useEffect(() => {
    if (!chapter || !editor) return;
    if (prevChapterIdRef.current === chapter._id) return;
    prevChapterIdRef.current = chapter._id;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (chapter.content && typeof chapter.content === 'object') {
      editor.commands.setContent(chapter.content);
    } else if (typeof chapter.content === 'string' && chapter.content.length > 0) {
      editor.commands.setContent(chapter.content);
    } else {
      editor.commands.clearContent();
    }
  }, [chapter, editor]);

  // Flush pending save on page unload / tab switch, and cleanup timer
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

  // Ctrl+S manual save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (pendingDataRef.current) {
          flushSave();
        } else if (editor && chapter) {
          onAutoSave({ content: editor.getJSON() });
        }
        toast.success('Saved');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, chapter, flushSave, onAutoSave]);

  // Show toast on save error
  useEffect(() => {
    if (saveStatus === 'error') {
      toast.error('Save failed — check your connection');
    }
  }, [saveStatus]);

  // Empty state
  if (!chapter) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-10 bg-grid">
        <p className="text-center font-mono text-xs leading-relaxed opacity-50">
          Select a chapter from the sidebar<br />or create a new one to begin writing.
        </p>
      </div>
    );
  }

  return (
    <>
      <EditorToolbar editor={editor} fontSize={fontSize} onFontSizeChange={setFontSize} />

      <div className="flex flex-1 justify-center overflow-y-auto p-4 md:p-10 max-md:bg-white max-md:p-0 md:bg-grid">
        <div className="mb-20 w-full max-w-195 min-h-225 border-[3px] border-black bg-white p-6 shadow-[10px_10px_0px_rgba(0,0,0,0.08)] md:px-12.5 md:py-15 max-md:min-h-0 max-md:mb-0 max-md:border-0 max-md:shadow-none">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="CHAPTER TITLE"
            spellCheck={false}
            className="mb-6 w-full border-b-[3px] border-black bg-transparent pb-3 font-sans text-xl font-extrabold uppercase outline-none placeholder:italic placeholder:text-gray-300 sm:text-2xl md:text-[28px]"
          />
          <div style={{ fontSize: `${fontSize}px` }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </>
  );
});

export default TiptapEditor;
