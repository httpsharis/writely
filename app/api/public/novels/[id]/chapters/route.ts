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
// GET  /api/public/novels/[id]/chapters
// ============================================
// Public endpoint — no auth required.
// Only returns chapters with status: 'published'
// from a novel with isPublished: true.
// Returns lightweight data (no content).

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id: novelId } = await params;
    await connectDB();

    // Verify novel exists and is published
    const project = await Project.findById(novelId)
      .select('isPublished')
      .lean();

    if (!project) return notFoundResponse('Novel');
    if (!project.isPublished) return notFoundResponse('Novel');

    // Fetch only published chapters, sorted by order
    const chapters = await Chapter.find({
      projectId: novelId,
      status: 'published',
    })
      .select('title order wordCount status createdAt updatedAt')
      .sort({ order: 1 })
      .lean();

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('[API] GET /api/public/novels/[id]/chapters error:', error);
    return serverErrorResponse('Failed to fetch chapters');
  }
}
