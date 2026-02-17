// ─── Generic API Response Types ─────────────────────────────────────

export interface ApiErrorResponse {
    error: string;
}

export interface ApiSuccessResponse<T = unknown> {
    data: T;
    message?: string;
}

export interface ApiDeleteResponse {
    message: string;
}

// ─── Route Params ───────────────────────────────────────────────────

/** For routes like /api/novels/[id] or /api/public/novels/[id] */
export type RouteParams = {
    params: Promise<{ id: string }>;
};
