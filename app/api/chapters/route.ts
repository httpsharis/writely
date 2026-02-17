/**
 * /api/chapters — Chapter list & create.
 * GET  /api/chapters?novelId=xxx → Lightweight chapter list for the sidebar.
 * POST /api/chapters             → Creates a new blank chapter (novelId in body).
 */

import { NextResponse } from 'next/server';
import Chapter from '@/models/Chapter';
import {
    getAuthenticatedEmail,
    getOwnedProject,
    unauthorizedResponse,
    serverErrorResponse,
    badRequestResponse,
    sanitizeString,
    isValidLength,
} from '@/lib/api-helpers';

// GET — Fetch chapter list (title, order, status — no content)
export async function GET(req: Request) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { searchParams } = new URL(req.url);
        const novelId = searchParams.get('novelId');
        if (!novelId) return badRequestResponse('novelId query param is required');

        const result = await getOwnedProject(novelId, email, 'userEmail');
        if (result instanceof NextResponse) return result;

        const chapters = await Chapter.find({ projectId: novelId })
            .select('_id title order status wordCount createdAt updatedAt')
            .sort({ order: 1 })
            .lean();

        return NextResponse.json(chapters);
    } catch (error) {
        console.error('[API] GET /api/chapters error:', error);
        return serverErrorResponse('Failed to fetch chapters');
    }
}

// POST — Create a new chapter at the end of the list
export async function POST(req: Request) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        let body;
        try { body = await req.json(); } catch { return badRequestResponse('Invalid JSON'); }

        const novelId = body.novelId;
        if (!novelId) return badRequestResponse('novelId is required');

        const result = await getOwnedProject(novelId, email, 'userEmail');
        if (result instanceof NextResponse) return result;

        // Sanitize optional title
        let title = 'New Chapter';
        if (body.title) {
            title = sanitizeString(body.title);
            if (!isValidLength(title, 1, 200)) {
                return badRequestResponse('Title must be between 1 and 200 characters');
            }
        }

        // Find the highest order and add 1 (avoids collisions from deleted chapters)
        const lastChapter = await Chapter.findOne({ projectId: novelId })
            .sort({ order: -1 })
            .select('order')
            .lean();

        const newChapter = await Chapter.create({
            projectId: novelId,
            title,
            order: (lastChapter?.order ?? -1) + 1,
        });

        return NextResponse.json(newChapter, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/chapters error:', error);
        return serverErrorResponse('Failed to create chapter');
    }
}
