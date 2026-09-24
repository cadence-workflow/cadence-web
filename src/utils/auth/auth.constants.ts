/** shared attribute set for all auth cookies */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
} as const;

/**
 * Deliverable total budget for one auth cookie write set:
 * name + value + attributes across all mutations, measured at write time by
 * validateAndReplayAuthCookieMutations. ~4KB total stays comfortably under
 * Node's 16KB maxHeaderSize and common per-header proxy limits. Shared by all
 * strategies; sized for the largest write set (the OIDC session) — smaller
 * write sets never approach it.
 */
export const AUTH_COOKIE_MUTATIONS_MAX_BYTES = 4000;
