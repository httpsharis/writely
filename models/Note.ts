import mongoose, { Schema, Document } from 'mongoose';
import type { INote as INoteBase } from '@/types/note';

// ─── Document Interface ─────────────────────────────────────────────

export interface INoteDocument extends INoteBase, Document {}

// ─── Schema Definition ──────────────────────────────────────────────

const NoteSchema = new Schema<INoteDocument>(
    {
        userEmail: {
            type: String,
            required: [true, 'User email is required'],
            index: true,
        },
        novelId: {
            type: String,
            default: null,
            index: true,
        },
        novelTitle: {
            type: String,
            default: null,
        },
        title: {
            type: String,
            required: [true, 'Note title is required'],
            default: 'Untitled Note',
            maxlength: [300, 'Title cannot exceed 300 characters'],
        },
        content: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true },
);

// ─── Export (hot-reload safe) ───────────────────────────────────────

const Note = (mongoose.models.Note as mongoose.Model<INoteDocument>) ||
    mongoose.model<INoteDocument>('Note', NoteSchema);

export default Note;
