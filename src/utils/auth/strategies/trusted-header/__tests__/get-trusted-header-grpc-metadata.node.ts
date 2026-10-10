import { type TrustedHeaderAuthConfig } from '@/config/dynamic/resolvers/trusted-header-auth-config.types';
import { type AuthRequest } from '@/utils/auth/auth.types';
import getConfigValue from '@/utils/config/get-config-value';

import getTrustedHeaderGrpcMetadata from '../get-trusted-header-grpc-metadata';

jest.mock('@/utils/config/get-config-value');

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;

const CONFIG: TrustedHeaderAuthConfig = [
  { inboundHeader: 'x-team', outboundKey: 'cadence-team' },
  { inboundHeader: 'x-region', outboundKey: 'cadence-region' },
];

const requestWith = (headers: Record<string, string>): AuthRequest => ({
  cookies: { get: () => undefined },
  headers: new Headers(headers),
});

describe(getTrustedHeaderGrpcMetadata.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined when config is absent', async () => {
    mockGetConfigValue.mockResolvedValue(null);

    await expect(
      getTrustedHeaderGrpcMetadata(requestWith({ 'x-team': 'eng' }))
    ).resolves.toBeUndefined();
  });

  it('maps configured headers verbatim', async () => {
    mockGetConfigValue.mockResolvedValue(CONFIG);

    await expect(
      getTrustedHeaderGrpcMetadata(
        requestWith({ 'x-team': 'eng', 'x-region': 'us1' })
      )
    ).resolves.toEqual({
      'cadence-team': 'eng',
      'cadence-region': 'us1',
    });
  });

  it('skips headers that are not set', async () => {
    mockGetConfigValue.mockResolvedValue(CONFIG);

    await expect(
      getTrustedHeaderGrpcMetadata(requestWith({ 'x-team': 'eng' }))
    ).resolves.toEqual({ 'cadence-team': 'eng' });
  });

  it('returns undefined when no configured header is present', async () => {
    mockGetConfigValue.mockResolvedValue(CONFIG);

    await expect(
      getTrustedHeaderGrpcMetadata(requestWith({}))
    ).resolves.toBeUndefined();
  });
});
