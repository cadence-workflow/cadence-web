import { type NextRequest } from 'next/server';

import { type AuthContext } from '@/utils/auth/auth.types';
import { getActiveAuthServerEntry } from '@/utils/auth/strategies/auth-server-registry';

import grpcMetadataMiddleware from '../grpc-metadata';

jest.mock('@/utils/auth/strategies/auth-server-registry', () => ({
  getActiveAuthServerEntry: jest.fn(),
}));

const mockGetActiveAuthServerEntry = jest.mocked(getActiveAuthServerEntry);
const mockRequest = {
  cookies: {
    get: jest.fn(),
  },
  headers: new Headers({ 'x-forwarded-host': 'cadence.example' }),
} as unknown as NextRequest;
const mockOptions = { params: {} };

const buildAuthInfo = (): AuthContext => ({
  authEnabled: true,
  auth: { isValidToken: true, canRefresh: false },
  isAdmin: false,
  groups: [],
});

describe('grpc-metadata middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns grpc metadata from the active policy', async () => {
    const getGrpcMetadata = jest
      .fn()
      .mockReturnValue({ 'cadence-authorization': 'abc' });
    mockGetActiveAuthServerEntry.mockResolvedValue({
      policy: { getGrpcMetadata },
    } as unknown as Awaited<ReturnType<typeof getActiveAuthServerEntry>>);

    const authInfo = buildAuthInfo();
    const result = await grpcMetadataMiddleware(mockRequest, mockOptions, {
      authInfo,
    });

    expect(result).toEqual([
      'grpcMetadata',
      { 'cadence-authorization': 'abc' },
    ]);
    expect(getGrpcMetadata).toHaveBeenCalledWith(authInfo, {
      cookies: mockRequest.cookies,
      headers: mockRequest.headers,
    });
    // identity, not just shape: the real request headers object is forwarded
    expect(getGrpcMetadata.mock.calls[0][1].headers).toBe(mockRequest.headers);
  });

  it('returns undefined metadata when the policy provides none', async () => {
    mockGetActiveAuthServerEntry.mockResolvedValue({
      policy: { getGrpcMetadata: jest.fn().mockReturnValue(undefined) },
    } as unknown as Awaited<ReturnType<typeof getActiveAuthServerEntry>>);

    const result = await grpcMetadataMiddleware(mockRequest, mockOptions, {
      authInfo: buildAuthInfo(),
    });

    expect(result).toEqual(['grpcMetadata', undefined]);
  });

  it('returns undefined metadata without resolving the policy when auth info is absent', async () => {
    const result = await grpcMetadataMiddleware(mockRequest, mockOptions, {});

    expect(result).toEqual(['grpcMetadata', undefined]);
    expect(mockGetActiveAuthServerEntry).not.toHaveBeenCalled();
  });
});
