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

/** For routes like /api/novels/[id] */
export type RouteParams = {
    params: Promise<{ id: string }>;
};

/** For routes like /api/novels/[id]/chapters/[chapterId] */
export type NestedRouteParams = {
    params: Promise<{ id: string; chapterId: string }>;
};
