import { type AuthClientPolicy } from '@/utils/auth/auth.types';
import disabledClientPolicy from '@/utils/auth/strategies/disabled/disabled-client-policy';
import jwtClientPolicy from '@/utils/auth/strategies/jwt/jwt-client-policy';
import trustedHeaderClientPolicy from '@/utils/auth/strategies/trusted-header/trusted-header-client-policy';

import { type AuthStrategyConfigValue } from './auth-strategy.types';

/**
 * Every value in AUTH_STRATEGY_VALUES_CONFIG needs an entry here.
 * Strategy-conditional UI reads fields off the active policy, never the strategy name.
 */
const AUTH_CLIENT_STRATEGIES_CONFIG = {
  disabled: disabledClientPolicy,
  jwt: jwtClientPolicy,
  'trusted-header': trustedHeaderClientPolicy,
} satisfies Record<AuthStrategyConfigValue, AuthClientPolicy>;

export default AUTH_CLIENT_STRATEGIES_CONFIG;
