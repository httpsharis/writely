'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { SuggestionKeyDownProps } from '@tiptap/suggestion';
import type { Editor, Range } from '@tiptap/core';
import { cn } from '@/lib/utils';

// ─── Public types ───────────────────────────────────────────────────

export interface CommandItem {
  title: string;
  description?: string;
  icon: React.ReactNode;
  category: string;
  command: (props: { editor: Editor; range: Range }) => void;
}

export interface CommandMenuProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export interface CommandMenuRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────

/** Groups a flat command list into `{ category → items[] }` preserving order. */
function groupByCategory(items: CommandItem[]) {
  const map = new Map<string, CommandItem[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return map;
}

// ─── Component ──────────────────────────────────────────────────────

const CommandMenu = forwardRef<CommandMenuRef, CommandMenuProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevItems, setPrevItems] = useState(props.items);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset cursor when filtered list changes (derived state pattern)
  if (props.items !== prevItems) {
    setPrevItems(props.items);
    setSelectedIndex(0);
  }

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  // Keyboard handler exposed to Tiptap's suggestion plugin
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: SuggestionKeyDownProps) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % props.items.length);
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

  const grouped = groupByCategory(props.items);
  let flatIdx = 0;

  return (
    <div
      ref={scrollRef}
      className="z-50 flex max-h-72 w-56 flex-col overflow-y-auto border-[3px] border-black bg-white shadow-[4px_4px_0px_black]"
    >
      {[...grouped.entries()].map(([category, items]) => (
        <div key={category}>
          {/* Category header */}
          <div className="sticky top-0 border-b border-gray-100 bg-gray-50 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">
            {category}
          </div>

          {/* Items */}
          {items.map((item) => {
            const idx = flatIdx++;
            return (
              <CommandRow
                key={item.title}
                item={item}
                isSelected={idx === selectedIndex}
                onClick={() => selectItem(idx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

CommandMenu.displayName = 'CommandMenu';
export default CommandMenu;

// ─── Sub-component ──────────────────────────────────────────────────

function CommandRow({
  item, isSelected, onClick,
}: {
  item: CommandItem; isSelected: boolean; onClick: () => void;
}) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors',
        isSelected ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100',
      )}
      onClick={onClick}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 border-current/20">
        {item.icon}
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-xs font-bold">{item.title}</p>
        {item.description && (
          <p className={cn(
            'truncate text-[10px]',
            isSelected ? 'text-gray-300' : 'text-gray-400',
          )}>
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
}