import AUTH_CLIENT_STRATEGIES_CONFIG from '@/config/auth/auth-client-strategies.config';
import { type AuthStrategyConfigValue } from '@/config/auth/auth-strategy.types';

import { type AuthClientPolicy } from '../auth.types';

export default function getAuthClientPolicy(
  strategy: AuthStrategyConfigValue | undefined
): AuthClientPolicy | undefined {
  return strategy ? AUTH_CLIENT_STRATEGIES_CONFIG[strategy] : undefined;
}
