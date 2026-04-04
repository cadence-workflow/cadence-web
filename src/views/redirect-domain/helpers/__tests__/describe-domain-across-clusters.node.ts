import * as grpc from '@grpc/grpc-js';

import { type ClustersConfigs } from '@/config/dynamic/resolvers/clusters.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import * as getConfigValueModule from '@/utils/config/get-config-value';
import { type GRPCClusterMethods } from '@/utils/grpc/grpc-client';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { GRPCError } from '@/utils/grpc/grpc-error';

import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';

import describeDomainAcrossClusters from '../describe-domain-across-clusters';

jest.mock('@/utils/config/get-config-value');
jest.mock('@/utils/grpc/grpc-client');

describe(describeDomainAcrossClusters.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns domain when found on a single cluster', async () => {
    const domain = getDomainObj({
      id: 'domain-1',
      name: 'test-domain',
      activeClusterName: 'mock-cluster1',
    });

    const { result } = await setup({
      domainName: 'test-domain',
      clusterResponses: {
        'mock-cluster1': { domain },
        'mock-cluster2': {
          error: new GRPCError('Domain not found', {
            grpcStatusCode: grpc.status.NOT_FOUND,
          }),
        },
      },
    });

    expect(result.domains).toHaveLength(1);
    expect(result.domains[0]).toEqual(domain);
    expect(result.hasPermissionDenied).toBe(false);
  });

  it('deduplicates domains found on multiple clusters by ID', async () => {
    const domain = getDomainObj({
      id: 'domain-1',
      name: 'test-domain',
      activeClusterName: 'mock-cluster1',
    });

    const { result } = await setup({
      domainName: 'test-domain',
      clusterResponses: {
        'mock-cluster1': { domain },
        'mock-cluster2': { domain },
      },
    });

    expect(result.domains).toHaveLength(1);
    expect(result.domains[0]).toEqual(domain);
  });

  it('returns multiple unique domains when different clusters have different domains with the same name', async () => {
    const domain1 = getDomainObj({
      id: 'domain-1',
      name: 'shared-name',
      activeClusterName: 'mock-cluster1',
    });
    const domain2 = getDomainObj({
      id: 'domain-2',
      name: 'shared-name',
      activeClusterName: 'mock-cluster2',
    });

    const { result } = await setup({
      domainName: 'shared-name',
      clusterResponses: {
        'mock-cluster1': { domain: domain1 },
        'mock-cluster2': { domain: domain2 },
      },
    });

    expect(result.domains).toHaveLength(2);
  });

  it('sets hasPermissionDenied when at least one cluster returns PERMISSION_DENIED', async () => {
    const { result } = await setup({
      domainName: 'test-domain',
      clusterResponses: {
        'mock-cluster1': {
          error: new GRPCError('Permission denied', {
            grpcStatusCode: grpc.status.PERMISSION_DENIED,
          }),
        },
        'mock-cluster2': {
          error: new GRPCError('Domain not found', {
            grpcStatusCode: grpc.status.NOT_FOUND,
          }),
        },
      },
    });

    expect(result.domains).toHaveLength(0);
    expect(result.hasPermissionDenied).toBe(true);
  });

  it('returns empty domains when all clusters return NOT_FOUND', async () => {
    const { result } = await setup({
      domainName: 'nonexistent-domain',
      clusterResponses: {
        'mock-cluster1': {
          error: new GRPCError('Domain not found', {
            grpcStatusCode: grpc.status.NOT_FOUND,
          }),
        },
        'mock-cluster2': {
          error: new GRPCError('Domain not found', {
            grpcStatusCode: grpc.status.NOT_FOUND,
          }),
        },
      },
    });

    expect(result.domains).toHaveLength(0);
    expect(result.hasPermissionDenied).toBe(false);
  });

  it('returns found domain even when some clusters return PERMISSION_DENIED', async () => {
    const domain = getDomainObj({
      id: 'domain-1',
      name: 'test-domain',
      activeClusterName: 'mock-cluster1',
    });

    const { result } = await setup({
      domainName: 'test-domain',
      clusterResponses: {
        'mock-cluster1': { domain },
        'mock-cluster2': {
          error: new GRPCError('Permission denied', {
            grpcStatusCode: grpc.status.PERMISSION_DENIED,
          }),
        },
      },
    });

    expect(result.domains).toHaveLength(1);
    expect(result.domains[0]).toEqual(domain);
    expect(result.hasPermissionDenied).toBe(true);
  });

  it('returns empty result when no clusters are configured', async () => {
    const { result } = await setup({
      domainName: 'test-domain',
      clustersConfigs: [],
      clusterResponses: {},
    });

    expect(result.domains).toHaveLength(0);
    expect(result.hasPermissionDenied).toBe(false);
  });
});

type DomainData = ReturnType<typeof getDomainObj>;

async function setup({
  domainName,
  clustersConfigs = mockResolvedConfigValues.CLUSTERS,
  clusterResponses,
}: {
  domainName: string;
  clustersConfigs?: ClustersConfigs;
  clusterResponses: Record<
    string,
    { domain: DomainData } | { error: Error | GRPCError }
  >;
}) {
  jest
    .spyOn(getConfigValueModule, 'default')
    .mockResolvedValue(clustersConfigs);

  jest
    .spyOn(grpcClient, 'getClusterMethods')
    .mockImplementation(async (clusterName: string) => {
      const response = clusterResponses[clusterName];

      return {
        describeDomain: jest.fn().mockImplementation(async () => {
          if (response && 'error' in response) {
            throw response.error;
          }
          return { domain: response?.domain ?? null };
        }),
      } as unknown as GRPCClusterMethods;
    });

  const result = await describeDomainAcrossClusters(domainName);

  return { result };
}
