import { type AuthRequest } from '../auth.types';

export function getMockAuthRequest(): AuthRequest {
  return {
    cookies: { get: () => undefined },
    headers: new Headers(),
  };
}
