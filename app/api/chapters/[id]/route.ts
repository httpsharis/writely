import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Chapter from '@/models/Chapter';
import mongoose from 'mongoose';
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
import type { UpdateChapterInput } from '@/types/chapter';

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Verify ownership chain: Chapter → Project → User.
 * Returns the chapter document + projectId, or a NextResponse error.
 */
async function verifyChapterOwnership(chapterId: string, userEmail: string) {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return { error: notFoundResponse('Chapter') };

  const project = await Project.findById(chapter.projectId).lean();
  if (!project) return { error: notFoundResponse('Parent project') };
  if (project.userEmail !== userEmail) return { error: forbiddenResponse() };

  return { chapter, projectId: chapter.projectId };
}

/**
 * Recalculate and update the project's total word count.
 */
async function updateProjectWordCount(projectId: mongoose.Types.ObjectId) {
  const result = await Chapter.aggregate([
    { $match: { projectId } },
    { $group: { _id: null, total: { $sum: '$wordCount' } } },
  ]);

  const totalWords = result.length > 0 ? result[0].total : 0;

  await Project.findByIdAndUpdate(projectId, {
    $set: { 'stats.currentWordCount': totalWords },
  });

  return totalWords;
}

// ============================================
// GET: Fetch a single chapter
// ============================================
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id } = await params;
    await connectDB();

    const result = await verifyChapterOwnership(id, email);
    if ('error' in result) return result.error;

    return NextResponse.json(result.chapter);
  } catch (error) {
    console.error('[API] GET /api/chapters/[id] error:', error);
    return serverErrorResponse('Failed to fetch chapter');
  }
}

// ============================================
// PATCH: Update a chapter (title, content, order)
// ============================================
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id } = await params;
    await connectDB();

    const result = await verifyChapterOwnership(id, email);
    if ('error' in result) return result.error;

    let body: UpdateChapterInput;
    try {
      body = await req.json();
    } catch {
      return badRequestResponse('Invalid JSON body');
    }

    const { chapter } = result;

    // Validate & apply allowed fields
    if (body.title !== undefined) {
      const title = sanitizeString(body.title);
      if (!isValidLength(title, 1, 200)) {
        return badRequestResponse('Title must be between 1 and 200 characters');
      }
      chapter.title = title;
    }

    if (body.content !== undefined) {
      chapter.content = body.content;
    }

    if (body.order !== undefined) {
      const order = Number(body.order);
      if (isNaN(order) || order < 0) {
        return badRequestResponse('Order must be a non-negative number');
      }
      chapter.order = order;
    }

    // Save — triggers pre-save hook for word count recalculation
    await chapter.save();

    // Update project's aggregated word count
    await updateProjectWordCount(result.projectId);

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[API] PATCH /api/chapters/[id] error:', error);
    return serverErrorResponse('Failed to update chapter');
  }
}

// ============================================
// DELETE: Delete a chapter
// ============================================
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id } = await params;
    await connectDB();

    const result = await verifyChapterOwnership(id, email);
    if ('error' in result) return result.error;

    const { projectId } = result;

    await Chapter.findByIdAndDelete(id);

    // Update project's aggregated word count
    await updateProjectWordCount(projectId);

    return NextResponse.json(
      { message: 'Chapter deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] DELETE /api/chapters/[id] error:', error);
    return serverErrorResponse('Failed to delete chapter');
  }
}
