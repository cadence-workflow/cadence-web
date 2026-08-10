import { type NextRequest } from 'next/server';

import { getGrpcMetadataFromAuth } from '@/utils/auth/auth-context';

import grpcMetadataMiddleware from '../grpc-metadata';

jest.mock('@/utils/auth/auth-context', () => ({
  getGrpcMetadataFromAuth: jest.fn(),
}));
const mockGetGrpcMetadataFromAuth = jest.mocked(getGrpcMetadataFromAuth);
const mockRequest = {
  cookies: {
    get: jest.fn(),
  },
} as unknown as NextRequest;
const mockOptions = { params: {} };

describe('grpc-metadata middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns grpc metadata derived from auth info', async () => {
    mockGetGrpcMetadataFromAuth.mockReturnValue({
      'cadence-authorization': 'abc',
    });

    const ctx: Record<string, unknown> = {
      authInfo: {
        authEnabled: true,
        auth: { isValidToken: true, token: 'abc' },
        isAdmin: false,
        groups: [],
      },
    };

    const result = await grpcMetadataMiddleware(mockRequest, mockOptions, ctx);

    expect(result).toEqual([
      'grpcMetadata',
      { 'cadence-authorization': 'abc' },
    ]);
  });

  it('returns undefined metadata when auth provides none', async () => {
    mockGetGrpcMetadataFromAuth.mockReturnValue(undefined);

    const result = await grpcMetadataMiddleware(mockRequest, mockOptions, {});

    expect(result).toEqual(['grpcMetadata', undefined]);
  });
});
