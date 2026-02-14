import mongoose, { Schema, model, models, Document, Types } from 'mongoose';
import type { IWriterComment, ContentType } from '@/types/chapter';

// ─── 1. Document Interface ──────────────────────────────────────────

export interface IChapterDocument extends Document {
  projectId: Types.ObjectId;
  title: string;
  content: Record<string, unknown> | string;
  contentType: ContentType;
  order: number;
  status: 'draft' | 'published';
  wordCount: number;
  writerComments: IWriterComment[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── 2. Types & Utilities ────────────────────────────────────────────

/** Represents a node in the Tiptap JSON document tree. */
interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
  [key: string]: unknown;
}

type ChapterContent = TiptapNode | TiptapNode[] | string;

const ContentUtils = {
  /**
   * Recursively extracts plain text from a Tiptap JSON structure.
   */
  extractTextFromTiptap(node: ChapterContent | null | undefined): string {
    if (!node) return '';
    if (typeof node === 'string') return node;

    let text = '';

    if (Array.isArray(node)) {
      return node.map(ContentUtils.extractTextFromTiptap).join(' ');
    }

    if (typeof node === 'object') {
      if (node.text) text += ` ${node.text}`;
      if (node.content) text += ` ${ContentUtils.extractTextFromTiptap(node.content)}`;
    }

    return text.trim();
  },

  /**
   * Counts words based on content type.
   */
  countWords(content: ChapterContent, type: string): number {
    let plainText = '';

    switch (type) {
      case 'tiptap':
        plainText = ContentUtils.extractTextFromTiptap(content);
        break;
      case 'html':
        // Basic HTML tag stripping
        plainText = typeof content === 'string' 
          ? content.replace(/<[^>]*>/g, ' ') 
          : '';
        break;
      case 'markdown':
        // Markdown is mostly text, but this is a rough approximation
        plainText = typeof content === 'string' ? content : '';
        break;
      default:
        plainText = typeof content === 'string' ? content : '';
    }

    // Split by whitespace and filter empty strings
    return plainText.trim().split(/\s+/).filter(Boolean).length;
  }
};

// ─── 3. Schemas ──────────────────────────────────────────────────────

const WriterCommentSchema = new Schema<IWriterComment>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    text: {
      type: String,
      required: true,
      maxlength: [5000, 'Comment cannot exceed 5000 characters'],
    },
    anchor: {
      from: { type: Number, required: true },
      to: { type: Number, required: true },
      quotedText: { type: String, default: '' },
    },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChapterSchema = new Schema<IChapterDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      default: 'New Chapter',
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: { type: Schema.Types.Mixed, default: '' },
    contentType: {
      type: String,
      enum: {
        values: ['html', 'tiptap', 'markdown'],
        message: '{VALUE} is not a valid content type',
      },
      default: 'tiptap',
    },
    order: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
    },
    wordCount: { type: Number, default: 0, min: 0 },
    writerComments: { type: [WriterCommentSchema], default: [] },
  },
  { timestamps: true }
);

// ─── 4. Pre-save Middleware (auto word count) ───────────────────────

ChapterSchema.pre('save', function (this: IChapterDocument) {
  if (!this.isModified('content') && !this.isModified('contentType') && !this.isNew) {
    return;
  }

  try {
    this.wordCount = ContentUtils.countWords(
      this.content,
      this.contentType || 'tiptap'
    );
  } catch (err) {
    console.error('[Chapter] Word count calculation failed:', err);
    this.wordCount = 0;
  }
});

// ─── 5. Export ───────────────────────────────────────────────────────

const Chapter = (models.Chapter as mongoose.Model<IChapterDocument>) ||
  model<IChapterDocument>('Chapter', ChapterSchema);

export default Chapter;