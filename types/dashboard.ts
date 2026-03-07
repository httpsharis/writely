import type { ReactNode } from 'react';

// ─── Navigation ─────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  active?: boolean;
}

// ─── Recent Chapter Hero ────────────────────────────────────────────

export interface RecentChapterData {
  chapterId: string;
  chapterTitle: string;
  novelId: string;
  novelTitle: string;
  contentPreview: string;
  wordCount: number;
  updatedAt: string;
}

// ─── Widgets ────────────────────────────────────────────────────────

export interface DailyWordCountData {
  current: number;
  goal: number;
}

export interface QuickNote {
  id: string;
  text: string;
  createdAt: string;
}

// ─── Sidebar ────────────────────────────────────────────────────────

export interface SidebarProps {
  userEmail: string;
  userImage?: string | null;
  activeRoute: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSignOut: () => void;
  onCreateNovel: () => void;
  creating: boolean;
}

export interface MobileNavProps {
  activeRoute: string;
  onCreateNovel: () => void;
  creating: boolean;
}
