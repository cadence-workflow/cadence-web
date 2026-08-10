import AUTH_STRATEGY_VALUES_CONFIG from './auth-strategy-values.config';
import { type AuthStrategyConfigValue } from './auth-strategy.types';

export default function authStrategy(): AuthStrategyConfigValue {
  const envValue = process.env.CADENCE_WEB_AUTH_STRATEGY;

  if (
    AUTH_STRATEGY_VALUES_CONFIG.includes(envValue as AuthStrategyConfigValue)
  ) {
    return envValue as AuthStrategyConfigValue;
  }

  return 'disabled';
}
