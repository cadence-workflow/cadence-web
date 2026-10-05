import React, { Suspense } from 'react';

import { HttpResponse, type HttpResponseResolver } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import type { HttpEndpointMock } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import { getDomainObj } from '../../__fixtures__/domains';
import { type Props as ErrorBannerProps } from '../../domains-page-error-banner/domains-page-error-banner.types';
import { type Props as BadgeProps } from '../../domains-page-title-badge/domains-page-title-badge.types';
import {
  type DomainData,
  type FilteredDomains,
} from '../../domains-page.types';
import { type Props as DomainsTableProps } from '../../domains-table/domains-table.types';
import useFilteredDomains from '../../hooks/use-filtered-domains';
import DomainsPageContent from '../domains-page-content';

jest.mock('../../domains-page-title/domains-page-title', () =>
  jest.fn(({ countBadge }: { countBadge: React.ReactNode }) => (
    <div data-testid="mock-title">{countBadge}</div>
  ))
);

jest.mock('../../domains-page-title-badge/domains-page-title-badge', () =>
  jest.fn(({ count, totalCount, hasNextPage, isLoading }: BadgeProps) => (
    <div data-testid="mock-badge">
      {isLoading && <span data-testid="badge-loading" />}
      <span data-testid="badge-count">{count}</span>
      <span data-testid="badge-total">{totalCount}</span>
      <span data-testid="badge-has-next-page">{String(hasNextPage)}</span>
    </div>
  ))
);

jest.mock('../../domains-page-filters/domains-page-filters', () =>
  jest.fn(() => <div data-testid="mock-filters" />)
);

jest.mock('../../domains-page-error-banner/domains-page-error-banner', () =>
  jest.fn(({ failedClusters }: ErrorBannerProps) => {
    if (failedClusters.length === 0) return null;
    return (
      <div data-testid="mock-error-banner">
        {failedClusters.map((fc) => fc.clusterName).join(', ')}
      </div>
    );
  })
);

jest.mock('../../domains-table/domains-table', () =>
  jest.fn(
    ({ domains, isLoading, hasNextPage, fetchNextPage }: DomainsTableProps) => {
      if (isLoading) return <div data-testid="mock-table-loading" />;
      return (
        <div data-testid="mock-table">
          <span data-testid="has-next-page">{String(hasNextPage)}</span>
          <ul>
            {domains.map((d) => (
              <li key={d.id} data-testid="domain-item">
                {d.name}
              </li>
            ))}
          </ul>
          <button onClick={fetchNextPage}>fetch next page</button>
        </div>
      );
    }
  )
);

jest.mock('../../hooks/use-filtered-domains', () => jest.fn());

const mockUseFilteredDomains = jest.mocked(useFilteredDomains);

const passThroughFilter = (domains: Array<DomainData>): FilteredDomains => ({
  filteredDomains: domains,
  totalCount: domains.length,
});

