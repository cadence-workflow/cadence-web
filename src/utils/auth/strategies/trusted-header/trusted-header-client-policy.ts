import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthClientPolicy } from '@/utils/auth/auth.types';

/**
 * Browser half of the trusted-header strategy. Credentials come from the
 * perimeter; when identity disappears the browser can only land on the
 * status page (same destination as the server layout gate).
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
