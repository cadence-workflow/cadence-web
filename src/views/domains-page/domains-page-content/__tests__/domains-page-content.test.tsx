import React, { Suspense } from 'react';

import { HttpResponse, type HttpResponseResolver } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import type { HttpEndpointMock } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import { getDomainObj } from '../../__fixtures__/domains';
import { mockDomainsPageQueryParamsValues } from '../../__fixtures__/domains-page-query-params';
import type domainsPageQueryParamsConfig from '../../config/domains-page-query-params.config';
import DomainsPageContextProvider from '../../domains-page-context-provider/domains-page-context-provider';
import { type Props as ErrorBannerProps } from '../../domains-page-error-banner/domains-page-error-banner.types';
import { type Props as BadgeProps } from '../../domains-page-title-badge/domains-page-title-badge.types';
import { type Props as DomainsTableProps } from '../../domains-table/domains-table.types';
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
  jest.fn(({ domains, isLoading, hasNextPage }: DomainsTableProps) => {
    if (isLoading) return <div data-testid="mock-table-loading" />;
    return (
      <div data-testid="mock-table">
        <span data-testid="domain-count">{domains.length}</span>
        <span data-testid="has-next-page">{String(hasNextPage)}</span>
        <ul>
          {domains.map((d) => (
            <li key={d.id} data-testid="domain-item">
              {d.name}
            </li>
          ))}
        </ul>
      </div>
    );
  })
);

const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

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
  it('renders domains from all clusters', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getAllByTestId('domain-item')).toHaveLength(3);
    });

    const items = screen.getAllByTestId('domain-item');
    const names = items.map((el) => el.textContent);
    expect(names).toContain('alpha-domain');
    expect(names).toContain('bravo-domain');
    expect(names).toContain('charlie-domain');
  });

  it('shows domain count in the title badge', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getByTestId('badge-count')).toHaveTextContent('3');
    });
    expect(screen.getByTestId('badge-total')).toHaveTextContent('3');
  });

  it('renders filters', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getByTestId('mock-filters')).toBeInTheDocument();
    });
  });

  it('shows error banner when a cluster fails', async () => {
    setup({
      clusterBResolver: () =>
        HttpResponse.json(
          { error: 'Server error', cluster: 'cluster-b' },
          { status: 503 }
        ),
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-error-banner')).toHaveTextContent(
        'cluster-b'
      );
      expect(screen.getByTestId('badge-count')).toHaveTextContent('2');
    });
    expect(screen.getByTestId('badge-total')).toHaveTextContent('2');
  });

  it('shows error banner for all clusters when all fail', async () => {
    const errorResolver = () =>
      HttpResponse.json({ error: 'Server error' }, { status: 500 });

    setup({
      clusterAResolver: errorResolver,
      clusterBResolver: errorResolver,
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-error-banner')).toHaveTextContent(
        'cluster-a, cluster-b'
      );
    });

    expect(screen.getByTestId('badge-count')).toHaveTextContent('0');
    expect(screen.getByTestId('badge-total')).toHaveTextContent('0');
  });

  it('deduplicates domains that appear in multiple clusters', async () => {
    const sharedDomain = getDomainObj({
      id: '1',
      name: 'shared-domain',
      activeClusterName: 'cluster-a',
    });

    setup({
      clusterADomains: [sharedDomain],
      clusterBDomains: [sharedDomain],
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('domain-item')).toHaveLength(1);
    });

    expect(screen.getByTestId('badge-count')).toHaveTextContent('1');
    expect(screen.getByTestId('badge-total')).toHaveTextContent('1');
  });

  it('narrows the count when a search term is applied without changing the total', async () => {
    setup({ queryParams: { searchText: 'alpha' } });

    await waitFor(() => {
      expect(screen.getByTestId('domain-count')).toHaveTextContent('1');
    });

    expect(screen.getByTestId('badge-count')).toHaveTextContent('1');
    expect(screen.getByTestId('badge-total')).toHaveTextContent('3');
  });

  describe('deprecated domains scope', () => {
    const clusterADomainsWithDeprecated = [
      ...mockClusterA,
      getDomainObj({
        id: '4',
        name: 'delta-domain',
        activeClusterName: 'cluster-a',
        status: 'DOMAIN_STATUS_DEPRECATED',
      }),
    ];

    it('excludes deprecated domains from the total by default', async () => {
      setup({ clusterADomains: clusterADomainsWithDeprecated });

      await waitFor(() => {
        expect(screen.getByTestId('badge-total')).toHaveTextContent('3');
      });
      expect(screen.getByTestId('badge-count')).toHaveTextContent('3');
    });

    it('includes deprecated domains in the total once the toggle is on', async () => {
      setup({
        clusterADomains: clusterADomainsWithDeprecated,
        queryParams: { showDeprecated: true },
      });

      await waitFor(() => {
        expect(screen.getByTestId('badge-total')).toHaveTextContent('4');
      });
      expect(screen.getByTestId('badge-count')).toHaveTextContent('4');
    });

    it('narrows the count by search while the total still includes deprecated domains', async () => {
      setup({
        clusterADomains: clusterADomainsWithDeprecated,
        queryParams: { showDeprecated: true, searchText: 'delta' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('badge-total')).toHaveTextContent('4');
      });
      expect(screen.getByTestId('badge-count')).toHaveTextContent('1');
    });
  });

  it('shows hasNextPage as true while a next page is still pending', async () => {
    const clusterAResolver: HttpResponseResolver = ({ request }) => {
      const nextPage = new URL(request.url).searchParams.get('nextPage');

      if (!nextPage) {
        return HttpResponse.json({
          domains: [mockClusterA[0]],
          nextPage: 'page-2',
        } satisfies ListDomainsResponse);
      }

      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    };

    setup({ clusterAResolver });

    await waitFor(() => {
      expect(screen.getByTestId('badge-has-next-page')).toHaveTextContent(
        'true'
      );
    });
  });
});

function setup({
  clusterADomains = mockClusterA,
  clusterBDomains = mockClusterB,
  clusterAResolver,
  clusterBResolver,
  queryParams,
}: {
  clusterADomains?: typeof mockClusterA;
  clusterBDomains?: typeof mockClusterB;
  clusterAResolver?: HttpResponseResolver;
  clusterBResolver?: HttpResponseResolver;
  queryParams?: Partial<
    PageQueryParamValues<typeof domainsPageQueryParamsConfig>
  >;
}) {
  mockUsePageQueryParams.mockReturnValue([
    { ...mockDomainsPageQueryParamsValues, ...queryParams },
    jest.fn(),
  ]);

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
        : { jsonResponse: { domains: clusterADomains, nextPage: '' } }),
    },
    {
      path: '/api/clusters/cluster-b/domains',
      httpMethod: 'GET',
      mockOnce: false,
      ...(clusterBResolver
        ? { httpResolver: clusterBResolver }
        : { jsonResponse: { domains: clusterBDomains, nextPage: '' } }),
    },
  ];

  render(
    <Suspense fallback={<div>Loading...</div>}>
      <DomainsPageContextProvider>
        <DomainsPageContent />
      </DomainsPageContextProvider>
    </Suspense>,
    { endpointsMocks }
  );
}
