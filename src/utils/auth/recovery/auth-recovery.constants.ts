// Fixed name: a browser profile has one session, and a name derived from the
// session would expose it through navigator.locks.query().
export const AUTH_RECOVERY_LOCK_NAME = 'cadence-auth-recover';

// Queries to refetch after a session recovery: auth-me picks up the new expiry,
// dynamic_config picks up permission-dependent values.
export const AUTH_RECOVERY_INVALIDATION_QUERY_KEYS = [
  ['auth-me'],
  ['dynamic_config'],
] as const;
