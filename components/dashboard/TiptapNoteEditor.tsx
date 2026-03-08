'use client';

import { useCallback } from 'react';
import { Bold, Italic, Heading1, Heading2, List, X } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor } from '@tiptap/react';
import type { NoteData } from '@/lib/api-client';
import type { NovelData } from '@/lib/api-client';

// ─── Tiptap Extensions ─────────────────────────────────────────────

const EXTENSIONS = [
  StarterKit,
  Underline,
  Placeholder.configure({ placeholder: 'Start writing your note…' }),
];

// ─── Toolbar Button ─────────────────────────────────────────────────

interface ToolbarBtnProps {
  icon: React.ReactNode;
  active: boolean;
  onPress: () => void;
  label: string;
}

function ToolbarBtn({ icon, active, onPress, label }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => { e.preventDefault(); onPress(); }}
      className={`cursor-pointer border-2 p-1.5 transition-all ${
        active
          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
          : 'border-transparent text-neutral-500 hover:border-black hover:text-black dark:text-neutral-400 dark:hover:border-white dark:hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}

// ─── Formatting Toolbar ─────────────────────────────────────────────

interface FormattingBarProps {
  editor: Editor;
}

function FormattingBar({ editor }: FormattingBarProps) {
  const buttons = [
    { icon: <Bold size={14} />, cmd: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
    { icon: <Italic size={14} />, cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
    { icon: <Heading1 size={14} />, cmd: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), label: 'Heading 1' },
    { icon: <Heading2 size={14} />, cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'Heading 2' },
    { icon: <List size={14} />, cmd: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet List' },
  ];

  return (
    <div className="flex gap-1 border-b-2 border-black px-4 py-2 dark:border-white/20">
      {buttons.map((btn) => (
        <ToolbarBtn key={btn.label} icon={btn.icon} active={btn.active} onPress={btn.cmd} label={btn.label} />
      ))}
    </div>
  );
}

// ─── Novel Selector ─────────────────────────────────────────────────

interface NovelSelectorProps {
  novels: NovelData[];
  selectedNovelId: string;
  onChange: (novelId: string, novelTitle: string) => void;
}

function NovelSelector({ novels, selectedNovelId, onChange }: NovelSelectorProps) {
  return (
    <div className="px-6 pt-6">
      <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[2px] text-neutral-400">
        Tag Novel
      </label>
      <select
        value={selectedNovelId}
        onChange={(e) => {
          const id = e.target.value;
          const title = id ? novels.find((n) => n._id === id)?.title ?? '' : '';
          onChange(id, title);
        }}
        className="w-full cursor-pointer border-2 border-black bg-white px-3 py-2 font-mono text-xs text-black outline-none transition-shadow focus:shadow-[2px_2px_0px_black] dark:border-white/20 dark:bg-neutral-900 dark:text-white dark:focus:shadow-[2px_2px_0px_#333]"
      >
        <option value="" className="bg-white text-black dark:bg-neutral-900 dark:text-white">
          Untagged Idea
        </option>
        {novels.map((n) => (
          <option key={n._id} value={n._id} className="bg-white text-black dark:bg-neutral-900 dark:text-white">
            {n.title}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Props ──────────────────────────────────────────────────────────

interface TiptapNoteEditorProps {
  open: boolean;
  novels: NovelData[];
  editingNote: NoteData | null;
  title: string;
  selectedNovelId: string;
  onTitleChange: (title: string) => void;
  onNovelChange: (novelId: string, novelTitle: string) => void;
  onSave: (content: Record<string, unknown>) => void;
  onClose: () => void;
  saving: boolean;
}

// ─── Component ──────────────────────────────────────────────────────

export function TiptapNoteEditor({
  open,
  novels,
  editingNote,
  title,
  selectedNovelId,
  onTitleChange,
  onNovelChange,
  onSave,
  onClose,
  saving,
}: TiptapNoteEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: EXTENSIONS,
    content: editingNote?.content ?? '',
    editorProps: {
      attributes: {
        class: 'note-editor-prose',
      },
    },
  }, [editingNote]);

  const handleSave = useCallback(() => {
    if (!editor) return;
    onSave(editor.getJSON() as Record<string, unknown>);
  }, [editor, onSave]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] dark:border-white/20 dark:bg-[#121212] dark:shadow-[6px_6px_0px_#333333]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-4 dark:border-white/20">
          <h2 className="font-mono text-sm font-extrabold uppercase tracking-[2px] dark:text-white">
            {editingNote ? 'Edit Note' : 'Create Note'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent p-1 text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Novel selector */}
          <NovelSelector novels={novels} selectedNovelId={selectedNovelId} onChange={onNovelChange} />

          {/* Title input */}
          <div className="px-6 pt-5">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Note Title"
              className="w-full border-none bg-transparent text-xl font-extrabold uppercase tracking-tight outline-none placeholder:text-neutral-300 dark:text-white dark:placeholder:text-neutral-600"
            />
          </div>

          {/* Formatting toolbar */}
          <div className="mt-4">
            {editor && <FormattingBar editor={editor} />}
          </div>

          {/* Tiptap editor */}
          <div className="min-h-50 px-6 py-4">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t-2 border-black px-6 py-4 dark:border-white/20">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer border-2 border-black bg-[#FFDF00] px-6 py-2.5 font-mono text-[11px] font-extrabold uppercase tracking-[2px] text-black transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
}
