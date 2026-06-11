// lib/get-error-message.ts
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export function getErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!error) return "";

  // Server‑side error with a response body
  if ("status" in error) {
    const fetchError = error as FetchBaseQueryError;
    if (typeof fetchError.data === "object" && fetchError.data !== null) {
      const data = fetchError.data as Record<string, unknown>;
      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
    }
    return `Request failed with status ${fetchError.status}`;
  }

  // Network or client‑side error
  return (error as SerializedError).message ?? "An unexpected error occurred.";
}
