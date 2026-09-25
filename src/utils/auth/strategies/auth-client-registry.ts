import { type AuthStrategyConfigValue } from '@/config/dynamic/resolvers/auth-strategy.types';

import { type AuthClientPolicy } from '../auth.types';

import disabledClientPolicy from './disabled/disabled-client-policy';
import jwtClientPolicy from './jwt/jwt-client-policy';

/**
 * Exhaustive Record — the client half. All strategy-conditional UI
 * reads policy fields off the active entry, never strategy-string comparisons.
 */
const AUTH_CLIENT_REGISTRY: Record<AuthStrategyConfigValue, AuthClientPolicy> =
  {
    disabled: disabledClientPolicy,
    jwt: jwtClientPolicy,
  };

export default function getAuthClientPolicy(
  strategy: AuthStrategyConfigValue | undefined
): AuthClientPolicy | undefined {
  return strategy ? AUTH_CLIENT_REGISTRY[strategy] : undefined;
}
