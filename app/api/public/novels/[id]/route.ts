import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Chapter from '@/models/Chapter';
import {
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-helpers';
import type { RouteParams } from '@/types/api';

// ============================================
// GET  /api/public/novels/[id]
// ============================================
// Public endpoint — no auth required.
// Only returns novels with isPublished: true.
// Returns a safe subset: no characters' internal data,
// only the author name and novel metadata.

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await connectDB();

    const project = await Project.findById(id)
      .select('title description isPublished status stats userEmail characters authorNotes createdAt updatedAt')
      .lean();

    if (!project) return notFoundResponse('Novel');
    if (!project.isPublished) return notFoundResponse('Novel');

    // Count published chapters
    const publishedCount = await Chapter.countDocuments({
      projectId: id,
      status: 'published',
    });

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
