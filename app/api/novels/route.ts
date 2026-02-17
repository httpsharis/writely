/**
 * /api/novels — List all novels (GET) and create a new novel (POST).
 */

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

// GET — List all novels for the logged-in user (most recent first)
export async function GET() {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();
        const projects = await Project.find({ userEmail: email }).sort({ updatedAt: -1 }).lean();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('[API] GET /api/novels error:', error);
        return serverErrorResponse('Failed to fetch projects');
    }
}

// POST — Create a new novel with optional title and description
export async function POST(req: Request) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();

        let input: CreateProjectInput = {};
        try { input = await req.json(); } catch { /* Defaults used */ }

        const title = input.title ? sanitizeString(input.title) : 'Untitled Novel';
        if (!isValidLength(title, 1, 200)) {
            return badRequestResponse('Title must be between 1 and 200 characters');
        }

        const description = input.description ? sanitizeString(input.description) : '';
        if (description && !isValidLength(description, 0, 2000)) {
            return badRequestResponse('Description cannot exceed 2000 characters');
        }

        const newProject = await Project.create({ userEmail: email, title, description });
        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/novels error:', error);
        return serverErrorResponse('Failed to create project');
    }
}