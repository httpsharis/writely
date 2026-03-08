/**
 * /api/notes — List all notes (GET) and create a new note (POST).
 */

import { NextResponse } from 'next/server';
import {
    getAuthenticatedEmail,
    unauthorizedResponse,
    serverErrorResponse,
    handleServiceError,
} from '@/lib/api-helpers';
import * as NoteService from '@/services/noteService';
import type { CreateNoteInput } from '@/types/note';

// GET — List all notes for the logged-in user (most recent first)
export async function GET() {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const notes = await NoteService.listNotes(email);
        return NextResponse.json(notes);
    } catch (error) {
        console.error('[API] GET /api/notes error:', error);
        return serverErrorResponse('Failed to fetch notes');
    }
}

// POST — Create a new note
export async function POST(req: Request) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        let input: CreateNoteInput = {};
        try { input = await req.json(); } catch { /* Defaults used */ }

        const note = await NoteService.createNote(email, input);
        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        return handleServiceError(error);
    }
}