const mockClusterA = [
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

const mockClusterB = [
  getDomainObj({
    id: '3',
    name: 'bravo-domain',
    activeClusterName: 'cluster-b',
  }),
];

describe(DomainsPageContent.name, () => {
  it('passes the filtered domains to the table', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getAllByTestId('domain-item')).toHaveLength(3);
    });

    const names = screen
      .getAllByTestId('domain-item')
      .map((el) => el.textContent);
    expect(names).toEqual(['alpha-domain', 'bravo-domain', 'charlie-domain']);
  });

  it('derives the filtered domains from the listed domains', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getAllByTestId('domain-item')).toHaveLength(3);
    });

    const lastCallDomains = mockUseFilteredDomains.mock.lastCall?.[0] ?? [];
    expect(lastCallDomains.map((d) => d.name)).toEqual([
      'alpha-domain',
      'bravo-domain',
      'charlie-domain',
    ]);
  });

  it('passes the filtered count and the total count to the title badge', async () => {
    setup({
      filterDomains: (domains) => ({
        filteredDomains: domains.slice(0, 1),
        totalCount: domains.length,
      }),
    });

    await waitFor(() => {
      expect(screen.getByTestId('badge-total')).toHaveTextContent('3');
    });
    expect(screen.getByTestId('badge-count')).toHaveTextContent('1');
    expect(screen.getAllByTestId('domain-item')).toHaveLength(1);
  });

  it('shows the loading state in the badge and the table until domains arrive', async () => {
    let releaseClusterA: () => void = () => {};
    const clusterAGate = new Promise<void>((resolve) => {
      releaseClusterA = resolve;
    });

    setup({
      clusterAResolver: async () => {
        await clusterAGate;
        return HttpResponse.json({
          domains: mockClusterA,
          nextPage: '',
        } satisfies ListDomainsResponse);
      },
    });

    expect(await screen.findByTestId('badge-loading')).toBeInTheDocument();
    expect(screen.getByTestId('mock-table-loading')).toBeInTheDocument();

    releaseClusterA();

    await waitFor(() => {
      expect(screen.getAllByTestId('domain-item')).toHaveLength(3);
    });
    expect(screen.queryByTestId('badge-loading')).not.toBeInTheDocument();
  });

  it('passes hasNextPage to the badge and the table, and wires fetchNextPage to the table', async () => {
    let clusterACallCount = 0;
    const clusterAResolver: HttpResponseResolver = ({ request }) => {
      clusterACallCount += 1;
      const nextPage = new URL(request.url).searchParams.get('nextPage');

      if (!nextPage) {
        return HttpResponse.json({
          domains: [mockClusterA[0]],
          nextPage: 'page-2',
        } satisfies ListDomainsResponse);
      }

      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    };

    const { user } = setup({ clusterAResolver });

    // Page 1 succeeds and the eager load of page 2 fails, so a next page is
    // still pending and no further requests are made automatically.
    await waitFor(() => {
      expect(clusterACallCount).toBe(2);
    });
    expect(screen.getByTestId('badge-has-next-page')).toHaveTextContent('true');
    expect(screen.getByTestId('has-next-page')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'fetch next page' }));

    await waitFor(() => {
      expect(clusterACallCount).toBe(3);
    });
  });

  it('passes failed clusters to the error banner', async () => {
    setup({
      clusterBResolver: () =>
        HttpResponse.json(
          { message: 'Server error', cluster: 'cluster-b' },
          { status: 503 }
        ),
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-error-banner')).toHaveTextContent(
        'cluster-b'
      );
    });
    expect(screen.getAllByTestId('domain-item')).toHaveLength(2);
  });

  it('does not render the error banner when every cluster loads', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getAllByTestId('domain-item')).toHaveLength(3);
    });
    expect(screen.queryByTestId('mock-error-banner')).not.toBeInTheDocument();
  });

  it('renders the filters', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getByTestId('mock-filters')).toBeInTheDocument();
    });
  });
});

function setup({
  clusterADomains = mockClusterA,
  clusterBDomains = mockClusterB,
  clusterAResolver,
  clusterBResolver,
  filterDomains = passThroughFilter,
}: {
  clusterADomains?: typeof mockClusterA;
  clusterBDomains?: typeof mockClusterB;
  clusterAResolver?: HttpResponseResolver;
  clusterBResolver?: HttpResponseResolver;
  filterDomains?: typeof useFilteredDomains;
}) {
  const user = userEvent.setup();
  mockUseFilteredDomains.mockImplementation(filterDomains);

  const endpointsMocks: HttpEndpointMock[] = [
    {
      path: '/api/config',
      httpMethod: 'GET',
      mockOnce: false,
      jsonResponse: [
        { clusterName: 'cluster-a' },
        { clusterName: 'cluster-b' },
      ],
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

  render(
    <Suspense fallback={<div>Loading...</div>}>
      <DomainsPageContent />
    </Suspense>,
    { endpointsMocks }
  );

  return { user };
}
