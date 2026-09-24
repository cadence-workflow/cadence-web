import getConfigValue from '@/utils/config/get-config-value';

import { getActiveAuthServerEntry } from '../auth-server-registry';
import disabledServerPolicy from '../disabled/disabled-server-policy';
import jwtServerPolicy from '../jwt/jwt-server-policy';

jest.mock('@/utils/config/get-config-value');

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

  it('resolves the jwt policy with its cookie names', async () => {
    setAuthStrategy('jwt');

    const entry = await getActiveAuthServerEntry();

    expect(entry.policy).toBe(jwtServerPolicy);
    expect(entry.cookieNames.exact).toContain('cadence-authorization');
  });

  it('resolves the disabled policy with no cookie declarations', async () => {
    setAuthStrategy('disabled');

    const entry = await getActiveAuthServerEntry();

    expect(entry.policy).toBe(disabledServerPolicy);
    expect(entry.cookieNames).toEqual({ exact: [], prefixes: [] });
  });
});
