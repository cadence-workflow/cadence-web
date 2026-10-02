/**
 * Cross-tab recovery lock name. A constant per-origin name: one cookie jar
 * per browser profile means one session, and a session-derived name would
 * leak the session identifier via navigator.locks.query().
 */
export const AUTH_RECOVERY_LOCK_NAME = 'cadence-auth-recover';

/**
 * Post-recovery invalidation fan-out: prefix-matched query keys, co-located
 * with the single entry point. 'auth-me' resyncs expiresAtMs and canRefresh;
 * 'dynamic_config' resyncs every authorization-derived answer. Key producers:
 * userInfoQueryOptions and getConfigValueQueryOptions.
 */
export const AUTH_RECOVERY_INVALIDATION_QUERY_KEYS = [
  ['auth-me'],
  ['dynamic_config'],
] as const;
