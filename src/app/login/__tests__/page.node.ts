import { redirect } from 'next/navigation';

import getConfigValue from '@/utils/config/get-config-value';

import LoginPage from '../page';

jest.mock('@/utils/config/get-config-value');
jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    // next/navigation's redirect never returns — it throws NEXT_REDIRECT.
    throw new Error(`NEXT_REDIRECT;${url}`);
  }),
}));
jest.mock(
  '@/views/jwt-login-page/jwt-login-page',
  () =>
    function MockJwtLoginPage() {
      return null;
    }
);

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

const setAuthStrategy = (strategy: 'jwt' | 'disabled') => {
  mockGetConfigValue.mockImplementation(async (key: string) => {
    if (key === 'CADENCE_WEB_AUTH_STRATEGY') return strategy;
    return '';
  });
};

describe(LoginPage.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to / when the active strategy is not jwt', async () => {
    setAuthStrategy('disabled');

    await expect(LoginPage()).rejects.toThrow('NEXT_REDIRECT;/');
    expect(mockRedirect).toHaveBeenCalledWith('/');
  });

  it('renders the jwt login form under the jwt strategy', async () => {
    setAuthStrategy('jwt');

    await expect(LoginPage()).resolves.toBeDefined();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
