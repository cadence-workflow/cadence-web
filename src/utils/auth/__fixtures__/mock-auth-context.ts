import { type AuthContext } from '../auth.types';

export function getMockAuthContext(
  overrides: Partial<AuthContext> = {}
): AuthContext {
  return {
    authEnabled: true,
    auth: { isValidToken: true, canRefresh: false },
    isAdmin: false,
    groups: [],
    ...overrides,
  };
}
