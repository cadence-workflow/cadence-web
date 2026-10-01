import { type AuthClientPolicy } from '@/utils/auth/auth.types';

const disabledClientPolicy: AuthClientPolicy = {
  supportsSessionRecovery: false,
  // Unused: with auth disabled there is no unauthenticated surface to remedy.
  unauthenticatedRemedy: 'login',
  login() {},
  logout: () => Promise.resolve(),
  onUnauthorized: () => false,
};

export default disabledClientPolicy;
