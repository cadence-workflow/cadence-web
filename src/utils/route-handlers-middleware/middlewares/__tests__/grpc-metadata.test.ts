import { getGrpcMetadataFromAuth } from '@/utils/auth/auth-context';

import grpcMetadataMiddleware from '../grpc-metadata';

jest.mock('@/utils/auth/auth-context', () => ({
  getGrpcMetadataFromAuth: jest.fn(),
}));

const mockRequest = {
  cookies: {
    get: jest.fn(),
  },
} as any;

describe('grpc-metadata middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns grpc metadata derived from user info', async () => {
    (getGrpcMetadataFromAuth as jest.Mock).mockReturnValue({
      'cadence-authorization': 'abc',
    });

    const ctx: Record<string, unknown> = {
      authInfo: {
        authEnabled: true,
        token: 'abc',
        isAdmin: false,
        groups: [],
      },
    };

    const result = await grpcMetadataMiddleware(
      mockRequest,
      { params: {} } as any,
      ctx
    );

    expect(result).toEqual([
      'grpcMetadata',
      { 'cadence-authorization': 'abc' },
    ]);
  });

  it('merges existing grpc metadata with auth metadata', async () => {
    (getGrpcMetadataFromAuth as jest.Mock).mockReturnValue({
      'cadence-authorization': 'xyz',
    });

    const ctx: Record<string, unknown> = {
      authInfo: {
        authEnabled: true,
        token: 'xyz',
        isAdmin: false,
        groups: [],
      },
      grpcMetadata: {
        existing: 'true',
      },
    };

    const result = await grpcMetadataMiddleware(
      mockRequest,
      { params: {} } as any,
      ctx
    );

    expect(result).toEqual([
      'grpcMetadata',
      {
        existing: 'true',
        'cadence-authorization': 'xyz',
      },
    ]);
  });

  it('returns undefined metadata when none is available', async () => {
    (getGrpcMetadataFromAuth as jest.Mock).mockReturnValue(undefined);

    const result = await grpcMetadataMiddleware(
      mockRequest,
      { params: {} } as any,
      {}
    );

    expect(result).toEqual(['grpcMetadata', undefined]);
  });
});
