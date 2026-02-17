/**
 * /api/public/novels/[id] — Public novel metadata.
 * No auth required. Only returns published novels.
 */

import { NextResponse } from 'next/server';
import Chapter from '@/models/Chapter';
import { getPublishedProject, serverErrorResponse } from '@/lib/api-helpers';
import type { RouteParams } from '@/types/api';

export async function GET(_req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const project = await getPublishedProject(
            id,
            'title description isPublished status stats userEmail characters authorNotes createdAt updatedAt',
        );
        if (project instanceof NextResponse) return project;

        const publishedCount = await Chapter.countDocuments({ projectId: id, status: 'published' });

        // Shape a safe public response (no internal data)
        return NextResponse.json({
            _id: project._id,
            title: project.title,
            description: project.description,
            authorName: project.userEmail?.split('@')[0] ?? 'Anonymous',
            status: project.status,
            stats: project.stats,
            characterCount: project.characters?.length ?? 0,
            publishedChapterCount: publishedCount,
            authorNotes: (project.authorNotes ?? []).map((n: { text: string; createdAt: Date }) => ({
                text: n.text,
                createdAt: n.createdAt,
            })),
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        });
    } catch (error) {
        console.error('[API] GET /api/public/novels/[id] error:', error);
        return serverErrorResponse('Failed to fetch novel');
    }
}
