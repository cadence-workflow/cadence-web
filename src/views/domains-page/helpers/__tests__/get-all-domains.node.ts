import * as grpc from '@grpc/grpc-js';

import * as getConfigValueModule from '@/utils/config/get-config-value';
import { GRPCError } from '@/utils/grpc/grpc-error';

import { getDomainObj } from '../../__fixtures__/domains';
import { getAllDomains } from '../get-all-domains';
import * as getDomainsForClusterModule from '../get-domains-for-cluster';
import * as getUniqueDomainsModule from '../get-unique-domains';

jest.mock('@/utils/config/get-config-value');
jest.mock('../get-domains-for-cluster');
jest.mock('../get-unique-domains');

describe(getAllDomains.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches domains from all clusters and returns unique domains', async () => {
    const { result, mockGetDomainsForCluster, mockGetUniqueDomains } =
      await setup({
        clusterConfigs: [
          { clusterName: 'cluster-1' },
          { clusterName: 'cluster-2' },
        ],
        domainsPerCluster: {
          'cluster-1': [getDomainObj({ id: 'domain-1', name: 'Domain 1' })],
          'cluster-2': [getDomainObj({ id: 'domain-2', name: 'Domain 2' })],
        },
      });

    expect(mockGetDomainsForCluster).toHaveBeenCalledTimes(2);
    expect(mockGetDomainsForCluster).toHaveBeenCalledWith('cluster-1', 2000);
    expect(mockGetDomainsForCluster).toHaveBeenCalledWith('cluster-2', 2000);
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
      clusterConfigs: [
        { clusterName: 'cluster-1' },
        { clusterName: 'cluster-2' },
      ],
      domainsPerCluster: {
        'cluster-1': [getDomainObj({ id: 'domain-1', name: 'Domain 1' })],
      },
      clusterErrors: {
        'cluster-2': new GRPCError('Unavailable', {
          grpcStatusCode: grpc.status.UNAVAILABLE,
        }),
      },
    });

    expect(result.domains).toHaveLength(1);
    expect(result.failedClusters).toEqual([
      { clusterName: 'cluster-2', httpStatus: 503 },
    ]);
  });

  it('returns failed clusters without httpStatus when error has no httpStatusCode', async () => {
    const { result } = await setup({
      clusterConfigs: [
        { clusterName: 'cluster-1' },
        { clusterName: 'cluster-2' },
      ],
      domainsPerCluster: {
        'cluster-1': [getDomainObj({ id: 'domain-1', name: 'Domain 1' })],
      },
      clusterErrors: {
        'cluster-2': new Error('Connection failed'),
      },
    });

    expect(result.domains).toHaveLength(1);
    expect(result.failedClusters).toEqual([
      { clusterName: 'cluster-2', httpStatus: undefined },
    ]);
  });

  it('returns all clusters as failed when all fetches fail', async () => {
    const { result } = await setup({
      clusterConfigs: [
        { clusterName: 'cluster-1' },
        { clusterName: 'cluster-2' },
      ],
      domainsPerCluster: {},
      clusterErrors: {
        'cluster-1': new GRPCError('Not found', {
          grpcStatusCode: grpc.status.NOT_FOUND,
        }),
        'cluster-2': new GRPCError('Unavailable', {
          grpcStatusCode: grpc.status.UNAVAILABLE,
        }),
      },
    });

    expect(result.domains).toEqual([]);
    expect(result.failedClusters).toEqual([
      { clusterName: 'cluster-1', httpStatus: 404 },
      { clusterName: 'cluster-2', httpStatus: 503 },
    ]);
  });

  it('returns empty domains and failedClusters when no clusters are configured', async () => {
    const { result } = await setup({
      clusterConfigs: [],
      domainsPerCluster: {},
    });

    expect(result.domains).toEqual([]);
    expect(result.failedClusters).toEqual([]);
  });
});

type DomainData = ReturnType<typeof getDomainObj>;

async function setup({
  clusterConfigs,
  domainsPerCluster,
  clusterErrors = {},
}: {
  clusterConfigs: Array<{ clusterName: string }>;
  domainsPerCluster: Record<string, DomainData[]>;
  clusterErrors?: Record<string, Error | GRPCError>;
}) {
  jest.spyOn(getConfigValueModule, 'default').mockResolvedValue(clusterConfigs);

  const mockGetDomainsForCluster = jest
    .spyOn(getDomainsForClusterModule, 'default')
    .mockImplementation(async (clusterName: string) => {
      if (clusterErrors[clusterName]) {
        throw clusterErrors[clusterName];
      }
      return domainsPerCluster[clusterName] ?? [];
    });

  const mockGetUniqueDomains = jest
    .spyOn(getUniqueDomainsModule, 'default')
    .mockImplementation((domains) => domains);

  const result = await getAllDomains();

  return {
    result,
    mockGetDomainsForCluster,
    mockGetUniqueDomains,
  };
}
