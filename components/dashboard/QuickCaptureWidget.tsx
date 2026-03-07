'use client';

import { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import type { QuickNote } from '@/types/dashboard';

interface QuickCaptureWidgetProps {
  notes: QuickNote[];
  onAddNote: (text: string) => void;
}

export function QuickCaptureWidget({ notes, onAddNote }: QuickCaptureWidgetProps) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setInput('');
  }, [input, onAddNote]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="border-2 border-black bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
      <h3 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[2px] dark:text-neutral-300">
        Quick Capture
      </h3>

      {/* Input area */}
      <div className="mb-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Jot down an idea..."
          rows={2}
          className="flex-1 resize-none border-2 border-black bg-transparent px-3 py-2 font-mono text-xs leading-relaxed outline-none placeholder:text-neutral-400 focus:shadow-[2px_2px_0px_black] dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-600 dark:focus:shadow-[2px_2px_0px_rgba(255,255,255,0.15)]"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center self-end border-2 border-black bg-primary text-black transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0px_black] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Send size={14} />
        </button>
      </div>

      {/* Recent notes */}
      {notes.length > 0 && (
        <ul className="space-y-2">
          {notes.slice(0, 3).map((note) => (
            <li
              key={note.id}
              className="border-l-2 border-neutral-200 pl-3 font-mono text-[11px] leading-relaxed text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
            >
              {note.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
