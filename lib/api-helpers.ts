import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { ApiErrorResponse } from '@/types/api';

// ─── Error Responses ────────────────────────────────────────────────

export function unauthorizedResponse(): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        { error: 'Unauthorized — please log in' },
        { status: 401 }
    );
}

export function forbiddenResponse(): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        { error: 'Forbidden — you do not own this resource' },
        { status: 403 }
    );
}

export function notFoundResponse(resource = 'Resource'): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        { error: `${resource} not found` },
        { status: 404 }
    );
}

export function badRequestResponse(message: string): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        { error: message },
        { status: 400 }
    );
}

export function serverErrorResponse(message = 'Internal server error'): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        { error: message },
        { status: 500 }
    );
}

// ─── Auth Helper ────────────────────────────────────────────────────

/**
 * Get the authenticated user's email from the session.
 * Returns null if unauthenticated.
 */
export async function getAuthenticatedEmail(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    return session?.user?.email ?? null;
}

// ─── Input Sanitization ─────────────────────────────────────────────

/**
 * Strip HTML tags from a string to prevent stored XSS.
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/<[^>]*>/g, '')  // remove HTML tags
        .trim();
}

/**
 * Validate that a string is within acceptable length bounds.
 */
export function isValidLength(input: string, min: number, max: number): boolean {
    return input.length >= min && input.length <= max;
}

// ─── No-Cache Response ──────────────────────────────────────────────

/**
 * Headers that tell the browser:
 *   - no-store:        don't save this response anywhere (disk or memory)
 *   - no-cache:        always revalidate with the server
 *   - must-revalidate: if the cached copy expires, don't use it
 *   - private:         only the user's browser may cache (not CDNs/proxies)
 *   - Pragma: no-cache: HTTP/1.0 fallback for older clients
 *
 * This prevents chapter content from sitting in browser cache files
 * where someone with disk access could read the user's writing.
 */
const NO_CACHE_HEADERS = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
};

/**
 * Return a JSON response with no-cache headers.
 * Use this for any endpoint that returns sensitive content.
 */
export function noCacheJson<T>(data: T, status = 200): NextResponse<T> {
    return NextResponse.json(data, {
        status,
        headers: NO_CACHE_HEADERS,
    });
}
