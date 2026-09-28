import { type AuthClientPolicy } from '@/utils/auth/auth.types';

import { buildJwtLoginPath } from './jwt-login-path';

const jwtClientPolicy: AuthClientPolicy = {
  // There is no background refresh. An expired session goes to the login page.
  supportsSessionRecovery: false,
  unauthenticatedRemedy: 'login',
  labels: { login: 'Log in', logout: 'Log out' },
  login(returnTo) {
    window.location.assign(buildJwtLoginPath(returnTo));
  },
  async logout(options) {
    try {
      await fetch('/api/auth/token', { method: 'DELETE', cache: 'no-store' });
    } finally {
      window.location.assign(buildJwtLoginPath(undefined, options?.notice));
    }
  },
  // An unauthorized response starts recovery, which redirects to the login page.
  onUnauthorized: () => true,
};

export default jwtClientPolicy;
