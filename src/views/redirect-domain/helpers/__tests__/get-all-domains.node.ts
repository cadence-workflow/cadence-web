import { type ClustersConfigs } from '@/config/dynamic/resolvers/clusters.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import * as getConfigValueModule from '@/utils/config/get-config-value';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import * as requestModule from '@/utils/request';
import { RequestError } from '@/utils/request/request-error';
import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';
import { type DomainData } from '@/views/domains-page/domains-page.types';

import { getAllDomains } from '../get-all-domains';

jest.mock('@/utils/config/get-config-value');
jest.mock('@/utils/request');
jest.mock('@/utils/logger');

describe(getAllDomains.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches domains from all configured clusters', async () => {
    const { result, mockRequest } = await setup({
      domainsPerCluster: {
        'mock-cluster1': [getDomainObj({ id: 'domain-1', name: 'Domain 1' })],
        'mock-cluster2': [getDomainObj({ id: 'domain-2', name: 'Domain 2' })],
      },
    });

    expect(mockRequest).toHaveBeenCalledWith(
      '/api/clusters/mock-cluster1/domains'
    );
    expect(mockRequest).toHaveBeenCalledWith(
      '/api/clusters/mock-cluster2/domains'
    );
    expect(result.domains).toEqual([
      expect.objectContaining({ id: 'domain-1' }),
      expect.objectContaining({ id: 'domain-2' }),
    ]);
  });

  it('deduplicates domains that appear in multiple clusters', async () => {
    const sharedDomain = getDomainObj({
      id: 'shared-domain',
      name: 'Shared Domain',
    });

    const { result } = await setup({
      domainsPerCluster: {
        'mock-cluster1': [sharedDomain],
        'mock-cluster2': [sharedDomain],
      },
    });

    expect(result.domains).toEqual([
      expect.objectContaining({ id: 'shared-domain' }),
    ]);
  });

  it('logs an error and skips clusters that fail to fetch', async () => {
    const requestError = new RequestError(
      'Unavailable',
      '/api/clusters/mock-cluster2/domains',
      500
    );

    const { result } = await setup({
      domainsPerCluster: {
        'mock-cluster1': [getDomainObj({ id: 'domain-1', name: 'Domain 1' })],
      },
      clusterErrors: {
        'mock-cluster2': requestError,
      },
    });

    expect(result.domains).toEqual([
      expect.objectContaining({ id: 'domain-1' }),
    ]);
    expect(logger.error).toHaveBeenCalledWith(
      { error: requestError, clusterName: 'mock-cluster2' },
      'Failed to fetch domains for mock-cluster2'
    );
  });

  it('includes the error message when a cluster fails with a GRPCError', async () => {
    const grpcError = new GRPCError('Unavailable');

    const { result } = await setup({
      clusterErrors: {
        'mock-cluster1': grpcError,
        'mock-cluster2': grpcError,
      },
    });

    expect(result.domains).toEqual([]);
    expect(logger.error).toHaveBeenCalledWith(
      { error: grpcError, clusterName: 'mock-cluster1' },
      'Failed to fetch domains for mock-cluster1: Unavailable'
    );
  });

  it('returns empty domains when no clusters are configured', async () => {
    const { result, mockRequest } = await setup({
      clustersConfigs: [],
    });

    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.domains).toEqual([]);
  });
});

async function setup({
  clustersConfigs = mockResolvedConfigValues.CLUSTERS,
  domainsPerCluster = {},
  clusterErrors = {},
}: {
  clustersConfigs?: ClustersConfigs;
  domainsPerCluster?: Record<string, DomainData[]>;
  clusterErrors?: Record<string, Error>;
}) {
  jest
    .spyOn(getConfigValueModule, 'default')
    .mockResolvedValue(clustersConfigs);

  // TODO: @adhitya.mamallan - This is not type-safe, explore using a library such as nock or msw
  const mockRequest = (
    jest.spyOn(requestModule, 'default') as jest.Mock
  ).mockImplementation(async (url: string) => {
    const clusterName = decodeURIComponent(
      url.match(/^\/api\/clusters\/([^/]+)\/domains$/)?.[1] ?? ''
    );

    if (clusterErrors[clusterName]) {
      throw clusterErrors[clusterName];
    }

    return {
      json: async () => ({
        domains: domainsPerCluster[clusterName] ?? [],
        nextPageToken: '',
      }),
    };
  });

  const result = await getAllDomains();

  return { result, mockRequest };
}
