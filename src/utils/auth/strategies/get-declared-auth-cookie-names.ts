import 'server-only';

import AUTH_SERVER_STRATEGIES_CONFIG from '@/config/auth/auth-server-strategies.config';

import { type AuthServerRegistryEntry } from '../auth.types';

/**
 * Cookie names any strategy has declared. Clears may use this set so a
 * leftover cookie can still be expired after the active strategy changes;
 * sets stay scoped to the active strategy's own declarations.
 */
export default function getDeclaredAuthCookieNames(): AuthServerRegistryEntry['cookieNames'] {
  const exact = new Set<string>();
  const prefixes = new Set<string>();
  for (const { cookieNames } of Object.values(AUTH_SERVER_STRATEGIES_CONFIG)) {
    for (const name of cookieNames.exact) {
      exact.add(name);
    }
    for (const prefix of cookieNames.prefixes) {
      prefixes.add(prefix);
    }
  }
  return { exact: Array.from(exact), prefixes: Array.from(prefixes) };
}
