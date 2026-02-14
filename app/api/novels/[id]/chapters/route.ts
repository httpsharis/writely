import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Chapter from '@/models/Chapter';
import {
    getAuthenticatedEmail,
    unauthorizedResponse,
    forbiddenResponse,
    notFoundResponse,
    serverErrorResponse,
    badRequestResponse,
    sanitizeString,
    isValidLength,
} from '@/lib/api-helpers';
import type { RouteParams } from '@/types/api';

// ─── Helper ─────────────────────────────────────────────────────────
//
// Both GET and POST need to confirm:
//   1. The novel exists
//   2. The logged-in user owns it
//
// Instead of duplicating that check, we extract it here.
// .select('userEmail') tells Mongo: "only send me this one field"
// — no need to load the full novel just to check ownership.

async function verifyNovelOwnership(novelId: string, email: string) {
    const project = await Project.findById(novelId).select('userEmail').lean();

    if (!project) return notFoundResponse('Novel');
    if (project.userEmail !== email) return forbiddenResponse();

    return null; // null = no error, ownership confirmed
}

// ============================================
// GET  /api/novels/[id]/chapters
// ============================================
// Purpose: Feed the sidebar with a lightweight chapter list.
//
// Why lightweight?
//   Chapter content can be huge (thousands of words).
//   The sidebar only needs: title, order, status, wordCount.
//   .select() picks ONLY those fields → faster queries, less bandwidth.
//
// Why .sort({ order: 1 })?
//   order: 1 means ascending (Ch 0, Ch 1, Ch 2 …).
//   This guarantees the sidebar shows chapters in the right sequence.
//
// Why .lean()?
//   Returns plain JS objects instead of full Mongoose documents.
//   We're only reading data here, so we don't need .save() or other
//   Mongoose methods. Plain objects are faster and use less memory.

export async function GET(_req: Request, { params }: RouteParams) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id: novelId } = await params;
        await connectDB();

        const error = await verifyNovelOwnership(novelId, email);
        if (error) return error;

        const chapters = await Chapter.find({ projectId: novelId })
            .select('_id title order status wordCount createdAt updatedAt')
            .sort({ order: 1 })
            .lean();

        return NextResponse.json(chapters);
    } catch (error) {
        console.error('[API] GET /api/novels/[id]/chapters error:', error);
        return serverErrorResponse('Failed to fetch chapters');
    }
}

// ============================================
// POST  /api/novels/[id]/chapters
// ============================================
// Purpose: Create a new blank chapter at the end of the list.
//
// How ordering works:
//   If 3 chapters exist (order 0, 1, 2), countDocuments() returns 3.
//   The new chapter gets order = 3 → it appears last in the sidebar.
//
// Why Chapter.create() and not new Chapter() + .save()?
//   .create() does both in one step. Less code, same result.
//   The pre-save hook still runs (it calculates wordCount).

export async function POST(req: Request, { params }: RouteParams) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id: novelId } = await params;
        await connectDB();

        const error = await verifyNovelOwnership(novelId, email);
        if (error) return error;

        // Parse optional body — caller can provide a custom title
        let title = 'New Chapter';
        try {
            const body = await req.json();
            if (body.title) {
                title = sanitizeString(body.title);
                if (!isValidLength(title, 1, 200)) {
                    return badRequestResponse('Title must be between 1 and 200 characters');
                }
            }
        } catch {
            // No body or invalid JSON — use default title
        }

        // New chapter goes at the end
        const nextOrder = await Chapter.countDocuments({ projectId: novelId });

        const newChapter = await Chapter.create({
            projectId: novelId,
            title,
            order: nextOrder,
        });

        return NextResponse.json(newChapter, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/novels/[id]/chapters error:', error);
        return serverErrorResponse('Failed to create chapter');
    }
}
