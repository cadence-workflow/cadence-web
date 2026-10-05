import { type NextRequest } from 'next/server';

import { getMockAuthContext } from '@/utils/auth/__fixtures__/mock-auth-context';
import { getMockAuthServerRegistryEntry } from '@/utils/auth/__fixtures__/mock-auth-server-registry-entry';
import getActiveAuthServerEntry from '@/utils/auth/strategies/get-active-auth-server-entry';

import grpcMetadataMiddleware from '../grpc-metadata';

jest.mock('@/utils/auth/strategies/get-active-auth-server-entry', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockGetActiveAuthServerEntry = jest.mocked(getActiveAuthServerEntry);
const mockRequest = {
  cookies: {
    get: jest.fn(),
  },
  headers: new Headers({ 'x-forwarded-host': 'cadence.example' }),
} as unknown as NextRequest;
const mockOptions = { params: {} };

describe('grpc-metadata middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns grpc metadata from the active policy', async () => {
    const getGrpcMetadata = jest
      .fn()
      .mockReturnValue({ 'cadence-authorization': 'abc' });
    mockGetActiveAuthServerEntry.mockResolvedValue(
      getMockAuthServerRegistryEntry({ getGrpcMetadata })
    );

    const authInfo = getMockAuthContext();
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
    mockGetActiveAuthServerEntry.mockResolvedValue(
      getMockAuthServerRegistryEntry({
        getGrpcMetadata: jest.fn().mockReturnValue(undefined),
      })
    );

    const result = await grpcMetadataMiddleware(mockRequest, mockOptions, {
      authInfo: getMockAuthContext(),
    });

    expect(result).toEqual(['grpcMetadata', undefined]);
  });

  it('returns undefined metadata without resolving the policy when auth info is absent', async () => {
    const result = await grpcMetadataMiddleware(mockRequest, mockOptions, {});

    expect(result).toEqual(['grpcMetadata', undefined]);
    expect(mockGetActiveAuthServerEntry).not.toHaveBeenCalled();
  });
});
