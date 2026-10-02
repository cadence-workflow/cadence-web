import 'server-only';

import { type AuthServerRegistryEntry } from '@/utils/auth/auth.types';
import disabledServerPolicy from '@/utils/auth/strategies/disabled/disabled-server-policy';
import { JWT_AUTH_COOKIE_NAME } from '@/utils/auth/strategies/jwt/jwt-auth.constants';
import jwtServerPolicy from '@/utils/auth/strategies/jwt/jwt-server-policy';

import { type AuthStrategyConfigValue } from './auth-strategy.types';

/**
 * Every value in AUTH_STRATEGY_VALUES_CONFIG needs an entry here.
 * cookieNames is the allowlist for cookies the policy may set or clear.
 * New strategies should use a lazy loader so their policy loads only when selected:
 * `policy: () => import('...').then((m) => m.default)`.
 */
const AUTH_SERVER_STRATEGIES_CONFIG = {
  disabled: {
    policy: disabledServerPolicy,
    cookieNames: { exact: [], prefixes: [] },
  },
  jwt: {
    policy: jwtServerPolicy,
    cookieNames: { exact: [JWT_AUTH_COOKIE_NAME], prefixes: [] },
  },
  'trusted-header': {
    // Lazy loader so the policy module loads only when the strategy is
    // selected. No cookie declarations: this strategy writes no cookies
    // (the credential lives at the perimeter).
    policy: () =>
      import(
        '@/utils/auth/strategies/trusted-header/trusted-header-server-policy'
      ).then((module) => module.default),
    cookieNames: { exact: [], prefixes: [] },
  },
} satisfies Record<AuthStrategyConfigValue, AuthServerRegistryEntry>;

export default AUTH_SERVER_STRATEGIES_CONFIG;
