'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import type { SidebarProps, NavItem } from '@/types/dashboard';

const NAV_ITEMS: Omit<NavItem, 'active' | 'icon'>[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Novels', href: '/novels' },
];

const NAV_ICONS: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard size={18} />,
  Novels: <BookOpen size={18} />,
};

export function Sidebar({
  userEmail,
  userImage,
  activeRoute,
  darkMode,
  onToggleDarkMode,
  onSignOut,
  onCreateNovel,
  creating,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-dvh w-56 flex-col border-r-2 border-black bg-white dark:border-neutral-700 dark:bg-neutral-950 md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b-2 border-black px-6 dark:border-neutral-700">
        <span className="font-mono text-base font-extrabold tracking-[3px] dark:text-white">
          WRITELY_
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-sm px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-primary text-black'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                  }`}
                >
                  {NAV_ICONS[item.label]}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Create button */}
        <button
          onClick={onCreateNovel}
          disabled={creating}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-black bg-primary text-black px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          <Plus size={14} />
          {creating ? 'Creating...' : 'New Novel'}
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t-2 border-black px-4 py-4 dark:border-neutral-700">
        {/* Theme toggle */}
        <button
          onClick={onToggleDarkMode}
          className="mb-3 flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User info + sign out */}
        <div className="flex items-center gap-2.5">
          {userImage ? (
            <Image
              src={userImage}
              alt=""
              width={28}
              height={28}
              className="rounded-full border-2 border-black dark:border-neutral-600"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-neutral-200 font-mono text-[10px] font-bold dark:border-neutral-600 dark:bg-neutral-700 dark:text-white">
              {userEmail.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="flex-1 truncate font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
            {userEmail}
          </span>
          <button
            onClick={onSignOut}
            title="Sign out"
            className="cursor-pointer rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
