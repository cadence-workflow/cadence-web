import { Suspense, type ReactElement } from 'react';

import { redirect } from 'next/navigation';

import getConfigValue from '@/utils/config/get-config-value';
import JwtLoginPage from '@/views/jwt-login-page/jwt-login-page';

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

const setAuthStrategy = (strategy: string) => {
  mockGetConfigValue.mockImplementation(async (key: string) => {
    if (key === 'CADENCE_WEB_AUTH_STRATEGY') return strategy;
    return '';
  });
};

describe(LoginPage.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to / when the strategy is not jwt', async () => {
    setAuthStrategy('disabled');

    await expect(LoginPage()).rejects.toThrow('NEXT_REDIRECT;/');
    expect(mockRedirect).toHaveBeenCalledWith('/');
  });

  it('renders JwtLoginPage under Suspense when the strategy is jwt', async () => {
    setAuthStrategy('jwt');

    const page = (await LoginPage()) as ReactElement<{
      children: ReactElement;
    }>;
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(page.type).toBe(Suspense);
    expect(page.props.children.type).toBe(JwtLoginPage);
  });
});
