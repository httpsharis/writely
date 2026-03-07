'use client';

import Link from 'next/link';
import { LayoutDashboard, BookOpen, Plus } from 'lucide-react';
import type { MobileNavProps } from '@/types/dashboard';

interface MobileNavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  isAction?: boolean;
}

export function MobileNav({ activeRoute, onCreateNovel, creating }: MobileNavProps) {
  const items: MobileNavItem[] = [
    { label: 'Home', icon: <LayoutDashboard size={20} />, href: '/' },
    { label: 'Create', icon: <Plus size={22} />, href: '#create', isAction: true },
    { label: 'Novels', icon: <BookOpen size={20} />, href: '/novels' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t-2 border-black bg-white dark:border-neutral-700 dark:bg-neutral-950 md:hidden">
      {items.map((item) => {
        if (item.isAction) {
          return (
            <button
              key={item.label}
              onClick={onCreateNovel}
              disabled={creating}
              className="-mt-5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-primary text-black shadow-[2px_2px_0px_black] transition-transform active:translate-y-px active:shadow-none disabled:opacity-50"
            >
              {item.icon}
            </button>
          );
        }

        const isActive = activeRoute === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${
              isActive
                ? 'text-black dark:text-white'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {item.icon}
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
