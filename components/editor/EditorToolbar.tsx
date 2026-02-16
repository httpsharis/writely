'use client';

import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Minus,
  Undo2, Redo2,
  AArrowUp, AArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  editor: Editor | null;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

interface ToolBtn {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  isActive: () => boolean;
}

const FONT_SIZES = [14, 15, 16, 17, 18, 20, 22] as const;

export default function EditorToolbar({ editor, fontSize, onFontSizeChange }: Props) {
  if (!editor) return null;

  function decreaseFont() {
    const idx = FONT_SIZES.indexOf(fontSize as typeof FONT_SIZES[number]);
    if (idx > 0) onFontSizeChange(FONT_SIZES[idx - 1]);
    else if (idx === -1) onFontSizeChange(FONT_SIZES[0]);
  }

  function increaseFont() {
    const idx = FONT_SIZES.indexOf(fontSize as typeof FONT_SIZES[number]);
    if (idx < FONT_SIZES.length - 1) onFontSizeChange(FONT_SIZES[idx + 1]);
    else if (idx === -1) onFontSizeChange(FONT_SIZES[FONT_SIZES.length - 1]);
  }

  const groups: ToolBtn[][] = [
    [
      { icon: <Bold size={15} />, title: 'Bold (Ctrl+B)', action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive('bold') },
      { icon: <Italic size={15} />, title: 'Italic (Ctrl+I)', action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive('italic') },
      { icon: <Underline size={15} />, title: 'Underline (Ctrl+U)', action: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive('underline') },
      { icon: <Strikethrough size={15} />, title: 'Strikethrough', action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive('strike') },
      { icon: <Code size={15} />, title: 'Inline Code', action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive('code') },
    ],
    [
      { icon: <Heading1 size={15} />, title: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }) },
      { icon: <Heading2 size={15} />, title: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }) },
      { icon: <Heading3 size={15} />, title: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive('heading', { level: 3 }) },
    ],
    [
      { icon: <List size={15} />, title: 'Bullet List', action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive('bulletList') },
      { icon: <ListOrdered size={15} />, title: 'Numbered List', action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive('orderedList') },
      { icon: <Quote size={15} />, title: 'Block Quote', action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive('blockquote') },
      { icon: <Minus size={15} />, title: 'Horizontal Rule', action: () => editor.chain().focus().setHorizontalRule().run(), isActive: () => false },
    ],
    [
      { icon: <Undo2 size={15} />, title: 'Undo (Ctrl+Z)', action: () => editor.chain().focus().undo().run(), isActive: () => false },
      { icon: <Redo2 size={15} />, title: 'Redo (Ctrl+Y)', action: () => editor.chain().focus().redo().run(), isActive: () => false },
    ],
  ];

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-0.5 overflow-x-auto border-b-[3px] border-black bg-white px-2 py-1.5 sm:px-3">
      {groups.map((group, gi) => (
        <div
          key={gi}
          className="flex items-center gap-px border-r border-gray-200 pr-1.5 mr-1.5 last:border-r-0 last:pr-0 last:mr-0"
        >
          {group.map((btn, bi) => (
            <button
              key={bi}
              type="button"
              title={btn.title}
              onClick={btn.action}
              className={cn(
                'inline-flex shrink-0 cursor-pointer items-center justify-center w-7 h-7 rounded border-2 border-transparent text-gray-500 transition-all',
                'hover:bg-gray-100 hover:border-gray-300 hover:text-black',
                'sm:w-8 sm:h-8',
                btn.isActive() && 'bg-black text-white! border-black',
              )}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      ))}

      {/* Font size controls */}
      <div className="flex items-center gap-px border-r border-gray-200 pr-1.5 mr-1.5 last:border-r-0 last:pr-0 last:mr-0">
        <button
          type="button"
          title="Decrease font size"
          onClick={decreaseFont}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded border-2 border-transparent text-gray-500 transition-all hover:bg-gray-100 hover:border-gray-300 hover:text-black"
        >
          <AArrowDown size={15} />
        </button>
        <span className="mx-1 font-mono text-[10px] font-bold text-gray-500 select-none min-w-6 text-center">
          {fontSize}
        </span>
        <button
          type="button"
          title="Increase font size"
          onClick={increaseFont}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded border-2 border-transparent text-gray-500 transition-all hover:bg-gray-100 hover:border-gray-300 hover:text-black"
        >
          <AArrowUp size={15} />
        </button>
      </div>
    </div>
  );
}
