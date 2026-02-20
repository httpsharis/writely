// src/types/dashboard.ts
import type { NovelData, ChapterSummary } from '@/lib/api-client';

export interface NovelStatsProps {
  novel: NovelData;
  chapters: ChapterSummary[];
  totalWords: number;
  goalWords: number;
  progressPct: number;
  publishedCount: number;
  draftCount: number;
}

export interface NovelControlsProps {
  novel: NovelData;
  setNovel: (n: NovelData) => void;
  goalWords: number;
}

export interface ChaptersManagerProps {
  novelId: string;
  chapters: ChapterSummary[];
  setChapters: (chapters: ChapterSummary[]) => void;
  onDeleteClick: (chapter: ChapterSummary) => void;
}

export interface AuthorNotesManagerProps {
  novel: NovelData;
  setNovel: (n: NovelData) => void;
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}