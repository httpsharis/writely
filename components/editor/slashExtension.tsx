import { Editor, Extension, Range } from '@tiptap/core';
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance } from 'tippy.js';
import { Heading1, Heading2, List, ListOrdered, Quote, Code, Minus } from 'lucide-react';
import CommandMenu, { type CommandItem, type CommandMenuRef } from './CommandMenu';

// 1. ADDED MORE COMMANDS: Now feels like a true Notion clone
const getSuggestionItems = ({ query }: { query: string }): CommandItem[] => {
  const items: CommandItem[] = [
    {
      title: 'Heading 1',
      icon: <Heading1 size={14} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run(),
    },
    {
      title: 'Heading 2',
      icon: <Heading2 size={14} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
    },
    {
      title: 'Bullet List',
      icon: <List size={14} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      title: 'Numbered List',
      icon: <ListOrdered size={14} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      title: 'Quote',
      icon: <Quote size={14} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setBlockquote().run(),
    },
    {
      title: 'Code Block',
      icon: <Code size={14} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: 'Divider',
      icon: <Minus size={14} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    },
  ];

  return items.filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()));
};

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        // Fix: Properly typed internal Tiptap command execution
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
        render: () => {
          // Fix: Tell TypeScript exactly what type of React component this is
          let component: ReactRenderer<CommandMenuRef>;
          // Fix: Type the tippy instance
          let popup: Instance[];

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(CommandMenu, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) return;

              popup = tippy('body', {
                // Fix: Properly cast the clientRect for Tippy
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

              // 2. IMPROVEMENT: Hide the popup if the user types an invalid command (e.g., "/xyz")
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
              // TypeScript now allows this because we passed `<CommandMenuRef>` earlier!
              return component.ref?.onKeyDown(props) || false;
            },
            onExit() {
              popup[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});