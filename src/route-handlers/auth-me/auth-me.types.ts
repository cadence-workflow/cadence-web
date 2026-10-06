import { type AuthStrategyConfigValue } from '@/config/auth/auth-strategy.types';

/** Response body of GET /api/auth/me. Same as AuthContext minus `groups`,
 * which stay on the server. */
export type AuthMeResponse = {
  authEnabled: boolean;
  authStrategy: AuthStrategyConfigValue;
  auth: { isValidToken: boolean; expiresAtMs?: number; canRefresh?: boolean };
  userName?: string;
  id?: string;
  pictureUrl?: string;
  isAdmin: boolean;
};
