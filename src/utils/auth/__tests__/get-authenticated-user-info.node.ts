import { type TrustedHeaderAuthConfig } from '@/config/dynamic/resolvers/trusted-header-auth-config.types';
import getConfigValue from '@/utils/config/get-config-value';

import getAuthenticatedUserInfo from '../get-authenticated-user-info';

jest.mock('@/utils/config/get-config-value');

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;

const CONFIG: TrustedHeaderAuthConfig = {
  grpcMetadataMap: [],
};

const requestWith = (headers: Record<string, string>) => ({
  cookies: { get: () => undefined },
  headers: new Headers(headers),
});

describe(getAuthenticatedUserInfo.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when trusted-header config is absent', async () => {
    mockGetConfigValue.mockResolvedValue(null);

    await expect(getAuthenticatedUserInfo(requestWith({}))).resolves.toBeNull();
  });

  it('returns the temporary backend identity response', async () => {
    mockGetConfigValue.mockResolvedValue(CONFIG);

    await expect(
      getAuthenticatedUserInfo(requestWith({ 'x-forwarded-user': 'alice' }))
    ).resolves.toEqual({
      id: 'trusted-header-user',
      userName: 'Trusted Header User',
      isAdmin: false,
      groups: [],
    });
  });
});
