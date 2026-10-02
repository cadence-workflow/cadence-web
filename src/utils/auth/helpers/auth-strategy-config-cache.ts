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

/** Returns the cached strategy, fetching /api/auth/me when the cache is empty. */
export async function resolveCachedAuthStrategy(): Promise<
  AuthStrategyConfigValue | undefined
> {
  if (cachedAuthStrategyConfig) {
    return cachedAuthStrategyConfig;
  }

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
