import { type AuthClientPolicy } from '@/utils/auth/auth.types';

/**
 * Browser half of the trusted-header strategy. Login and logout happen
 * upstream at the trusted perimeter, so the browser has nothing to do.
 */
const trustedHeaderClientPolicy: AuthClientPolicy = {
  supportsSessionRecovery: false,
  unauthenticatedRemedy: 'unavailable',
  login() {},
  logout: () => Promise.resolve(),
  onUnauthorized: () => false,
};

export default trustedHeaderClientPolicy;
