import AUTH_SERVER_STRATEGIES_CONFIG from '@/config/auth/auth-server-strategies.config';
import getConfigValue from '@/utils/config/get-config-value';

import getActiveAuthServerEntry from '../get-active-auth-server-entry';

jest.mock('@/utils/config/get-config-value');
jest.mock('@/config/auth/auth-server-strategies.config', () => ({
  __esModule: true,
  default: {
    disabled: {
      policy: { name: 'eager' },
      cookieNames: { exact: [], prefixes: [] },
    },
    jwt: {
      policy: () => Promise.resolve({ name: 'lazy' }),
      cookieNames: { exact: ['mock-cookie'], prefixes: ['mock-prefix-'] },
    },
  },
}));

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;

const setAuthStrategy = (strategy: string) => {
  mockGetConfigValue.mockImplementation(async (key: string) => {
    if (key === 'CADENCE_WEB_AUTH_STRATEGY') return strategy;
    return '';
  });
};

describe(getActiveAuthServerEntry.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the active strategy policy and cookie names', async () => {
    setAuthStrategy('disabled');

    const entry = await getActiveAuthServerEntry();

    expect(entry.policy).toBe(AUTH_SERVER_STRATEGIES_CONFIG.disabled.policy);
    expect(entry.cookieNames).toEqual({ exact: [], prefixes: [] });
  });

  it('loads a lazy policy before returning it', async () => {
    setAuthStrategy('jwt');

    const entry = await getActiveAuthServerEntry();

    expect(entry.policy).toEqual({ name: 'lazy' });
    expect(entry.cookieNames).toEqual({
      exact: ['mock-cookie'],
      prefixes: ['mock-prefix-'],
    });
  });
});
