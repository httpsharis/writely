import { Editor, Extension, Range } from '@tiptap/core';
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance } from 'tippy.js';
import {
  Pilcrow, Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks,
  Quote, Code, Minus, SquareCode, Sparkles,
} from 'lucide-react';
import CommandMenu, { type CommandItem, type CommandMenuRef } from './CommandMenu';

// ─── 1. COMMAND DEFINITIONS (grouped by category) ───────────────────

const ALL_COMMANDS: CommandItem[] = [
  // ── Text ──
  {
    title: 'Text',
    description: 'Plain paragraph block',
    icon: <Pilcrow size={14} />,
    category: 'Text',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('paragraph').run(),
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 size={14} />,
    category: 'Text',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 size={14} />,
    category: 'Text',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Heading3 size={14} />,
    category: 'Text',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
  },

  // ── Lists ──
  {
    title: 'Bullet List',
    description: 'Unordered list of items',
    icon: <List size={14} />,
    category: 'Lists',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Ordered list with numbers',
    icon: <ListOrdered size={14} />,
    category: 'Lists',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Task List',
    description: 'Checklist with toggles',
    icon: <ListChecks size={14} />,
    category: 'Lists',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },

  // ── Blocks ──
  {
    title: 'Quote',
    description: 'Block quote for emphasis',
    icon: <Quote size={14} />,
    category: 'Blocks',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Formatted code snippet',
    icon: <SquareCode size={14} />,
    category: 'Blocks',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Inline Code',
    description: 'Monospace code text',
    icon: <Code size={14} />,
    category: 'Blocks',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCode().run(),
  },

  // ── Dividers ──
  {
    title: 'Divider',
    description: 'Horizontal rule',
    icon: <Minus size={14} />,
    category: 'Dividers',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: 'Scene Break',
    description: 'Three-star scene separator',
    icon: <Sparkles size={14} />,
    category: 'Dividers',
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHorizontalRule()
        .insertContent('<p style="text-align:center">⁂</p>')
        .run(),
  },
];

// ─── 2. FILTER LOGIC ────────────────────────────────────────────────

function getSuggestionItems({ query }: { query: string }): CommandItem[] {
  if (!query) return ALL_COMMANDS;
  const q = query.toLowerCase();
  return ALL_COMMANDS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q),
  );
}

// ─── 3. EXTENSION ───────────────────────────────────────────────────

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: CommandItem }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: getSuggestionItems,
        render: () => createSuggestionRenderer(),
      }),
    ];
  },
});

// ─── 4. TIPPY RENDERER (isolated for readability) ───────────────────

function createSuggestionRenderer() {
  let component: ReactRenderer<CommandMenuRef>;
  let popup: Instance[];

  return {
    onStart(props: SuggestionProps) {
      component = new ReactRenderer(CommandMenu, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) return;

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect as () => DOMRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },

    onUpdate(props: SuggestionProps) {
      component.updateProps(props);
      if (!props.clientRect) return;

      // Hide popup when zero matches (e.g. "/xyz")
      if (props.items.length === 0) {
        popup[0].hide();
      } else {
        popup[0].show();
      }

      popup[0].setProps({
        getReferenceClientRect: props.clientRect as () => DOMRect,
      });
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      if (props.event.key === 'Escape') {
        popup[0].hide();
        return true;
      }
      return component.ref?.onKeyDown(props) || false;
    },

    onExit() {
      popup[0]?.destroy();
      component?.destroy();
    },
  };
}