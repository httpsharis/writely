/**
 * api-helpers.ts — Shared utilities used across all API routes.
 *
 * Contains:
 *  1. HTTP error response builders (401, 403, 404, 400, 500)
 *  2. Auth helper — reads session email
 *  3. Input sanitization — strips HTML, checks length
 *  4. No-cache response — prevents browser from caching sensitive data
 *  5. Ownership check — verifies a user owns a project
 *  6. Published check — verifies a novel is public
 *  7. ServiceError → HTTP mapper — converts service errors to responses
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Project from '@/models/Project';
import connectDB from '@/lib/db';
import { ServiceError } from '@/lib/error';
import type { ApiErrorResponse } from '@/types/api';

// ─── Error Responses ────────────────────────────────────────────────
// Each returns a typed JSON response with the correct HTTP status.

export function unauthorizedResponse(): NextResponse<ApiErrorResponse> {
    return NextResponse.json({ error: 'Unauthorized — please log in' }, { status: 401 });
}

export function forbiddenResponse(): NextResponse<ApiErrorResponse> {
    return NextResponse.json({ error: 'Forbidden — you do not own this resource' }, { status: 403 });
}

export function notFoundResponse(resource = 'Resource'): NextResponse<ApiErrorResponse> {
    return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

export function badRequestResponse(message: string): NextResponse<ApiErrorResponse> {
    return NextResponse.json({ error: message }, { status: 400 });
}

export function serverErrorResponse(message = 'Internal server error'): NextResponse<ApiErrorResponse> {
    return NextResponse.json({ error: message }, { status: 500 });
}

// ─── Auth ───────────────────────────────────────────────────────────

/** Returns the logged-in user's email, or null if not authenticated. */
export async function getAuthenticatedEmail(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    return session?.user?.email ?? null;
}

// ─── Input Sanitization ─────────────────────────────────────────────

/** Strips HTML tags from a string to prevent XSS attacks. */
export function sanitizeString(input: string): string {
    return input.replace(/<[^>]*>/g, '').trim();
}

/** Checks if a string length is within [min, max]. */
export function isValidLength(input: string, min: number, max: number): boolean {
    return input.length >= min && input.length <= max;
}

// ─── No-Cache Response ──────────────────────────────────────────────

const NO_CACHE_HEADERS = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
};

/** Returns JSON with headers that prevent any browser caching. */
export function noCacheJson<T>(data: T, status = 200): NextResponse<T> {
    return NextResponse.json(data, { status, headers: NO_CACHE_HEADERS });
}

// ─── Ownership Check ────────────────────────────────────────────────

/**
 * Verifies a project exists and belongs to the given user.
 *
 * Steps:
 *  1. Connect to DB
 *  2. Find project by ID (optionally limit fields with `select`)
 *  3. Return 404 if not found, 403 if not owned
 *  4. Return the project document if everything is OK
 *
 * @param projectId - Mongo _id of the project
 * @param email     - Authenticated user's email
 * @param select    - Optional field filter (e.g. 'userEmail title')
 * @returns The project document OR a NextResponse error
 */
export async function getOwnedProject(projectId: string, email: string, select?: string) {
    await connectDB();

    const query = Project.findById(projectId);

    // Always include userEmail — we need it for the ownership check
    if (select) {
        const fields = select.includes('userEmail') ? select : `${select} userEmail`;
        query.select(fields);
    }

    const project = await query.lean();
    if (!project) return notFoundResponse('Novel');
    if (project.userEmail !== email) return forbiddenResponse();

    return project;
}

// ─── Published Check ────────────────────────────────────────────────

/**
 * Verifies a novel exists AND is published (for public reader endpoints).
 * Returns 404 for both "missing" and "unpublished" to avoid leaking IDs.
 *
 * @param projectId - Mongo _id of the project
 * @param select    - Optional field filter (always includes isPublished)
 */
export async function getPublishedProject(projectId: string, select = 'isPublished') {
    await connectDB();

    const fields = select.includes('isPublished') ? select : `${select} isPublished`;
    const project = await Project.findById(projectId).select(fields).lean();

    if (!project || !project.isPublished) return notFoundResponse('Novel');
    return project;
}

// ─── Service Error → HTTP Response ──────────────────────────────────

/**
 * Maps a ServiceError to the correct HTTP error response.
 * Used in every route's catch block to keep error handling consistent.
 *
 * If the error is NOT a ServiceError, it logs and returns a generic 500.
 */
export function handleServiceError(error: unknown) {
    if (error instanceof ServiceError) {
        switch (error.type) {
            case 'NOT_FOUND':    return notFoundResponse(error.message);
            case 'FORBIDDEN':    return forbiddenResponse();
            case 'BAD_REQUEST':  return badRequestResponse(error.message);
            case 'UNAUTHORIZED': return unauthorizedResponse();
        }
    }
    console.error('[API] Unexpected error:', error);
    return serverErrorResponse();
}
