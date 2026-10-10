import { type TrustedHeaderAuthConfig } from '@/config/dynamic/resolvers/trusted-header-auth-config.types';
import getConfigValue from '@/utils/config/get-config-value';

import getAuthenticatedUserInfo from '../get-authenticated-user-info';

jest.mock('@/utils/config/get-config-value');

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;

const CONFIG: TrustedHeaderAuthConfig = {
  userIdHeader: 'x-cadence-user-id',
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

    await expect(
      getAuthenticatedUserInfo(requestWith({ 'x-cadence-user-id': 'alice' }))
    ).resolves.toBeNull();
  });

  it('returns null when the fallback user-id header is missing', async () => {
    mockGetConfigValue.mockResolvedValue(CONFIG);

    await expect(getAuthenticatedUserInfo(requestWith({}))).resolves.toBeNull();
  });

  it('falls back to the user-id header until the backend identity call exists', async () => {
    mockGetConfigValue.mockResolvedValue(CONFIG);

    await expect(
      getAuthenticatedUserInfo(
        requestWith({ 'x-cadence-user-id': '  alice  ' })
      )
    ).resolves.toEqual({
      id: 'alice',
      userName: 'alice',
      isAdmin: false,
      groups: [],
    });
  });
});
