import React, { Suspense } from 'react';

import {
  HttpResponse,
  type HttpResponseResolver,
  type StrictResponse,
} from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

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
      expect(result.current.data.length).toBe(2);
    });
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

  it('keeps eagerly loading healthy clusters when another cluster fails its initial load', async () => {
    const pages = ['page-2', 'page-3', ''];
    let clusterACallCount = 0;
    const clusterAResolver: HttpResponseResolver = ({ request }) => {
      const pageIndex = clusterACallCount;
      clusterACallCount += 1;
      const nextPage = new URL(request.url).searchParams.get('nextPage');

      return HttpResponse.json({
        domains: [
          getDomainObj({
            id: `a-${pageIndex}`,
            name: `cluster-a-domain-${pageIndex}`,
            activeClusterName: 'cluster-a',
          }),
        ],
        // page N carries the token for page N+1; last page carries ''
        nextPage:
          nextPage === null ? pages[0] : pages[pages.indexOf(nextPage) + 1],
      } satisfies ListDomainsResponse);
    };

    const { result } = setup({
      clusterAResolver,
      clusterBResolver: () =>
        HttpResponse.json({ message: 'Server error' }, { status: 503 }),
    });

    await waitFor(() => {
      expect(result.current.data.length).toBe(3);
      expect(result.current.failedClusters).toEqual([
        { clusterName: 'cluster-b', httpStatus: 503 },
      ]);
    });

    expect(clusterACallCount).toBe(3);
    expect(result.current.hasNextPage).toBe(false);

    // Settle window: confirm the dead cluster is not re-fetched.
    await act(() => new Promise((r) => setTimeout(r, 200)));
    expect(clusterACallCount).toBe(3);
  });

  it('stops eager loading after a next-page error (does not loop)', async () => {
    let callCount = 0;
    const clusterAResolver: HttpResponseResolver = ({ request }) => {
      callCount += 1;
      const nextPage = new URL(request.url).searchParams.get('nextPage');

      if (!nextPage) {
        return HttpResponse.json({
          domains: [mockDomainsClusterA[0]],
          nextPage: 'page-2',
        } satisfies ListDomainsResponse);
      }

      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    };

    const { result } = setup({ clusterAResolver });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(callCount).toBe(2);

    // Give the effect a chance to loop before asserting it settled.
    await act(() => new Promise((r) => setTimeout(r, 200)));

    expect(callCount).toBe(2);
    expect(result.current.failedClusters).toEqual([
      { clusterName: 'cluster-a', httpStatus: 500 },
    ]);
    expect(result.current.data.map((d) => d.name)).toContain('alpha-domain');
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
