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
import type { RouteParams } from '@/types/api';
import type { UpdateProjectInput, ProjectStatus } from '@/types/project';

// ─── Helpers ────────────────────────────────────────────────────────

const VALID_STATUSES: ProjectStatus[] = ['planning', 'drafting', 'editing', 'completed'];

/**
 * Fetch a project and verify the caller owns it.
 * Returns the project document or a NextResponse error.
 */
async function getOwnedProject(id: string, email: string) {
  const project = await Project.findById(id);

  if (!project) return notFoundResponse('Project');
  if (project.userEmail !== email) return forbiddenResponse();

  return project;
}

// ============================================
// GET: Fetch a single project by ID
// ============================================
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id } = await params;
    await connectDB();

    const result = await getOwnedProject(id, email);
    if (result instanceof NextResponse) return result;

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] GET /api/novels/[id] error:', error);
    return serverErrorResponse('Failed to fetch project');
  }
}

// ============================================
// PATCH: Update a project
// ============================================
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id } = await params;
    await connectDB();

    const result = await getOwnedProject(id, email);
    if (result instanceof NextResponse) return result;

    // Parse and validate request body
    let body: UpdateProjectInput;
    try {
      body = await req.json();
    } catch {
      return badRequestResponse('Invalid JSON body');
    }

    // Build update object (whitelist approach — only allowed fields)
    const allowedUpdates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = sanitizeString(body.title);
      if (!isValidLength(title, 1, 200)) {
        return badRequestResponse('Title must be between 1 and 200 characters');
      }
      allowedUpdates.title = title;
    }

    if (body.description !== undefined) {
      const description = sanitizeString(body.description);
      if (!isValidLength(description, 0, 2000)) {
        return badRequestResponse('Description cannot exceed 2000 characters');
      }
      allowedUpdates.description = description;
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return badRequestResponse(
          `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
        );
      }
      allowedUpdates.status = body.status;
    }

    if (body.stats !== undefined) {
      // Use dot notation for partial stats updates (prevents overwriting the other field)
      if (body.stats.currentWordCount !== undefined) {
        const wc = Number(body.stats.currentWordCount);
        if (isNaN(wc) || wc < 0) {
          return badRequestResponse('currentWordCount must be a non-negative number');
        }
        allowedUpdates['stats.currentWordCount'] = wc;
      }
      if (body.stats.goalWordCount !== undefined) {
        const gw = Number(body.stats.goalWordCount);
        if (isNaN(gw) || gw < 0) {
          return badRequestResponse('goalWordCount must be a non-negative number');
        }
        allowedUpdates['stats.goalWordCount'] = gw;
      }
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return badRequestResponse('No valid fields provided for update');
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('[API] PATCH /api/novels/[id] error:', error);
    return serverErrorResponse('Failed to update project');
  }
}

// ============================================
// DELETE: Delete a project and cascade-delete chapters
// ============================================
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id } = await params;
    await connectDB();

    const result = await getOwnedProject(id, email);
    if (result instanceof NextResponse) return result;

    // Cascade delete: remove all chapters first
    const deleteResult = await Chapter.deleteMany({ projectId: id });
    console.log(`[API] Deleted ${deleteResult.deletedCount} chapters for project ${id}`);

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Project and all chapters deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] DELETE /api/novels/[id] error:', error);
    return serverErrorResponse('Failed to delete project');
  }
}
