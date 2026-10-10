import { type AuthStrategyConfigValue } from '@/config/auth/auth-strategy.types';

export type AuthMeResponse = {
  authEnabled: boolean;
  authStrategy: AuthStrategyConfigValue;
  auth: { isValidToken: boolean; expiresAtMs?: number; canRefresh?: boolean };
  userName?: string;
  id?: string;
  email?: string;
  pictureUrl?: string;
  isAdmin: boolean;
};
