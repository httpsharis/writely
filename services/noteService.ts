/**
 * noteService.ts — Business logic for global notes CRUD.
 *
 * Routes handle HTTP concerns (auth, parsing, responses).
 * This service handles validation + database operations.
 * Throws ServiceError on failure → the route maps it to an HTTP status.
 */

import Note from '@/models/Note';
import connectDB from '@/lib/db';
import { sanitizeString, isValidLength } from '@/lib/api-helpers';
import { ServiceError } from '@/lib/error';
import type { CreateNoteInput, UpdateNoteInput } from '@/types/note';

// ─── List Notes ─────────────────────────────────────────────────────

export async function listNotes(userEmail: string) {
    await connectDB();
    return Note.find({ userEmail }).sort({ updatedAt: -1 }).lean();
}

// ─── Create Note ────────────────────────────────────────────────────

export async function createNote(userEmail: string, input: CreateNoteInput) {
    await connectDB();

    const title = input.title ? sanitizeString(input.title) : 'Untitled Note';
    if (!isValidLength(title, 1, 300)) {
        throw new ServiceError('Title must be between 1 and 300 characters', 'BAD_REQUEST');
    }

    const novelTitle = input.novelTitle ? sanitizeString(input.novelTitle) : null;

    return Note.create({
        userEmail,
        novelId: input.novelId || undefined,
        novelTitle: novelTitle || undefined,
        title,
        content: input.content ?? {},
    });
}

// ─── Update Note ────────────────────────────────────────────────────

export async function updateNote(noteId: string, userEmail: string, input: UpdateNoteInput) {
    await connectDB();

    const note = await Note.findById(noteId);
    if (!note) throw new ServiceError('Note not found', 'NOT_FOUND');
    if (note.userEmail !== userEmail) throw new ServiceError('Forbidden', 'FORBIDDEN');

    const setFields: Record<string, unknown> = {};

    if (input.title !== undefined) {
        const title = sanitizeString(input.title);
        if (!isValidLength(title, 1, 300)) {
            throw new ServiceError('Title must be between 1 and 300 characters', 'BAD_REQUEST');
        }
        setFields.title = title;
    }

    if (input.novelId !== undefined) {
        setFields.novelId = input.novelId;
    }

    if (input.novelTitle !== undefined) {
        setFields.novelTitle = input.novelTitle ? sanitizeString(input.novelTitle) : null;
    }

    if (input.content !== undefined) {
        setFields.content = input.content;
    }

    if (Object.keys(setFields).length === 0) {
        throw new ServiceError('No fields to update', 'BAD_REQUEST');
    }

    const updated = await Note.findByIdAndUpdate(noteId, { $set: setFields }, { new: true }).lean();
    return updated;
}

// ─── Delete Note ────────────────────────────────────────────────────

export async function deleteNote(noteId: string, userEmail: string) {
    await connectDB();

    const note = await Note.findById(noteId);
    if (!note) throw new ServiceError('Note not found', 'NOT_FOUND');
    if (note.userEmail !== userEmail) throw new ServiceError('Forbidden', 'FORBIDDEN');

    await Note.findByIdAndDelete(noteId);
}
