'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import type { SuggestionKeyDownProps } from '@tiptap/suggestion';
import type { Editor, Range } from '@tiptap/core';
import type { ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────

export interface CommandItem {
  title: string;
  description?: string;
  icon?: ReactNode;
  category: string;
  command: (props: { editor: Editor; range: Range }) => void;
}

export interface CommandMenuRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

interface Props {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────

/** Group a flat list into { category → items[] } preserving insertion order */
function groupByCategory(items: CommandItem[]) {
  const map = new Map<string, CommandItem[]>();
  for (const item of items) {
    const group = map.get(item.category) ?? [];
    group.push(item);
    map.set(item.category, group);
  }
  return map;
}

// ─── Component ──────────────────────────────────────────────────────

const CommandMenu = forwardRef<CommandMenuRef, Props>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset selection when items change (filter updates)
    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    // Scroll active item into view on every selectedIndex change
    useEffect(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const activeEl = container.querySelector<HTMLElement>(
        '[data-active="true"]',
      );
      if (!activeEl) return;

      // Manual scroll — only scrolls the dropdown, never the page
      const { offsetTop, offsetHeight } = activeEl;
      const { scrollTop, clientHeight } = container;

      if (offsetTop < scrollTop) {
        // Item is above visible area → scroll up
        container.scrollTop = offsetTop;
      } else if (offsetTop + offsetHeight > scrollTop + clientHeight) {
        // Item is below visible area → scroll down
        container.scrollTop = offsetTop + offsetHeight - clientHeight;
      }
    }, [selectedIndex]);

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) command(item);
      },
      [items, command],
    );

    // Expose keyboard handler to the slash extension
    useImperativeHandle(ref, () => ({
      onKeyDown({ event }: SuggestionKeyDownProps) {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((i) => (i + items.length - 1) % items.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="border-[3px] border-black bg-white px-4 py-3 shadow-[4px_4px_0px_black] text-sm text-gray-400 italic dark:border-neutral-600 dark:bg-neutral-900 dark:shadow-[4px_4px_0px_#333] dark:text-neutral-500">
          No results
        </div>
      );
    }

    // Group items but track flat index for keyboard navigation
    const grouped = groupByCategory(items);
    let flatIndex = 0;

    return (
      <div
        ref={scrollRef}
        className="max-h-72 w-64 overflow-y-auto border-[3px] border-black bg-white shadow-[4px_4px_0px_black] dark:border-neutral-600 dark:bg-neutral-900 dark:shadow-[4px_4px_0px_#333]"
      >
        {[...grouped.entries()].map(([category, groupItems]) => (
          <div key={category}>
            {/* ── Category header ── */}
            <div className="sticky top-0 z-10 border-b-2 border-black bg-gray-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
              {category}
            </div>

            {/* ── Items ── */}
            {groupItems.map((item) => {
              const idx = flatIndex++;
              const isActive = idx === selectedIndex;

              return (
                <button
                  key={item.title}
                  data-active={isActive}
                  onClick={() => selectItem(idx)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                    isActive
                      ? 'bg-yellow-100 border-l-[3px] border-l-black dark:bg-yellow-900/30 dark:border-l-primary'
                      : 'border-l-[3px] border-l-transparent hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {/* Icon */}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 border-black bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {item.icon}
                  </span>

                  {/* Title + description */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold leading-tight dark:text-white">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="truncate text-[11px] leading-tight text-gray-400 dark:text-neutral-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);

CommandMenu.displayName = 'CommandMenu';
export default CommandMenu;