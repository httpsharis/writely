'use client';

import { useImperativeHandle, forwardRef, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { PenLine } from 'lucide-react';

import BubbleToolbar from './BubbleToolbar';
import { SlashCommands } from './slashExtension';
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

// ─── Extensions (static — created once, zero re-renders) ────────────

const EXTENSIONS = [
  StarterKit,
  Underline,
  Placeholder.configure({
    placeholder: "Start writing, or type '/' for commands...",
  }),
  SlashCommands,
];

// ─── Component ──────────────────────────────────────────────────────

const TiptapEditor = forwardRef<TiptapEditorHandle, Props>(function TiptapEditor(
  { chapter, onAutoSave, saveStatus },
  ref,
) {
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const getLatestContent = useCallback(() => editorRef.current?.getJSON(), []);
  const { scheduleSave } = useEditorAutoSave(onAutoSave, saveStatus, getLatestContent);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: EXTENSIONS,
    editorProps: { 
      attributes: { 
        class: 'prose prose-invert prose-p:text-[#E2E8F0] prose-headings:text-white prose-a:text-[#535CE8] focus:outline-none max-w-none min-h-[500px]' 
      } 
    },
    onUpdate: ({ editor: ed }) => scheduleSave({ content: ed.getJSON() }),
  });

  useEffect(() => { editorRef.current = editor; }, [editor]);

  const { title, setTitle } = useChapterSync(chapter, editor);

  useImperativeHandle(ref, () => ({
    getSelection(): EditorSelection | null {
      if (!editor) return null;
      const { from, to } = editor.state.selection;
      if (from === to) return null;
      return { from, to, quotedText: editor.state.doc.textBetween(from, to, ' ') };
    },
  }), [editor]);

  // ── Empty state ───────────────────────────────────────────────────

  if (!chapter) {
    return <EmptyState />;
  }

  // ── Active editor ─────────────────────────────────────────────────

  return (
    <div className="flex flex-1 justify-center overflow-y-auto bg-transparent p-0">
      <div className="w-full max-w-3xl bg-transparent p-6 md:px-12 md:py-16">
        
        <ChapterTitle
          title={title}
          onChange={(value) => {
            setTitle(value);
            scheduleSave({ title: value });
          }}
        />

        <div className="relative">
          {editor && <BubbleToolbar editor={editor} />}
          <EditorContent editor={editor} />
        </div>
        
      </div>
    </div>
  );
});

export default TiptapEditor;

// ─── Sub-components ─────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-10 h-full">
      <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#171926] border border-white/5 text-[#828A9F]">
          <PenLine className="h-8 w-8 stroke-[1.5]" />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-white mb-1">No Chapter Selected</h3>
          <p className="text-[14px] text-[#828A9F] max-w-[250px] mx-auto">
            Select a chapter from the sidebar or create a new one to begin writing.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChapterTitle({ title, onChange }: { title: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={title}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Untitled Chapter"
      spellCheck={false}
      className="mb-8 w-full border-none bg-transparent pb-3 font-sans text-3xl md:text-4xl font-bold tracking-tight text-white outline-none placeholder:text-[#828A9F] transition-all focus:ring-0 p-0"
    />
  );
}