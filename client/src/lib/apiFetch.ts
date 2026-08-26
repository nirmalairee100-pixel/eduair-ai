/**
 * Thin wrapper around fetch() for authenticated dashboard API calls.
 *
 * Why this exists: without it, a page whose session token expires mid-use
 * just gets a raw "Not signed in" JSON error and sits there broken. This
 * wrapper catches 401s from any /api/* route and redirects to /login with
 * a `?expired=1` flag so the login page can show a friendly "your session
 * expired, please sign in again" message instead of silently bouncing.
 *
 * Usage (drop-in replacement for fetch in client components):
 *   import { apiFetch } from "@/lib/apiFetch";
 *   const res = await apiFetch("/api/quiz-generate", { method: "POST", ... });
 *
 * If apiFetch triggers a redirect, the promise never resolves (the browser
 * navigates away), so calling code doesn't need extra handling for that case.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401 && typeof window !== "undefined") {
    const current = window.location.pathname + window.location.search;
    window.location.href = `/login?expired=1&next=${encodeURIComponent(current)}`;
    // Return a never-resolving promise so callers don't try to .json() a
    // response body while the browser is navigating away.
    return new Promise<Response>(() => {});
  }

  return res;
}
