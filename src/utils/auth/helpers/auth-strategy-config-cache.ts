import { type AuthStrategyConfigValue } from '@/config/auth/auth-strategy.types';

/**
 * Per-tab, in-memory cache of the active auth strategy. Strategy changes
 * require a server restart (the config is evaluated at server start), so the
 * value is stable for the tab's lifetime.
 */
let cachedAuthStrategyConfig: AuthStrategyConfigValue | undefined;

export function setCachedAuthStrategyConfig(
  authStrategy: AuthStrategyConfigValue | undefined
) {
  cachedAuthStrategyConfig = authStrategy;
}

export function getCachedAuthStrategyConfig():
  | AuthStrategyConfigValue
  | undefined {
  return cachedAuthStrategyConfig;
}

let resolveInFlight: Promise<AuthStrategyConfigValue | undefined> | null = null;

/** Returns the cached strategy, fetching /api/auth/me when the cache is empty. */
export async function resolveCachedAuthStrategy(): Promise<
  AuthStrategyConfigValue | undefined
> {
  if (cachedAuthStrategyConfig) {
    return cachedAuthStrategyConfig;
  }

  // Concurrent first-time resolutions (a burst of 401s before any consumer
  // has seeded the cache) share one /api/auth/me read.
  if (!resolveInFlight) {
    resolveInFlight = fetchStrategy().finally(() => {
      resolveInFlight = null;
    });
  }
  return resolveInFlight;
}

async function fetchStrategy(): Promise<AuthStrategyConfigValue | undefined> {
  try {
    const response = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!response.ok) {
      return undefined;
    }
    const data = (await response.json()) as {
      authStrategy?: AuthStrategyConfigValue;
    };
    setCachedAuthStrategyConfig(data.authStrategy);
    return data.authStrategy;
  } catch {
    return undefined;
  }
}
