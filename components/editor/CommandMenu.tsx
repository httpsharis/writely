'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import type { SuggestionKeyDownProps } from '@tiptap/suggestion';
import type { Editor, Range } from '@tiptap/core';

export interface CommandItem {
  title: string;
  icon: React.ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

export interface CommandMenuProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export interface CommandMenuRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const CommandMenu = forwardRef<CommandMenuRef, CommandMenuProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevItems, setPrevItems] = useState(props.items);

  // 🚨 THE FIX: Derive state during render instead of using useEffect
  // This satisfies the linter and prevents double-renders!
  if (props.items !== prevItems) {
    setPrevItems(props.items);
    setSelectedIndex(0);
  }

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  // Allow Tiptap to pass keyboard events into this React component
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: SuggestionKeyDownProps) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) return null;

  return (
    <div className="z-50 flex w-48 flex-col overflow-hidden border-[3px] border-black bg-white p-1 shadow-[4px_4px_0px_black]">
      {props.items.map((item, index) => (
        <button
          key={index}
          className={`flex items-center gap-2 px-2 py-2 text-left font-mono text-xs font-bold transition-colors ${
            index === selectedIndex ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
          }`}
          onClick={() => selectItem(index)}
        >
          {item.icon}
          {item.title}
        </button>
      ))}
    </div>
  );
});

CommandMenu.displayName = 'CommandMenu';
export default CommandMenu;