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

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Verify the authenticated user owns the given project.
 * Returns the project or a NextResponse error.
 */
async function verifyProjectOwnership(projectId: string, userEmail: string) {
  const project = await Project.findById(projectId).lean();

  if (!project) return notFoundResponse('Project');
  if (project.userEmail !== userEmail) return forbiddenResponse();

  return project;
}

// ============================================
// GET: Fetch all chapters for a project
// ============================================
export async function GET(req: Request) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    // Get projectId from query params
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return badRequestResponse('projectId query parameter is required');
    }

    await connectDB();

    // Verify ownership
    const result = await verifyProjectOwnership(projectId, email);
    if (result instanceof NextResponse) return result;

    const chapters = await Chapter.find({ projectId })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('[API] GET /api/chapters error:', error);
    return serverErrorResponse('Failed to fetch chapters');
  }
}

// ============================================
// POST: Create a new chapter
// ============================================
export async function POST(req: Request) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    let body: { projectId?: string; title?: string };
    try {
      body = await req.json();
    } catch {
      return badRequestResponse('Invalid JSON body');
    }

    const { projectId, title } = body;

    if (!projectId) {
      return badRequestResponse('projectId is required');
    }

    await connectDB();

    // Verify ownership
    const result = await verifyProjectOwnership(projectId, email);
    if (result instanceof NextResponse) return result;

    // Sanitize & validate title
    const chapterTitle = title ? sanitizeString(title) : '';

    if (chapterTitle && !isValidLength(chapterTitle, 1, 200)) {
      return badRequestResponse('Title must be between 1 and 200 characters');
    }

    // Determine next order number
    const lastChapter = await Chapter.findOne({ projectId })
      .sort({ order: -1 })
      .select('order');
    const nextOrder = lastChapter ? lastChapter.order + 1 : 1;

    const newChapter = await Chapter.create({
      projectId,
      title: chapterTitle || `Chapter ${nextOrder}`,
      order: nextOrder,
    });

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/chapters error:', error);
    return serverErrorResponse('Failed to create chapter');
  }
}
