import { type AuthRequest } from '@/utils/auth/auth.types';

import getJwtTokenFromRequest from '../get-jwt-token-from-request';
import { JWT_AUTH_COOKIE_NAME } from '../jwt-auth.constants';

const buildRequest = (token?: string): AuthRequest => ({
  cookies: {
    get: (name: string) =>
      name === JWT_AUTH_COOKIE_NAME && token !== undefined
        ? { value: token }
        : undefined,
  },
  headers: new Headers(),
});

describe(getJwtTokenFromRequest.name, () => {
  it('returns the trimmed token', () => {
    expect(getJwtTokenFromRequest(buildRequest('  abc  '))).toBe('abc');
  });

  it('returns undefined when the cookie is absent or blank', () => {
    expect(getJwtTokenFromRequest(buildRequest())).toBeUndefined();
    expect(getJwtTokenFromRequest(buildRequest('   '))).toBeUndefined();
  });
});
