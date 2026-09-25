/** shared attribute set for all auth cookies */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
} as const;

/**
 * ~4KB Max bytes for all auth cookie mutations. Shared by all auth strategies
 * but sized for the largest known strategy (the OIDC session).
 */
export const AUTH_COOKIE_MUTATIONS_MAX_BYTES = 4000;
