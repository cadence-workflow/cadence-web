import * as grpc from '@grpc/grpc-js';

import { type ClustersConfigs } from '@/config/dynamic/resolvers/clusters.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import * as getConfigValueModule from '@/utils/config/get-config-value';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { GRPCError } from '@/utils/grpc/grpc-error';

import { getDomainObj } from '../../__fixtures__/domains';
import { getAllDomains } from '../get-all-domains';
import * as getUniqueDomainsModule from '../get-unique-domains';

jest.mock('react', () => ({
  cache: (fn: unknown) => fn,
}));
jest.mock('@/utils/config/get-config-value');
jest.mock('@/utils/grpc/grpc-client');
jest.mock('../get-unique-domains');

describe(getAllDomains.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches domains from all clusters and returns unique domains', async () => {
    const {
      result,
      mockGetClusterMethods,
      listDomainsByCluster,
      mockGetUniqueDomains,
    } = await setup({
      clustersConfigs: mockResolvedConfigValues.CLUSTERS,
      domainsPerCluster: {
        'mock-cluster1': [
          getDomainObj({
            id: 'domain-1',
            name: 'Domain 1',
            clusters: [{ clusterName: 'mock-cluster1' }],
          }),
        ],
        'mock-cluster2': [
          getDomainObj({
            id: 'domain-2',
            name: 'Domain 2',
            clusters: [{ clusterName: 'mock-cluster2' }],
          }),
        ],
      },
    });

    expect(mockGetClusterMethods).toHaveBeenCalledTimes(2);
    expect(mockGetClusterMethods).toHaveBeenCalledWith(
      'mock-cluster1',
      undefined
    );
    expect(mockGetClusterMethods).toHaveBeenCalledWith(
      'mock-cluster2',
      undefined
    );
    expect(listDomainsByCluster['mock-cluster1']).toHaveBeenCalledWith({
      pageSize: 2000,
    });
    expect(listDomainsByCluster['mock-cluster2']).toHaveBeenCalledWith({
      pageSize: 2000,
    });
    expect(mockGetUniqueDomains).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'domain-1' }),
        expect.objectContaining({ id: 'domain-2' }),
      ])
    );
    expect(result.domains).toHaveLength(2);
    expect(result.failedClusters).toEqual([]);
  });

  it('returns failed clusters when some cluster fetches fail', async () => {
    const { result } = await setup({
      clustersConfigs: mockResolvedConfigValues.CLUSTERS,
      domainsPerCluster: {
        'mock-cluster1': [
          getDomainObj({
            id: 'domain-1',
            name: 'Domain 1',
            clusters: [{ clusterName: 'mock-cluster1' }],
          }),
        ],
      },
      clusterErrors: {
        'mock-cluster2': new GRPCError('Unavailable', {
          grpcStatusCode: grpc.status.UNAVAILABLE,
        }),
      },
    });

    expect(result.domains).toHaveLength(1);
    expect(result.failedClusters).toEqual([
      { clusterName: 'mock-cluster2', httpStatus: 503 },
    ]);
  });

  it('returns failed clusters without httpStatus when error has no httpStatusCode', async () => {
    const { result } = await setup({
      clustersConfigs: mockResolvedConfigValues.CLUSTERS,
      domainsPerCluster: {
        'mock-cluster1': [
          getDomainObj({
            id: 'domain-1',
            name: 'Domain 1',
            clusters: [{ clusterName: 'mock-cluster1' }],
          }),
        ],
      },
      clusterErrors: {
        'mock-cluster2': new Error('Connection failed'),
      },
    });

    expect(result.domains).toHaveLength(1);
    expect(result.failedClusters).toEqual([
      { clusterName: 'mock-cluster2', httpStatus: undefined },
    ]);
  });

  it('returns all clusters as failed when all fetches fail', async () => {
    const { result } = await setup({
      clustersConfigs: mockResolvedConfigValues.CLUSTERS,
      domainsPerCluster: {},
      clusterErrors: {
        'mock-cluster1': new GRPCError('Not found', {
          grpcStatusCode: grpc.status.NOT_FOUND,
        }),
        'mock-cluster2': new GRPCError('Unavailable', {
          grpcStatusCode: grpc.status.UNAVAILABLE,
        }),
      },
    });

    expect(result.domains).toEqual([]);
    expect(result.failedClusters).toEqual([
      { clusterName: 'mock-cluster1', httpStatus: 404 },
      { clusterName: 'mock-cluster2', httpStatus: 503 },
    ]);
  });

  it('returns empty domains and failedClusters when no clusters are configured', async () => {
    const { result } = await setup({
      clustersConfigs: [],
      domainsPerCluster: {},
    });

    expect(result.domains).toEqual([]);
    expect(result.failedClusters).toEqual([]);
  });
});

type DomainData = ReturnType<typeof getDomainObj>;
type SetupResult = {
  result: Awaited<ReturnType<typeof getAllDomains>>;
  mockGetClusterMethods: jest.SpyInstance;
  listDomainsByCluster: Record<string, jest.Mock>;
  mockGetUniqueDomains: jest.SpyInstance;
};

async function setup({
  clustersConfigs,
  domainsPerCluster,
  clusterErrors = {},
}: {
  clustersConfigs: ClustersConfigs;
  domainsPerCluster: Record<string, DomainData[]>;
  clusterErrors?: Record<string, Error | GRPCError>;
}): Promise<SetupResult> {
  jest
    .spyOn(getConfigValueModule, 'default')
    .mockResolvedValue(clustersConfigs);

  const listDomainsByCluster: Record<string, jest.Mock> = {};
  const mockGetClusterMethods = jest
    .spyOn(grpcClient, 'getClusterMethods')
    .mockImplementation(async (clusterName: string) => {
      const listDomains = jest.fn(async () => {
        if (clusterErrors[clusterName]) {
          throw clusterErrors[clusterName];
        }
        return {
          domains: domainsPerCluster[clusterName] ?? [],
        };
      });
      listDomainsByCluster[clusterName] = listDomains;
      return { listDomains } as any;
    });

  const mockGetUniqueDomains = jest
    .spyOn(getUniqueDomainsModule, 'default')
    .mockImplementation((domains) => domains);

  const result = await getAllDomains({
    authEnabled: false,
    groups: [],
    isAdmin: false,
  });

  return {
    result,
    mockGetClusterMethods,
    listDomainsByCluster,
    mockGetUniqueDomains,
  };
}
