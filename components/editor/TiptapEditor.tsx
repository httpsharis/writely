'use client';

import { useRef, useCallback, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import EditorToolbar from './EditorToolbar';
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
      Underline,
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

  // Debounced auto-save
  const scheduleSave = useCallback(
    (data: UpdateChapterInput) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onAutoSave(data), AUTOSAVE_MS);
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

  // Cleanup timer
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

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

      <div className="flex flex-1 justify-center overflow-y-auto bg-grid p-4 md:p-10">
        <div className="mb-20 w-full max-w-195 min-h-225 border-[3px] border-black bg-white p-6 shadow-[10px_10px_0px_rgba(0,0,0,0.08)] md:px-12.5 md:py-15 max-md:min-h-0 max-md:border-0 max-md:shadow-none">
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

        {saveStatus === 'error' && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border-2 border-danger bg-danger px-4 py-2 font-mono text-[11px] font-bold text-white">
            SAVE FAILED — CHECK YOUR CONNECTION
          </div>
        )}
      </div>
    </>
  );
});

export default TiptapEditor;
