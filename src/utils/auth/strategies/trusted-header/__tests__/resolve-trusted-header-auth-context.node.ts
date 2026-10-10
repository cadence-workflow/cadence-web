import { type AuthRequest } from '@/utils/auth/auth.types';
import getAuthenticatedUserInfo from '@/utils/auth/get-authenticated-user-info';

import resolveTrustedHeaderAuthContext from '../resolve-trusted-header-auth-context';

jest.mock('@/utils/auth/get-authenticated-user-info');

const mockGetAuthenticatedUserInfo =
  getAuthenticatedUserInfo as jest.MockedFunction<
    typeof getAuthenticatedUserInfo
  >;

const request: AuthRequest = {
  cookies: { get: () => undefined },
  headers: new Headers(),
};

describe(resolveTrustedHeaderAuthContext.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an unauthenticated context when there is no identity', async () => {
    mockGetAuthenticatedUserInfo.mockResolvedValue(null);

    await expect(resolveTrustedHeaderAuthContext(request)).resolves.toEqual({
      authEnabled: true,
      auth: { isValidToken: false, canRefresh: false },
      isAdmin: false,
      groups: [],
    });
  });

  it('maps the identity adapter result into the context', async () => {
    mockGetAuthenticatedUserInfo.mockResolvedValue({
      id: 'user-1',
      userName: 'User One',
      email: 'user-one@example.com',
      pictureUrl: 'https://example.com/avatar.png',
      isAdmin: true,
    });

    await expect(resolveTrustedHeaderAuthContext(request)).resolves.toEqual({
      authEnabled: true,
      auth: { isValidToken: true, canRefresh: false },
      isAdmin: true,
      groups: [],
      id: 'user-1',
      userName: 'User One',
      email: 'user-one@example.com',
      pictureUrl: 'https://example.com/avatar.png',
    });
  });
});
