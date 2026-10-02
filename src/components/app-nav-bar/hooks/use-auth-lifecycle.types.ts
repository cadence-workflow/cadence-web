import {
  type AuthLogoutNotice,
  type AuthRecoveryResult,
} from '@/utils/auth/auth.types';

export type AuthLifecycle = {
  isAuthEnabled: boolean;
  isValidToken: boolean;
  isAuthLoading: boolean;
  isAdmin: boolean;
  userName?: string;
  expiresAtMs?: number;
  /** policy.supportsSessionRecovery && auth.canRefresh === true — the only
   * recovery capability UI code may read. */
  canRecover: boolean;
  /** Clears the session and navigates to the logged-out surface. */
  logout: (options?: { notice?: AuthLogoutNotice }) => Promise<void>;
  /** Enters the single recovery entry point; resolves 'recovered', undefined
   * (declined/failed), or never settles once a redirect begins. */
  recoverSession: (
    returnTo?: string
  ) => Promise<AuthRecoveryResult | undefined>;
};
