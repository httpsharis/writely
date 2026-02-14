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
