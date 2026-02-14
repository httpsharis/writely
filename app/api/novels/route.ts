import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import {
  getAuthenticatedEmail,
  unauthorizedResponse,
  serverErrorResponse,
  badRequestResponse,
  sanitizeString,
  isValidLength,
} from '@/lib/api-helpers';
import type { CreateProjectInput } from '@/types/project';

// ============================================
// GET: Fetch all novels for the logged-in user
// ============================================
export async function GET() {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    await connectDB();

    const projects = await Project.find({ userEmail: email })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API] GET /api/novels error:', error);
    return serverErrorResponse('Failed to fetch projects');
  }
}

// ============================================
// POST: Create a new novel
// ============================================
export async function POST(req: Request) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    await connectDB();

    // Parse optional body
    let input: CreateProjectInput = {};
    try {
      input = await req.json();
    } catch {
      // No body sent — use defaults
    }

    // Sanitize & validate title
    const title = input.title
      ? sanitizeString(input.title)
      : 'Untitled Novel';

    if (!isValidLength(title, 1, 200)) {
      return badRequestResponse('Title must be between 1 and 200 characters');
    }

    // Sanitize & validate description
    const description = input.description
      ? sanitizeString(input.description)
      : '';

    if (description && !isValidLength(description, 0, 2000)) {
      return badRequestResponse('Description cannot exceed 2000 characters');
    }

    const newProject = await Project.create({
      userEmail: email,
      title,
      description,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/novels error:', error);
    return serverErrorResponse('Failed to create project');
  }
}