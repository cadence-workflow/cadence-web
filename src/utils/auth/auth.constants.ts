// --- Cookie writing ---

/** The one shared attribute set: strategies supply only name/value/maxAge, so
 * no strategy (or fork strategy) can downgrade a session cookie. */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
} as const;

/**
 * Deliverable total budget for one auth cookie write set:
 * name + value + attributes across all mutations, measured at write time by
 * validateAndReplayAuthCookieMutations. ~4KB total stays comfortably under
 * Node's 16KB maxHeaderSize and common per-header proxy limits.
 */
export const OIDC_SESSION_COOKIE_MAX_BYTES = 4000;
