import * as grpcClient from '@/utils/grpc/grpc-client';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { getDomainObj } from '../../__fixtures__/domains';
import * as filterIrrelevantDomainsModule from '../filter-irrelevant-domains';
import getDomainsForCluster from '../get-domains-for-cluster';

jest.mock('@/utils/grpc/grpc-client');
jest.mock('@/utils/logger');
jest.mock('../filter-irrelevant-domains');

describe(getDomainsForCluster.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls listDomains with the correct pageSize and returns filtered domains', async () => {
    const { result, mockListDomains, mockFilterIrrelevantDomains } =
      await setup({ domainsCount: 2 });

    expect(mockListDomains).toHaveBeenCalledWith({ pageSize: 1000 });
    expect(mockFilterIrrelevantDomains).toHaveBeenCalledWith(
      'test-cluster',
      expect.arrayContaining([
        expect.objectContaining({ id: 'domain-1' }),
        expect.objectContaining({ id: 'domain-2' }),
      ])
    );
    expect(result).toHaveLength(2);
  });

  it('logs a warning when domains count approaches the limit', async () => {
    await setup({ domainsCount: 950 });

    expect(logger.warn).toHaveBeenCalledWith(
      {
        domainsCount: 950,
        maxDomainsCount: 1000,
      },
      'Number of domains in cluster approaching/exceeds max number of domains that can be fetched'
    );
  });

  it('logs a warning when domains count exceeds the limit', async () => {
    await setup({ domainsCount: 1000 });

    expect(logger.warn).toHaveBeenCalledWith(
      {
        domainsCount: 1000,
        maxDomainsCount: 1000,
      },
      'Number of domains in cluster approaching/exceeds max number of domains that can be fetched'
    );
  });

  it('does not log a warning when domains count is safely below the limit', async () => {
    await setup({ domainsCount: 800 });

    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('logs an error and throws when listDomains fails with GRPCError', async () => {
    const grpcError = new GRPCError('Connection refused');

    await expect(setup({ error: grpcError })).rejects.toThrow(grpcError);

    expect(logger.error).toHaveBeenCalledWith(
      { error: grpcError, clusterName: 'test-cluster' },
      'Failed to fetch domains for test-cluster: Connection refused'
    );
  });

  it('logs an error and throws when listDomains fails with a generic error', async () => {
    const genericError = new Error('Something went wrong');

    await expect(setup({ error: genericError })).rejects.toThrow(genericError);

    expect(logger.error).toHaveBeenCalledWith(
      { error: genericError, clusterName: 'test-cluster' },
      'Failed to fetch domains for test-cluster'
    );
  });
});

async function setup({
  domainsCount = 2,
  error,
}: {
  domainsCount?: number;
  error?: Error;
}) {
  const mockListDomains = jest.fn();
  const mockGetClusterMethods = jest
    .spyOn(grpcClient, 'getClusterMethods')
    .mockResolvedValue({
      ...mockGrpcClusterMethods,
      listDomains: mockListDomains,
    });

  const mockFilterIrrelevantDomains = jest
    .spyOn(filterIrrelevantDomainsModule, 'default')
    .mockImplementation((_clusterName, domains) => domains);

  if (error) {
    mockListDomains.mockRejectedValue(error);
  } else {
    mockListDomains.mockResolvedValue({
      domains: Array.from({ length: domainsCount }, (_, i) =>
        getDomainObj({ id: `domain-${i + 1}`, name: `Domain ${i + 1}` })
      ),
    });
  }

  const result = await getDomainsForCluster('test-cluster', 1000);

  return {
    result,
    mockListDomains,
    mockGetClusterMethods,
    mockFilterIrrelevantDomains,
  };
}
