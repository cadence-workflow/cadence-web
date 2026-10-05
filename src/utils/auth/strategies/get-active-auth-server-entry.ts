import 'server-only';

import AUTH_SERVER_STRATEGIES_CONFIG from '@/config/auth/auth-server-strategies.config';
import getConfigValue from '@/utils/config/get-config-value';

import {
  type AuthServerRegistryEntry,
  type ResolvedAuthServerRegistryEntry,
} from '../auth.types';

/**
 * Resolves the active strategy's registry entry.
 */
export default async function getActiveAuthServerEntry(): Promise<ResolvedAuthServerRegistryEntry> {
  const strategy = await getConfigValue('CADENCE_WEB_AUTH_STRATEGY');
  const entry: AuthServerRegistryEntry =
    AUTH_SERVER_STRATEGIES_CONFIG[strategy];
  const policy =
    typeof entry.policy === 'function' ? await entry.policy() : entry.policy;
  return { policy, cookieNames: entry.cookieNames };
}
