import { type AuthLogoutNotice } from '@/utils/auth/auth.types';

export type AuthLifecycle = {
  isAuthEnabled: boolean;
  isValidToken: boolean;
  isAuthLoading: boolean;
  isAdmin: boolean;
  userName?: string;
  expiresAtMs?: number;
  /** Labels from the client policy — undefined for strategies that render no
   * auth menu items. */
  labels?: { login: string; logout: string };
  /** Nav sign-in action. */
  login: (returnTo?: string) => void;
  /** Clears the session and navigates to the logged-out surface. */
  logout: (options?: { notice?: AuthLogoutNotice }) => Promise<void>;
};
