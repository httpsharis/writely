/**
 * /api/chapters/[id] — Single chapter CRUD + comment operations.
 * All business logic is in ChapterService.
 */

import { NextResponse } from 'next/server';
import {
    getAuthenticatedEmail,
    unauthorizedResponse,
    badRequestResponse,
    handleServiceError,
    noCacheJson,
} from '@/lib/api-helpers';
import * as ChapterService from '@/services/chapterService';

type Params = { params: Promise<{ id: string }> };

// GET — Fetch a single chapter (decrypted)
export async function GET(_req: Request, { params }: Params) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;
        const chapter = await ChapterService.getChapter(id, email);
        return noCacheJson(chapter);
    } catch (error) {
        return handleServiceError(error);
    }
}

// PATCH — Update chapter fields or manage comments
export async function PATCH(req: Request, { params }: Params) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;

        let body;
        try { body = await req.json(); } catch { return badRequestResponse('Invalid JSON'); }

        // Comment operations (checked first, mutually exclusive with field updates)
        if (body.addComment) {
            return noCacheJson(await ChapterService.addComment(id, email, body.addComment));
        }
        if (body.removeCommentId) {
            return noCacheJson(await ChapterService.removeComment(id, email, body.removeCommentId));
        }
        if (body.resolveCommentId) {
            return noCacheJson(await ChapterService.toggleCommentResolved(id, email, body.resolveCommentId));
        }

        // Regular chapter field updates
        const updated = await ChapterService.updateChapter(id, email, body);
        return noCacheJson(updated);
    } catch (error) {
        return handleServiceError(error);
    }
}

// DELETE — Delete a chapter
export async function DELETE(_req: Request, { params }: Params) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;
        await ChapterService.deleteChapter(id, email);
        return NextResponse.json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        return handleServiceError(error);
    }
}
