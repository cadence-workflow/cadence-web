import { type AuthLogoutNotice } from '@/utils/auth/auth.types';

export type AuthLifecycle = {
  isAuthEnabled: boolean;
  isValidToken: boolean;
  isAuthLoading: boolean;
  isAdmin: boolean;
  userName?: string;
  expiresAtMs?: number;
  /** Clears the session and navigates to the logged-out surface. */
  logout: (options?: { notice?: AuthLogoutNotice }) => Promise<void>;
};
