import { resolveAuthContext } from '@/utils/auth/auth-context';
import logger from '@/utils/logger';
import request from '@/utils/request';
import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';

import domainAccess from '../domain-access';

jest.mock('@/utils/auth/auth-context', () => ({
  ...jest.requireActual('@/utils/auth/auth-context'),
  resolveAuthContext: jest.fn(),
}));
jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));
jest.mock('@/utils/request', () => jest.fn());

const mockResolveAuthContext = jest.mocked(resolveAuthContext);
const mockLoggerError = jest.mocked(logger.error);
const mockRequest = jest.mocked(request);

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
    expect(mockRequest).not.toHaveBeenCalled();
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
    expect(mockRequest).not.toHaveBeenCalled();
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
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('derives access from the domain resolver for authenticated users', async () => {
    mockResolveAuthContext.mockResolvedValue({
      authEnabled: true,
      auth: { isValidToken: true, token: 'jwt-token' },
      isAdmin: false,
      groups: ['reader'],
    });
    mockRequest.mockResolvedValue({
      json: jest.fn().mockResolvedValue(
        getDomainObj({
          id: 'test-domain-id',
          name: 'test-domain',
          data: {
            READ_GROUPS: 'reader',
            WRITE_GROUPS: 'writer',
          },
        })
      ),
    } as any);

    const result = await domainAccess({
      cluster: 'test-cluster',
      domain: 'test-domain',
    });

    expect(result).toEqual({
      canRead: true,
      canWrite: false,
    });
    expect(mockRequest).toHaveBeenCalledWith(
      '/api/domains/test-domain/test-cluster'
    );
  });

  it('rethrows when the domain lookup fails', async () => {
    mockResolveAuthContext.mockResolvedValue({
      authEnabled: true,
      auth: { isValidToken: true, token: 'jwt-token' },
      isAdmin: false,
      groups: ['writer'],
    });
    mockRequest.mockRejectedValue(new Error('boom'));

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
