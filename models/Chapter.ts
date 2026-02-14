import mongoose, { Schema, model, models, Document, Types } from 'mongoose';
import type { IWriterComment, ContentType } from '@/types/chapter';
import { ContentUtils } from '../lib/contentUtils';

// ─── Document Interface ─────────────────────────────────────────────

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

// ─── Schemas ─────────────────────────────────────────────────────────

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

// ─── Pre-save Middleware (auto word count) ───────────────────────────

ChapterSchema.pre('save', function (this: IChapterDocument) {
  if (!this.isModified('content') && !this.isModified('contentType') && !this.isNew) {
    return;
  }

  try {
    this.wordCount = ContentUtils.countWords(
      this.content as string,
      this.contentType || 'tiptap'
    );
  } catch (err) {
    console.error('[Chapter] Word count calculation failed:', err);
    this.wordCount = 0;
  }
});

// ─── Export ──────────────────────────────────────────────────────────

const Chapter = (models.Chapter as mongoose.Model<IChapterDocument>) ||
  model<IChapterDocument>('Chapter', ChapterSchema);

export default Chapter;