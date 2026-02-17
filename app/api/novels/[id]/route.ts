/**
 * /api/novels/[id] — Single novel CRUD.
 * Routes only handle: auth, ownership check, JSON parsing, response.
 * All business logic lives in ProjectService.
 */

import { NextResponse } from 'next/server';
import {
    getAuthenticatedEmail,
    getOwnedProject,
    unauthorizedResponse,
    serverErrorResponse,
    badRequestResponse,
    handleServiceError,
} from '@/lib/api-helpers';
import * as ProjectService from '@/services/projectService';
import type { RouteParams } from '@/types/api';
import type { UpdateProjectInput } from '@/types/project';

// GET — Fetch a single novel by ID
export async function GET(_req: Request, { params }: RouteParams) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;
        const result = await getOwnedProject(id, email);
        if (result instanceof NextResponse) return result;

        return NextResponse.json(result);
    } catch (error) {
        console.error('[API] GET /api/novels/[id] error:', error);
        return serverErrorResponse('Failed to fetch project');
    }
}

// PATCH — Update novel fields, characters, or author notes
export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;
        const result = await getOwnedProject(id, email, 'userEmail');
        if (result instanceof NextResponse) return result;

        let body: UpdateProjectInput;
        try { body = await req.json(); } catch { return badRequestResponse('Invalid JSON body'); }

        const updated = await ProjectService.updateProject(id, body);
        return NextResponse.json(updated);
    } catch (error) {
        return handleServiceError(error);
    }
}

// DELETE — Delete a novel and all its chapters
export async function DELETE(_req: Request, { params }: RouteParams) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        const { id } = await params;
        const result = await getOwnedProject(id, email, 'userEmail');
        if (result instanceof NextResponse) return result;

        const response = await ProjectService.deleteProject(id);
        return NextResponse.json(response);
    } catch (error) {
        return handleServiceError(error);
    }
}
