import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthClientPolicy } from '@/utils/auth/auth.types';

/**
 * Client policy for trusted-header. There is no login form and no session to
 * clear; when identity is gone, send the browser to the unavailable status page.
 */
const trustedHeaderClientPolicy: AuthClientPolicy = {
  supportsSessionRecovery: false,
  unauthenticatedRemedy: 'unavailable',
  login() {
    window.location.assign(AUTH_UNAVAILABLE_PATH);
  },
  logout: () => Promise.resolve(),
  onUnauthorized: () => false,
};

export default trustedHeaderClientPolicy;
