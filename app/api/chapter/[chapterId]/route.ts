import { NextResponse } from 'next/server';
import {
    getAuthenticatedEmail,
    unauthorizedResponse,
    serverErrorResponse,
    notFoundResponse,
    forbiddenResponse,
    badRequestResponse,
    noCacheJson
} from '@/lib/api-helpers';
import * as ChapterService from '@/services/chapterService';
import { ServiceError } from '@/lib/error';

// Helper to catch Service Errors and return the right HTTP response
function handleServiceError(error: unknown) {
    if (error instanceof ServiceError) {
        if (error.type === 'NOT_FOUND') return notFoundResponse();
        if (error.type === 'FORBIDDEN') return forbiddenResponse();
        if (error.type === 'BAD_REQUEST') return badRequestResponse(error.message);
    }
    console.error('[API Error]', error);
    return serverErrorResponse();
}

// ─── ROUTE HANDLERS ─────────────────────────────────────────────────

export async function GET(req: Request, { params }: { params: { chapterId: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        // Use `await params` because Next.js 15+ treats params as a Promise
        const { chapterId } = await params;

        // Call Service
        const chapter = await ChapterService.getChapter(chapterId, email);

        return noCacheJson(chapter);
    } catch (error) {
        return handleServiceError(error);
    }
}

export async function PATCH(req: Request, { params }: { params: { chapterId: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { chapterId } = await params;

        let body;
        try { body = await req.json(); } catch { return badRequestResponse('Invalid JSON'); }

        // Handle comment operations
        if (body.addComment) {
            const updatedChapter = await ChapterService.addComment(chapterId, email, body.addComment);
            return noCacheJson(updatedChapter);
        }

        if (body.removeCommentId) {
            const updatedChapter = await ChapterService.removeComment(chapterId, email, body.removeCommentId);
            return noCacheJson(updatedChapter);
        }

        if (body.resolveCommentId) {
            const updatedChapter = await ChapterService.toggleCommentResolved(chapterId, email, body.resolveCommentId);
            return noCacheJson(updatedChapter);
        }

        // Handle regular chapter updates
        const updatedChapter = await ChapterService.updateChapter(chapterId, email, body);

        return noCacheJson(updatedChapter);
    } catch (error) {
        return handleServiceError(error);
    }
}

export async function DELETE(req: Request, { params }: { params: { chapterId: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { chapterId } = await params;

        // Call Service
        await ChapterService.deleteChapter(chapterId, email);

        return NextResponse.json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        return handleServiceError(error);
    }
}