import 'server-only';

import { type AuthStrategyConfigValue } from '@/config/dynamic/resolvers/auth-strategy.types';
import getConfigValue from '@/utils/config/get-config-value';

import {
  type AuthServerRegistryEntry,
  type ResolvedAuthServerRegistryEntry,
} from '../auth.types';

import disabledServerPolicy from './disabled/disabled-server-policy';
import { CADENCE_AUTH_COOKIE_NAME } from './jwt/jwt-auth.constants';
import jwtServerPolicy from './jwt/jwt-server-policy';

/**
 * Exhaustive Record: adding a strategy value to the union without
 * wiring it here is a compile error. The ENTRY owns the cookie-name
 * declarations the mutation validator consumes.
 *
 * Future strategies widen the union and add their entries here; those use
 * lazy loaders so their policy modules load only when the strategy is
 * selected.
 */
const AUTH_SERVER_REGISTRY: Record<
  AuthStrategyConfigValue,
  AuthServerRegistryEntry
> = {
  disabled: {
    policy: disabledServerPolicy,
    cookieNames: { exact: [], prefixes: [] },
  },
  jwt: {
    policy: jwtServerPolicy,
    cookieNames: { exact: [CADENCE_AUTH_COOKIE_NAME], prefixes: [] },
  },
};

/**
 * Resolves the active strategy's registry entry.
 */
export async function getActiveAuthServerEntry(): Promise<ResolvedAuthServerRegistryEntry> {
  const strategy = await getConfigValue('CADENCE_WEB_AUTH_STRATEGY');
  const entry = AUTH_SERVER_REGISTRY[strategy];
  const policy =
    typeof entry.policy === 'function' ? await entry.policy() : entry.policy;
  return { policy, cookieNames: entry.cookieNames };
}
