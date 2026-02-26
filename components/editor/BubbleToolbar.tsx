'use client';

import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/core';
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  Quote, Undo2, Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────

interface Props {
  editor: Editor;
}

interface FormatBtn {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  isActive: () => boolean;
}

// ─── Component ──────────────────────────────────────────────────────

export default function BubbleToolbar({ editor }: Props) {
  const groups = getButtonGroups(editor);

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'top', offset: 8 }}
      className="flex items-center gap-px border-[3px] border-black bg-white p-1 shadow-[4px_4px_0px_black]"
    >
      {groups.map((group, gi) => (
        <ButtonGroup key={gi} buttons={group} isLast={gi === groups.length - 1} />
      ))}
    </BubbleMenu>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function ButtonGroup({ buttons, isLast }: { buttons: FormatBtn[]; isLast: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-px',
        !isLast && 'border-r border-gray-200 pr-1 mr-1',
      )}
    >
      {buttons.map((btn, i) => (
        <button
          key={i}
          type="button"
          title={btn.title}
          onMouseDown={(e) => {
            e.preventDefault();   // keep selection alive
            btn.action();
          }}
          className={cn(
            'inline-flex cursor-pointer items-center justify-center',
            'h-7 w-7 rounded border-2 border-transparent',
            'text-gray-600 transition-all',
            'hover:border-gray-300 hover:bg-gray-100 hover:text-black',
            btn.isActive() && 'border-black! bg-black text-white!',
          )}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}

// ─── Button definitions ─────────────────────────────────────────────

function getButtonGroups(editor: Editor): FormatBtn[][] {
  return [
    // ── Inline marks ──
    [
      {
        icon: <Bold size={14} />,
        title: 'Bold (Ctrl+B)',
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive('bold'),
      },
      {
        icon: <Italic size={14} />,
        title: 'Italic (Ctrl+I)',
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive('italic'),
      },
      {
        icon: <Underline size={14} />,
        title: 'Underline (Ctrl+U)',
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: () => editor.isActive('underline'),
      },
      {
        icon: <Strikethrough size={14} />,
        title: 'Strikethrough',
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive('strike'),
      },
      {
        icon: <Code size={14} />,
        title: 'Inline code',
        action: () => editor.chain().focus().toggleCode().run(),
        isActive: () => editor.isActive('code'),
      },
    ],
    // ── Block-level headings ──
    [
      {
        icon: <Heading1 size={14} />,
        title: 'Heading 1',
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.isActive('heading', { level: 1 }),
      },
      {
        icon: <Heading2 size={14} />,
        title: 'Heading 2',
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive('heading', { level: 2 }),
      },
      {
        icon: <Heading3 size={14} />,
        title: 'Heading 3',
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.isActive('heading', { level: 3 }),
      },
    ],
    // ── Block actions ──
    [
      {
        icon: <Quote size={14} />,
        title: 'Block quote',
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.isActive('blockquote'),
      },
    ],
    // ── History ──
    [
      {
        icon: <Undo2 size={14} />,
        title: 'Undo (Ctrl+Z)',
        action: () => editor.chain().focus().undo().run(),
        isActive: () => false,
      },
      {
        icon: <Redo2 size={14} />,
        title: 'Redo (Ctrl+Y)',
        action: () => editor.chain().focus().redo().run(),
        isActive: () => false,
      },
    ],
  ];
}
