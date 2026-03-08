/**
 * /api/notes/[id] — Single note CRUD.
 * Routes handle: auth, JSON parsing, response.
 * Business logic lives in NoteService (ownership verified there).
 */

import { NextResponse } from 'next/server';
import {
    getAuthenticatedEmail,
    unauthorizedResponse,
    badRequestResponse,
    handleServiceError,
} from '@/lib/api-helpers';
import * as NoteService from '@/services/noteService';
import type { RouteParams } from '@/types/api';
import type { UpdateNoteInput } from '@/types/note';

// PATCH — Update a note
export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;

        let body: UpdateNoteInput;
        try { body = await req.json(); } catch { return badRequestResponse('Invalid JSON body'); }

        const updated = await NoteService.updateNote(id, email, body);
        return NextResponse.json(updated);
    } catch (error) {
        return handleServiceError(error);
    }
}

// DELETE — Delete a note
export async function DELETE(_req: Request, { params }: RouteParams) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;
        await NoteService.deleteNote(id, email);
        return NextResponse.json({ message: 'Note deleted' });
    } catch (error) {
        return handleServiceError(error);
    }
}
