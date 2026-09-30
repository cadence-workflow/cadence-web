import { type AuthRequest } from '@/utils/auth/auth.types';

import { JWT_AUTH_COOKIE_NAME } from '../jwt-auth.constants';

export function getMockJwtAuthRequest(token?: string): AuthRequest {
  return {
    cookies: {
      get: (name: string) =>
        name === JWT_AUTH_COOKIE_NAME && token !== undefined
          ? { value: token }
          : undefined,
    },
    headers: new Headers(),
  };
}
