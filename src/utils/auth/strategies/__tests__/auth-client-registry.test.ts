import AUTH_CLIENT_STRATEGIES_CONFIG from '@/config/auth/auth-client-strategies.config';

import getAuthClientPolicy from '../auth-client-registry';

jest.mock('@/config/auth/auth-client-strategies.config', () => ({
  __esModule: true,
  default: {
    disabled: { name: 'disabled' },
    jwt: { name: 'jwt' },
  },
}));

describe(getAuthClientPolicy.name, () => {
  it('returns the policy for the given strategy', () => {
    expect(getAuthClientPolicy('jwt')).toBe(AUTH_CLIENT_STRATEGIES_CONFIG.jwt);
  });

  it('returns undefined when no strategy is provided', () => {
    expect(getAuthClientPolicy(undefined)).toBeUndefined();
  });
});
