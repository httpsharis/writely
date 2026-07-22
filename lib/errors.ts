/** Shape RTK Query error objects come in from the backend. */
interface ApiErrorShape {
  data?: { error?: string; message?: string };
}

/**
 * Pulls a human-readable message out of an RTK Query error, falling back
 * to `fallback` if the shape doesn't match (network error, parse failure, etc).
 *
 * Usage: `getErrorMessage(emailError, "Login failed. Please try again.")`
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  const shaped = error as ApiErrorShape | undefined;
  return shaped?.data?.error ?? shaped?.data?.message ?? fallback;
}
