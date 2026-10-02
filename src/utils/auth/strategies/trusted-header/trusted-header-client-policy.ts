import { type AuthClientPolicy } from '@/utils/auth/auth.types';

/**
 * Browser half of the trusted-header strategy. Login and logout happen
 * upstream at the trusted perimeter — the browser has no credential action.
 * A post-hydration 401 navigates to the status page (unauthenticatedRemedy);
 * recoverSession is unreachable (onUnauthorized false).
 */
const trustedHeaderClientPolicy: AuthClientPolicy = {
  supportsSessionRecovery: false,
  unauthenticatedRemedy: 'unavailable',
  login() {},
  logout: () => Promise.resolve(),
  onUnauthorized: () => false,
};

export default trustedHeaderClientPolicy;
