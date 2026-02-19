'use client';

import { useState, useImperativeHandle, forwardRef, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

import EditorToolbar from './EditorToolbar';
import { useEditorAutoSave } from '@/hooks/useEditorAutoSave';
import { useChapterSync } from '@/hooks/useChapterSync';

import type { ChapterFull } from '@/lib/api-client';
import type { UpdateChapterInput } from '@/types/chapter';
import type { SaveStatus } from '@/hooks/useEditor';

// ─── Public types ───────────────────────────────────────────────────

export interface EditorSelection {
  from: number;
  to: number;
  quotedText: string;
}

export interface TiptapEditorHandle {
  getSelection: () => EditorSelection | null;
}

// ─── Props ──────────────────────────────────────────────────────────

interface Props {
  chapter: ChapterFull | null;
  onAutoSave: (data: UpdateChapterInput) => Promise<void>;
  saveStatus: SaveStatus;
}

const DEFAULT_FONT_SIZE = 14;

// ─── Component ──────────────────────────────────────────────────────

const TiptapEditor = forwardRef<TiptapEditorHandle, Props>(function TiptapEditor(
  { chapter, onAutoSave, saveStatus },
  ref,
) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  // Ref that always points at the latest editor instance so the
  // auto-save hook can grab a content snapshot without needing
  // `editor` in its closure (avoids the "used-before-declared" issue).
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  // 1. Auto-save (debounced) — the content getter reads from the ref.
  const getLatestContent = useCallback(
    () => editorRef.current?.getJSON(),
    [],
  );
  const { scheduleSave } = useEditorAutoSave(onAutoSave, saveStatus, getLatestContent);

  // 2. Tiptap editor instance
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your masterpiece...' }),
    ],
    editorProps: { attributes: { class: 'tiptap' } },
    onUpdate: ({ editor: ed }) => scheduleSave({ content: ed.getJSON() }),
  });

  // Keep the ref in sync — wrapped in useEffect to satisfy React compiler.
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // 3. Sync incoming DB data → local state
  const { title, setTitle } = useChapterSync(chapter, editor);

  // 4. Expose selection info to parent components
  useImperativeHandle(
    ref,
    () => ({
      getSelection(): EditorSelection | null {
        if (!editor) return null;
        const { from, to } = editor.state.selection;
        if (from === to) return null;
        return { from, to, quotedText: editor.state.doc.textBetween(from, to, ' ') };
      },
    }),
    [editor],
  );

  // ── Empty state ───────────────────────────────────────────────────
  if (!chapter) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-10 bg-grid">
        <p className="text-center font-mono text-xs leading-relaxed opacity-50">
          Select a chapter from the sidebar<br />or create a new one to begin writing.
        </p>
      </div>
    );
  }

  // ── Active editor ─────────────────────────────────────────────────
  return (
    <>
      <EditorToolbar editor={editor} fontSize={fontSize} onFontSizeChange={setFontSize} />

      <div className="flex flex-1 justify-center overflow-y-auto bg-white p-0">
        <div className="w-full max-w-195 bg-white p-6 md:px-12.5 md:py-15">
          {/* Chapter title */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              scheduleSave({ title: e.target.value });
            }}
            placeholder="CHAPTER TITLE"
            spellCheck={false}
            className="mb-6 w-full border-b-[3px] border-black bg-transparent pb-3 font-sans text-xl font-extrabold uppercase outline-none placeholder:italic placeholder:text-gray-300 sm:text-2xl md:text-[28px]"
          />

          {/* Rich-text body */}
          <div style={{ fontSize: `${fontSize}px` }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </>
  );
});

export default TiptapEditor;