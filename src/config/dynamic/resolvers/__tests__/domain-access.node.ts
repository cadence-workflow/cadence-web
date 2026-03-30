import {
  getGrpcMetadataFromAuth,
  resolveAuthContext,
} from '@/utils/auth/auth-context';
import { getClusterMethods } from '@/utils/grpc/grpc-client';
import logger from '@/utils/logger';
import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';

import domainAccess from '../domain-access';

jest.mock('@/utils/auth/auth-context', () => ({
  ...jest.requireActual('@/utils/auth/auth-context'),
  getGrpcMetadataFromAuth: jest.fn(),
  resolveAuthContext: jest.fn(),
}));
jest.mock('@/utils/grpc/grpc-client', () => ({
  getClusterMethods: jest.fn(),
}));
jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

const mockResolveAuthContext = jest.mocked(resolveAuthContext);
const mockGetGrpcMetadataFromAuth = jest.mocked(getGrpcMetadataFromAuth);
const mockGetClusterMethods = jest.mocked(getClusterMethods);
const mockLoggerError = jest.mocked(logger.error);

describe(domainAccess.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns full access when auth is disabled', async () => {
    mockResolveAuthContext.mockResolvedValue({
      authEnabled: false,
      auth: { isValidToken: false },
      isAdmin: false,
      groups: [],
    });

    const result = await domainAccess({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      canRead: true,
      canWrite: true,
    });
    expect(mockGetClusterMethods).not.toHaveBeenCalled();
  });

  it('returns full access for admin users', async () => {
    mockResolveAuthContext.mockResolvedValue({
      authEnabled: true,
      auth: { isValidToken: true, token: 'jwt-token' },
      isAdmin: true,
      groups: [],
    });

    const result = await domainAccess({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      canRead: true,
      canWrite: true,
    });
    expect(mockGetClusterMethods).not.toHaveBeenCalled();
  });

  it('returns no access for unauthenticated users', async () => {
    mockResolveAuthContext.mockResolvedValue({
      authEnabled: true,
      auth: { isValidToken: false },
      isAdmin: false,
      groups: [],
    });

    const result = await domainAccess({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      canRead: false,
      canWrite: false,
    });
    expect(mockGetClusterMethods).not.toHaveBeenCalled();
  });

  it('derives access from the domain resolver for authenticated users', async () => {
    mockResolveAuthContext.mockResolvedValue({
      authEnabled: true,
      auth: { isValidToken: true, token: 'jwt-token' },
      isAdmin: false,
      groups: ['reader'],
    });
    mockGetGrpcMetadataFromAuth.mockReturnValue({
      'cadence-authorization': 'jwt-token',
    });
    mockGetClusterMethods.mockResolvedValue({
      describeDomain: jest.fn().mockResolvedValue({
        domain: getDomainObj({
          id: 'test-domain-id',
          name: 'test-domain',
          data: {
            READ_GROUPS: 'reader',
            WRITE_GROUPS: 'writer',
          },
        }),
      }),
    } as any);

    const result = await domainAccess({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      canRead: true,
      canWrite: false,
    });
    expect(mockGetClusterMethods).toHaveBeenCalledWith('test-cluster', {
      'cadence-authorization': 'jwt-token',
    });
  });

  it('rethrows when the domain lookup fails', async () => {
    mockResolveAuthContext.mockResolvedValue({
      authEnabled: true,
      auth: { isValidToken: true, token: 'jwt-token' },
      isAdmin: false,
      groups: ['writer'],
    });
    mockGetGrpcMetadataFromAuth.mockReturnValue({
      'cadence-authorization': 'jwt-token',
    });
    mockGetClusterMethods.mockResolvedValue({
      describeDomain: jest.fn().mockRejectedValue(new Error('boom')),
    } as any);

    await expect(
      domainAccess({
        cluster: 'test-cluster',
        domain: 'test-domain',
      })
    ).rejects.toThrow('boom');
    expect(mockLoggerError).toHaveBeenCalledWith(
      {
        error: expect.any(Error),
        cluster: 'test-cluster',
        domain: 'test-domain',
      },
      'Failed to resolve domain access'
    );
  });
});
