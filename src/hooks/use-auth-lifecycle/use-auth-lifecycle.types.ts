import { type AuthLogoutNotice } from '@/utils/auth/auth.types';

export type AuthLifecycle = {
  isAuthEnabled: boolean;
  isValidToken: boolean;
  isAuthLoading: boolean;
  isAdmin: boolean;
  userName?: string;
  /** Clears the session and navigates to the logged-out surface. */
  logout: (options?: { notice?: AuthLogoutNotice }) => Promise<void>;
  /** Goes to the login surface with a session-expired notice. Leaves the cookie alone. */
  expireSession: () => void;
};
