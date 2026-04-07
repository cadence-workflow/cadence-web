import type AUTH_STRATEGY_VALUES_CONFIG from './auth-strategy-values.config';

export type AuthStrategyConfigValue =
  (typeof AUTH_STRATEGY_VALUES_CONFIG)[number];
