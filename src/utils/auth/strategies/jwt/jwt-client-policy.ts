import { type AuthClientPolicy } from '@/utils/auth/auth.types';

import buildJwtLoginPath from './build-jwt-login-path';

const jwtClientPolicy: AuthClientPolicy = {
  // JWT recovery always redirects to the login page; nothing silent to try.
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
  // jwt's recoverSession returns the redirect outcome, so the pipeline may
  // attempt it.
  onUnauthorized: () => true,
};

export default jwtClientPolicy;
