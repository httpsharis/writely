// lib/get-error-message.ts
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getErrorMessage(error: unknown): string {
  if (!error) return "";

  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    // Server-side error with a response body (FetchBaseQueryError)
    if ("status" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (typeof fetchError.data === "object" && fetchError.data !== null) {
        const data = fetchError.data as Record<string, unknown>;
        if (typeof data.message === "string") return data.message;
        if (typeof data.error === "string") return data.error;
      }
      return typeof fetchError.status === "number" || typeof fetchError.status === "string"
        ? `Request failed with status ${fetchError.status}`
        : "Server request failed.";
    }

    // Network or client-side error (SerializedError)
    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      return (error as { message: string }).message;
    }
  }

  return "An unexpected error occurred.";
}
