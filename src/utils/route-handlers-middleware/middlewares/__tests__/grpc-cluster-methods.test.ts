import { type NextRequest } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getClusterMethods } from '@/utils/grpc/grpc-client';

import grpcClusterMethods from '../grpc-cluster-methods';

jest.mock('@/utils/decode-url-params', () => jest.fn());
jest.mock('@/utils/grpc/grpc-client', () => ({
  getClusterMethods: jest.fn(),
}));

const mockContext = {
  grpcMetadata: undefined,
};

const mockParams = {
  cluster: 'test-cluster',
};

const mockDecodedParams = {
  cluster: 'decoded-cluster',
};

const mockRequest = {
  cookies: {},
  geo: {},
  ip: '',
  nextUrl: new URL('http://localhost'),
} as NextRequest;

describe('grpcClusterMethods middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if params.cluster is not provided', async () => {
    await expect(
      await expect(
        grpcClusterMethods(mockRequest, { params: {} }, mockContext)
      ).rejects.toMatchObject(Error('Cluster not found: undefined'))
    );
  });
  it('should decode URL params and call getClusterMethods with correct arguments', async () => {
    (decodeUrlParams as jest.Mock).mockReturnValue(mockDecodedParams);

    await grpcClusterMethods(mockRequest, { params: mockParams }, mockContext);

    expect(decodeUrlParams).toHaveBeenCalledWith(mockParams);
    await expect(getClusterMethods).toHaveBeenCalledWith(
      mockDecodedParams.cluster,
      undefined
    );
  });

  it('should return the correct middleware result', async () => {
    const mockGRPCClusterMethods = {};
    (decodeUrlParams as jest.Mock).mockReturnValue(mockDecodedParams);
    (getClusterMethods as jest.Mock).mockResolvedValue(mockGRPCClusterMethods);

    const result = await grpcClusterMethods(
      mockRequest,
      { params: mockParams },
      mockContext
    );

    expect(result).toEqual(['grpcClusterMethods', mockGRPCClusterMethods]);
  });

  it('should handle grpcMetadata correctly', async () => {
    const mockGRPCMetadata = { key: 'value' };
    const contextWithMetadata = { grpcMetadata: mockGRPCMetadata };
    (decodeUrlParams as jest.Mock).mockReturnValue(mockDecodedParams);

    await grpcClusterMethods(
      mockRequest,
      { params: mockParams },
      contextWithMetadata
    );

    expect(getClusterMethods).toHaveBeenCalledWith(
      mockDecodedParams.cluster,
      mockGRPCMetadata
    );
  });
});
