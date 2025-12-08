import {
  getGrpcMetadataFromAuth,
  resolveAuthContext,
} from '@/utils/auth/auth-context';

import userInfoMiddleware from '../user-info';

jest.mock('@/utils/auth/auth-context', () => ({
  resolveAuthContext: jest.fn(),
  getGrpcMetadataFromAuth: jest.fn(),
}));

const mockRequest = {
  cookies: {
    get: jest.fn(),
  },
} as any;

describe('user-info middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns auth context and sets grpc metadata when available', async () => {
    const mockAuthContext = {
      rbacEnabled: true,
      token: 'abc',
      isAdmin: false,
      groups: [],
    };
    (resolveAuthContext as jest.Mock).mockResolvedValue(mockAuthContext);
    (getGrpcMetadataFromAuth as jest.Mock).mockReturnValue({
      'cadence-authorization': 'abc',
    });

    const ctx: Record<string, unknown> = {};
    const result = await userInfoMiddleware(
      mockRequest,
      { params: {} } as any,
      ctx
    );

    expect(result).toEqual(['userInfo', mockAuthContext]);
    expect(ctx.grpcMetadata).toEqual({
      'cadence-authorization': 'abc',
    });
  });

  it('merges existing grpc metadata', async () => {
    (resolveAuthContext as jest.Mock).mockResolvedValue({
      rbacEnabled: true,
      token: 'xyz',
      isAdmin: false,
      groups: [],
    });
    (getGrpcMetadataFromAuth as jest.Mock).mockReturnValue({
      'cadence-authorization': 'xyz',
    });

    const ctx: Record<string, unknown> = { grpcMetadata: { existing: 'true' } };
    await userInfoMiddleware(mockRequest, { params: {} } as any, ctx);

    expect(ctx.grpcMetadata).toEqual({
      existing: 'true',
      'cadence-authorization': 'xyz',
    });
  });

  it('skips grpc metadata when not provided', async () => {
    (resolveAuthContext as jest.Mock).mockResolvedValue({
      rbacEnabled: false,
      isAdmin: false,
      groups: [],
    });
    (getGrpcMetadataFromAuth as jest.Mock).mockReturnValue(undefined);

    const ctx: Record<string, unknown> = {};
    const result = await userInfoMiddleware(
      mockRequest,
      { params: {} } as any,
      ctx
    );

    expect(result).toEqual([
      'userInfo',
      {
        rbacEnabled: false,
        isAdmin: false,
        groups: [],
      },
    ]);
    expect(ctx.grpcMetadata).toBeUndefined();
  });
});
