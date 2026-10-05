import { type AuthClientPolicy } from '@/utils/auth/auth.types';

const disabledClientPolicy: AuthClientPolicy = {
  supportsSessionRecovery: false,
  // Not shown: with auth disabled there is no signed-out page.
  unauthenticatedRemedy: 'login',
  login() {},
  logout: () => Promise.resolve(),
  onUnauthorized: () => false,
};

export default disabledClientPolicy;
