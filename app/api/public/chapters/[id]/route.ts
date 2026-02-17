/**
 * /api/public/chapters/[id] — Public chapter reader.
 * GET /api/public/chapters/[id]?novelId=xxx
 * Decrypts content, base64-encodes for transport, adds prev/next navigation.
 */

import { NextResponse } from 'next/server';
import Chapter from '@/models/Chapter';
import { decryptContent, isEncrypted } from '@/lib/encryption';
import { getPublishedProject, notFoundResponse, badRequestResponse, serverErrorResponse } from '@/lib/api-helpers';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
    try {
        const { id: chapterId } = await params;

        const { searchParams } = new URL(req.url);
        const novelId = searchParams.get('novelId');
        if (!novelId) return badRequestResponse('novelId query param is required');

        const project = await getPublishedProject(novelId, 'isPublished title userEmail');
        if (project instanceof NextResponse) return project;

        // Fetch and validate the chapter
        const chapter = await Chapter.findById(chapterId).lean();
        if (!chapter || chapter.projectId.toString() !== novelId || chapter.status !== 'published') {
            return notFoundResponse('Chapter');
        }

        // Decrypt content
        let content = chapter.content;
        if (content && isEncrypted(content)) {
            content = decryptContent(content as string) as typeof content;
        }

        // Build prev/next navigation from all published chapters
        const published = await Chapter.find({ projectId: novelId, status: 'published' })
            .select('_id order title')
            .sort({ order: 1 })
            .lean();

        const idx = published.findIndex((c) => c._id.toString() === chapterId);
        const prev = idx > 0 ? published[idx - 1] : null;
        const next = idx < published.length - 1 ? published[idx + 1] : null;

        // Base64-encode content so it's not plain-readable in the Network tab
        const contentPayload = Buffer.from(JSON.stringify(content)).toString('base64');

        return NextResponse.json({
            _id: chapter._id,
            title: chapter.title,
            content: contentPayload,
            contentType: chapter.contentType,
            contentEncoding: 'base64',
            order: chapter.order,
            wordCount: chapter.wordCount,
            novelTitle: project.title,
            authorName: project.userEmail?.split('@')[0] ?? 'Anonymous',
            prevChapter: prev ? { _id: prev._id, title: prev.title } : null,
            nextChapter: next ? { _id: next._id, title: next.title } : null,
            totalChapters: published.length,
            chapterNumber: idx + 1,
        });
    } catch (error) {
        console.error('[API] GET /api/public/chapters/[id] error:', error);
        return serverErrorResponse('Failed to fetch chapter');
    }
}
