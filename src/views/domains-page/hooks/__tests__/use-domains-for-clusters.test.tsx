import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';

import { getDomainObj } from '../../__fixtures__/domains';
import useDomainsForClusters from '../use-domains-for-clusters';

// Disable retries so error scenarios don't wait on exponential backoff
jest.mock('../get-domains-for-cluster-query-options', () => {
  const actual = jest.requireActual('../get-domains-for-cluster-query-options');
  return {
    __esModule: true,
    default: (clusterName: string) => ({
      ...actual.default(clusterName),
      retry: false,
    }),
  };
});

const domainInCluster1 = getDomainObj({
  id: 'domain-id-1',
  name: 'domain-1',
  activeClusterName: 'mock-cluster-1',
  clusters: [{ clusterName: 'mock-cluster-1' }],
});

const domainInCluster2 = getDomainObj({
  id: 'domain-id-2',
  name: 'domain-2',
  activeClusterName: 'mock-cluster-2',
  clusters: [{ clusterName: 'mock-cluster-2' }],
});

const domainInBothClusters = getDomainObj({
  id: 'domain-id-shared',
  name: 'domain-shared',
  activeClusterName: 'mock-cluster-1',
  clusters: [
    { clusterName: 'mock-cluster-1' },
    { clusterName: 'mock-cluster-2' },
  ],
});

const domainsPerCluster: Record<string, ListDomainsResponse> = {
  'mock-cluster-1': { domains: [domainInCluster1, domainInBothClusters] },
  'mock-cluster-2': { domains: [domainInCluster2, domainInBothClusters] },
};

describe(useDomainsForClusters.name, () => {
  it('triggers an independent query per cluster and merges unique domains', async () => {
    const { result, getRequestedClusters } = setup({});

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.domains).toHaveLength(3);
    });

    expect(getRequestedClusters().sort()).toEqual([
      'mock-cluster-1',
      'mock-cluster-2',
    ]);

    expect(result.current.domains).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'domain-1' }),
        expect.objectContaining({ name: 'domain-2' }),
        expect.objectContaining({ name: 'domain-shared' }),
      ])
    );
    expect(result.current.failedClusters).toEqual([]);
  });

  it('reports a failed cluster without affecting other clusters', async () => {
    const { result } = setup({ failingClusters: ['mock-cluster-2'] });

    await waitFor(() => {
      expect(result.current.failedClusters).toHaveLength(1);
    });

    expect(result.current.failedClusters).toEqual([
      { clusterName: 'mock-cluster-2', httpStatus: 500 },
    ]);

    await waitFor(() => {
      expect(result.current.domains).toHaveLength(2);
    });

    expect(result.current.domains).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'domain-1' }),
        expect.objectContaining({ name: 'domain-shared' }),
      ])
    );
  });
});

function setup({ failingClusters = [] }: { failingClusters?: Array<string> }) {
  const requestedClusters: Array<string> = [];

  const utils = renderHook(
    () => useDomainsForClusters(['mock-cluster-1', 'mock-cluster-2']),
    {
      endpointsMocks: [
        {
          path: '/api/clusters/:cluster/domains',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ params }) => {
            const cluster = String(params.cluster);

            requestedClusters.push(cluster);

            if (failingClusters.includes(cluster)) {
              return HttpResponse.json(
                { error: 'Something went wrong', cluster },
                { status: 500 }
              );
            }

            return HttpResponse.json(domainsPerCluster[cluster]);
          },
        },
      ],
    }
  );

  return { ...utils, getRequestedClusters: () => requestedClusters };
}
