import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Chapter from '@/models/Chapter';
import { decryptContent, isEncrypted } from '@/lib/encryption';
import {
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-helpers';
import type { NestedRouteParams } from '@/types/api';

// ============================================
// GET  /api/public/novels/[id]/chapters/[chapterId]
// ============================================
// Public endpoint — no auth required.
// Returns the full content of a published chapter
// from a published novel, decrypted for reading.
// Strips writer comments (private to author).

export async function GET(_req: Request, { params }: NestedRouteParams) {
  try {
    const { id: novelId, chapterId } = await params;
    await connectDB();

    // Verify novel exists and is published
    const project = await Project.findById(novelId)
      .select('isPublished title userEmail')
      .lean();

    if (!project) return notFoundResponse('Novel');
    if (!project.isPublished) return notFoundResponse('Novel');

    // Fetch the chapter
    const chapter = await Chapter.findById(chapterId).lean();

    if (!chapter) return notFoundResponse('Chapter');
    if (chapter.projectId.toString() !== novelId) return notFoundResponse('Chapter');
    if (chapter.status !== 'published') return notFoundResponse('Chapter');

    // Decrypt content
    let content = chapter.content;
    if (content && isEncrypted(content)) {
      content = decryptContent(content as string) as typeof content;
    }

    // Fetch prev/next published chapter for navigation
    const publishedChapters = await Chapter.find({
      projectId: novelId,
      status: 'published',
    })
      .select('_id order title')
      .sort({ order: 1 })
      .lean();

    const currentIdx = publishedChapters.findIndex(
      (c) => c._id.toString() === chapterId,
    );

    const prevChapter = currentIdx > 0 ? publishedChapters[currentIdx - 1] : null;
    const nextChapter =
      currentIdx < publishedChapters.length - 1
        ? publishedChapters[currentIdx + 1]
        : null;

    return NextResponse.json({
      _id: chapter._id,
      title: chapter.title,
      content,
      contentType: chapter.contentType,
      order: chapter.order,
      wordCount: chapter.wordCount,
      novelTitle: project.title,
      authorName: project.userEmail?.split('@')[0] ?? 'Anonymous',
      prevChapter: prevChapter
        ? { _id: prevChapter._id, title: prevChapter.title }
        : null,
      nextChapter: nextChapter
        ? { _id: nextChapter._id, title: nextChapter.title }
        : null,
      totalChapters: publishedChapters.length,
      chapterNumber: currentIdx + 1,
    });
  } catch (error) {
    console.error('[API] GET /api/public/novels/[id]/chapters/[chapterId] error:', error);
    return serverErrorResponse('Failed to fetch chapter');
  }
}
