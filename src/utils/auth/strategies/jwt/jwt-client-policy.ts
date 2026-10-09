import { type AuthClientPolicy } from '@/utils/auth/auth.types';

import { buildJwtLoginPath } from './jwt-login-path';

const jwtClientPolicy: AuthClientPolicy = {
  // There is no background refresh. An expired session goes to the login page.
  supportsSessionRecovery: false,
  unauthenticatedRemedy: 'login',
  login(returnTo) {
    window.location.assign(buildJwtLoginPath(returnTo));
  },
  async logout(options) {
    const response = await fetch('/api/auth/token', {
      method: 'DELETE',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to clear session');
    }
    window.location.assign(buildJwtLoginPath(undefined, options?.notice));
  },
  // An unauthorized response starts recovery, which redirects to the login page.
  onUnauthorized: () => true,
};

export default jwtClientPolicy;
