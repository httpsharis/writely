'use client';

import { useEffect, useRef } from 'react';

interface ContentShieldProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ContentShield — wraps content with copy/paste protection.
 *
 * Blocks: right-click, text selection (CSS), Ctrl+C / Ctrl+A,
 * drag start, and print (via CSS @media print).
 *
 * Note: No client-side protection is 100% foolproof against
 * determined users with DevTools, but this deters casual copying.
 */
export function ContentShield({ children, className = '' }: ContentShieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleContextMenu(e: Event) {
      e.preventDefault();
    }

    function handleCopy(e: Event) {
      e.preventDefault();
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Block Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+P
      if ((e.ctrlKey || e.metaKey) && ['c', 'a', 's', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
    }

    function handleDragStart(e: Event) {
      e.preventDefault();
    }

    el.addEventListener('contextmenu', handleContextMenu);
    el.addEventListener('copy', handleCopy);
    el.addEventListener('keydown', handleKeyDown);
    el.addEventListener('dragstart', handleDragStart);

    return () => {
      el.removeEventListener('contextmenu', handleContextMenu);
      el.removeEventListener('copy', handleCopy);
      el.removeEventListener('keydown', handleKeyDown);
      el.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <div ref={ref} className={`content-shield ${className}`} tabIndex={-1}>
      {children}
    </div>
  );
}
