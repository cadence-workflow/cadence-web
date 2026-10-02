import { cookies, headers } from 'next/headers';

import { getMockAuthContext } from '../__fixtures__/mock-auth-context';
import { getMockAuthServerRegistryEntry } from '../__fixtures__/mock-auth-server-registry-entry';
import getLoginRedirect from '../get-login-redirect';
import getActiveAuthServerEntry from '../strategies/get-active-auth-server-entry';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
  headers: jest.fn(),
}));
jest.mock('../strategies/get-active-auth-server-entry');

const mockGetActiveAuthServerEntry =
  getActiveAuthServerEntry as jest.MockedFunction<
    typeof getActiveAuthServerEntry
  >;

describe(getLoginRedirect.name, () => {
  it('redirects a first-time visitor without an expiry notice', async () => {
    const authContext = getMockAuthContext({
      auth: { isValidToken: false, canRefresh: false },
    });
    const getLoginRedirectIfNeeded = jest
      .fn()
      .mockReturnValue('/login?returnTo=%2Fdomains');
    mockGetActiveAuthServerEntry.mockResolvedValue(
      getMockAuthServerRegistryEntry({
        resolveAuthContext: jest.fn().mockResolvedValue(authContext),
        getLoginRedirectIfNeeded,
      })
    );
    jest
      .mocked(headers)
      .mockReturnValue(new Headers({ 'x-cadence-return-to': '/domains' }));
    jest.mocked(cookies).mockReturnValue({
      getAll: () => [],
    } as unknown as ReturnType<typeof cookies>);

    await expect(getLoginRedirect()).resolves.toBe(
      '/login?returnTo=%2Fdomains'
    );
    expect(getLoginRedirectIfNeeded).toHaveBeenCalledWith(
      authContext,
      '/domains',
      undefined
    );
  });

  it('adds the expiry notice when an invalid session cookie exists', async () => {
    const authContext = getMockAuthContext({
      auth: { isValidToken: false, canRefresh: false },
    });
    const getLoginRedirectIfNeeded = jest
      .fn()
      .mockReturnValue('/login?notice=session-expired');
    const entry = getMockAuthServerRegistryEntry({
      resolveAuthContext: jest.fn().mockResolvedValue(authContext),
      getLoginRedirectIfNeeded,
    });
    entry.cookieNames.exact.push('cadence-authorization');
    mockGetActiveAuthServerEntry.mockResolvedValue(entry);
    jest.mocked(headers).mockReturnValue(new Headers());
    jest.mocked(cookies).mockReturnValue({
      getAll: () => [{ name: 'cadence-authorization', value: 'expired' }],
    } as unknown as ReturnType<typeof cookies>);

    await getLoginRedirect();

    expect(getLoginRedirectIfNeeded).toHaveBeenCalledWith(
      authContext,
      '/',
      'session-expired'
    );
  });
});
