import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthClientPolicy } from '@/utils/auth/auth.types';

/**
 * Browser half of trusted-header. Credentials come from the perimeter, so
 * when identity disappears the browser can only land on the status page.
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
