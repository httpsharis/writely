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

export type RouteParams = {
  params: Promise<{ id: string }>;
};
