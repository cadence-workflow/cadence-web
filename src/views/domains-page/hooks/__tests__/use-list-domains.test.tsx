import React, { Suspense } from 'react';

import {
  HttpResponse,
  type HttpResponseResolver,
  type StrictResponse,
} from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import type { HttpEndpointMock } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import { getDomainObj } from '../../__fixtures__/domains';
import useListDomains from '../use-list-domains';

const mockClusters = [
  { clusterName: 'cluster-a' },
  { clusterName: 'cluster-b' },
];

const mockDomainsClusterA = [
  getDomainObj({
    id: '1',
    name: 'alpha-domain',
    activeClusterName: 'cluster-a',
  }),
  getDomainObj({
    id: '2',
    name: 'charlie-domain',
    activeClusterName: 'cluster-a',
  }),
];

const mockDomainsClusterB = [
  getDomainObj({
    id: '3',
    name: 'bravo-domain',
    activeClusterName: 'cluster-b',
  }),
];

describe(useListDomains.name, () => {
  it('returns merged domains from all clusters', async () => {
    const { result } = setup({});

    await waitFor(() => {
      expect(result.current.data.length).toBe(3);
    });

    const names = result.current.data.map((d) => d.name);
    expect(names).toContain('alpha-domain');
    expect(names).toContain('bravo-domain');
    expect(names).toContain('charlie-domain');
    expect(result.current.failedClusters).toEqual([]);
  });

  it('deduplicates domains that appear in multiple clusters', async () => {
    const sharedDomain = getDomainObj({
      id: '1',
      name: 'alpha-domain',
      activeClusterName: 'cluster-a',
    });

    const { result } = setup({
      clusterADomains: [sharedDomain],
      clusterBDomains: [sharedDomain],
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data.length).toBe(1);
  });

  it('reports failed clusters with HTTP status when a request errors', async () => {
    const { result } = setup({
      clusterBResolver: () =>
        HttpResponse.json(
          { message: 'Server error', cluster: 'cluster-b' },
          { status: 503 }
        ),
    });

    await waitFor(() => {
      expect(result.current.failedClusters).toEqual([
        { clusterName: 'cluster-b', httpStatus: 503 },
      ]);
    });

    expect(result.current.data.length).toBe(2);
  });

  it('sets httpStatus to undefined for network failures', async () => {
    const { result } = setup({
      // HttpResponse.error() returns a plain Response (network error), which
      // MSW's resolver type doesn't accept without narrowing
      clusterBResolver: () => HttpResponse.error() as StrictResponse<never>,
    });

    await waitFor(() => {
      expect(result.current.failedClusters).toEqual([
        { clusterName: 'cluster-b', httpStatus: undefined },
      ]);
    });
  });

  it('returns empty data and all failed clusters when all requests fail', async () => {
    const errorResolver: HttpResponseResolver = () =>
      HttpResponse.json({ message: 'Server error' }, { status: 500 });

    const { result } = setup({
      clusterAResolver: errorResolver,
      clusterBResolver: errorResolver,
    });

    await waitFor(() => {
      expect(result.current.failedClusters).toEqual([
        { clusterName: 'cluster-a', httpStatus: 500 },
        { clusterName: 'cluster-b', httpStatus: 500 },
      ]);
    });

    expect(result.current.data).toEqual([]);
  });
});

function setup({
  clusterADomains = mockDomainsClusterA,
  clusterBDomains = mockDomainsClusterB,
  clusterAResolver,
  clusterBResolver,
}: {
  clusterADomains?: typeof mockDomainsClusterA;
  clusterBDomains?: typeof mockDomainsClusterB;
  clusterAResolver?: HttpResponseResolver;
  clusterBResolver?: HttpResponseResolver;
}) {
  const endpointsMocks: HttpEndpointMock[] = [
    {
      path: '/api/config',
      httpMethod: 'GET',
      mockOnce: false,
      jsonResponse: mockClusters,
    },
    {
      path: '/api/clusters/cluster-a/domains',
      httpMethod: 'GET',
      mockOnce: false,
      ...(clusterAResolver
        ? { httpResolver: clusterAResolver }
        : {
            jsonResponse: {
              domains: clusterADomains,
              nextPage: '',
            } satisfies ListDomainsResponse,
          }),
    },
    {
      path: '/api/clusters/cluster-b/domains',
      httpMethod: 'GET',
      mockOnce: false,
      ...(clusterBResolver
        ? { httpResolver: clusterBResolver }
        : {
            jsonResponse: {
              domains: clusterBDomains,
              nextPage: '',
            } satisfies ListDomainsResponse,
          }),
    },
  ];

  return renderHook(
    () => useListDomains(),
    { endpointsMocks },
    {
      wrapper: ({ children }) => <Suspense>{children}</Suspense>,
    }
  );
}
