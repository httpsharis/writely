/**
 * /api/editor/[novelId] — Bootstrap the editor in one request.
 * Returns: novel metadata + chapter list + first chapter content (decrypted).
 * Saves 3 round trips on initial load.
 */

import { NextResponse } from 'next/server';
import Chapter from '@/models/Chapter';
import { decryptContent, isEncrypted } from '@/lib/encryption';
import {
    getAuthenticatedEmail,
    getOwnedProject,
    unauthorizedResponse,
    serverErrorResponse,
    noCacheJson,
} from '@/lib/api-helpers';

type Params = { params: Promise<{ novelId: string }> };

export async function GET(_req: Request, { params }: Params) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { novelId } = await params;

        // Fetch full project (the editor needs all fields)
        const project = await getOwnedProject(novelId, email);
        if (project instanceof NextResponse) return project;

        // Sidebar chapter list — lightweight, no content
        const chapters = await Chapter.find({ projectId: novelId })
            .select('_id title order status wordCount createdAt updatedAt')
            .sort({ order: 1 })
            .lean();

        // Decrypt first chapter content for immediate display
        let firstChapter = null;
        if (chapters.length > 0) {
            const full = await Chapter.findById(chapters[0]._id).lean();
            if (full) {
                const data = { ...full };
                if (typeof data.content === 'string' && isEncrypted(data.content)) {
                    try { data.content = decryptContent(data.content) as typeof data.content; }
                    catch { data.content = ''; }
                }
                firstChapter = data;
            }
        }

        return noCacheJson({ novel: project, chapters, firstChapter });
    } catch (error) {
        console.error('[API] GET /api/editor/[novelId] error:', error);
        return serverErrorResponse('Failed to fetch editor data');
    }
}
