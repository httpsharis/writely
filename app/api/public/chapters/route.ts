/**
 * /api/public/chapters — Public published chapter list.
 * GET /api/public/chapters?novelId=xxx
 * No auth. Only returns published chapters from published novels.
 */

import { NextResponse } from 'next/server';
import Chapter from '@/models/Chapter';
import { getPublishedProject, badRequestResponse, serverErrorResponse } from '@/lib/api-helpers';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const novelId = searchParams.get('novelId');
        if (!novelId) return badRequestResponse('novelId query param is required');

        const result = await getPublishedProject(novelId);
        if (result instanceof NextResponse) return result;

        const chapters = await Chapter.find({ projectId: novelId, status: 'published' })
            .select('title order wordCount status createdAt updatedAt')
            .sort({ order: 1 })
            .lean();

        return NextResponse.json(chapters);
    } catch (error) {
        console.error('[API] GET /api/public/chapters error:', error);
        return serverErrorResponse('Failed to fetch chapters');
    }
}
