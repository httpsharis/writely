import { Types } from 'mongoose';

// ─── Content Types ──────────────────────────────────────────────────

export type ContentType = 'html' | 'tiptap' | 'markdown';
export type ChapterStatus = 'draft' | 'published';

// ─── Comment Anchor ─────────────────────────────────────────────────

export interface CommentAnchor {
  from: number;       // tiptap doc position — selection start
  to: number;         // tiptap doc position — selection end
  quotedText: string; // snapshot of highlighted text
}

// ─── Writer Comment (inline note on selected text) ──────────────────

export interface IWriterComment {
  _id?: Types.ObjectId;
  userId: string;
  userName: string;
  text: string;
  anchor: CommentAnchor;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Chapter Document ───────────────────────────────────────────────

export interface IChapter {
  _id?: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  content: Record<string, unknown> | string;
  contentType: ContentType;
  order: number;
  status: ChapterStatus;
  wordCount: number;
  writerComments: IWriterComment[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Request Types ──────────────────────────────────────────────

/** Fields allowed when creating a chapter */
export interface CreateChapterInput {
  projectId: string;
  title?: string;
}

/** Fields allowed when updating a chapter */
export interface UpdateChapterInput {
  title?: string;
  content?: Record<string, unknown> | string;
  order?: number;
  status?: ChapterStatus;
}

/** Fields for adding a writer comment */
export interface AddCommentInput {
  text: string;
  anchor: CommentAnchor;
}

/** Client-safe writer comment (string _id) */
export interface WriterComment {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  anchor: CommentAnchor;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}