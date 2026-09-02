import React, { Suspense } from 'react';

import { HttpResponse, type HttpResponseResolver } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import type { HttpEndpointMock } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import { getDomainObj } from '../__fixtures__/domains';
import DomainsPage from '../domains-page';
import { type Props as ErrorBannerProps } from '../domains-page-error-banner/domains-page-error-banner.types';
import { type Props as DomainsTableProps } from '../domains-table/domains-table.types';

jest.mock('../domains-page-title/domains-page-title', () =>
  jest.fn(({ countBadge }: { countBadge: React.ReactNode }) => (
    <div data-testid="mock-title">{countBadge}</div>
  ))
);

jest.mock('../domains-page-title-badge/domains-page-title-badge', () =>
  jest.fn(({ content }: { content: string | number }) => (
    <span data-testid="mock-badge">{content}</span>
  ))
);

jest.mock('../domains-page-filters/domains-page-filters', () =>
  jest.fn(() => <div data-testid="mock-filters" />)
);

jest.mock('../domains-page-error-banner/domains-page-error-banner', () =>
  jest.fn(({ failedClusters }: ErrorBannerProps) => {
    if (failedClusters.length === 0) return null;
    return (
      <div data-testid="mock-error-banner">
        {failedClusters.map((fc) => fc.clusterName).join(', ')}
      </div>
    );
  })
);

jest.mock('../domains-table/domains-table', () =>
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

describe(DomainsPage.name, () => {
  it('renders domains from all clusters', async () => {
    setup({});

    await waitFor(() => {
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
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
      expect(screen.getByTestId('mock-badge')).toHaveTextContent('3');
    });
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
    });

    expect(screen.getByTestId('mock-badge')).toHaveTextContent('2');
  });

  it('shows error banner for all clusters when all fail', async () => {
    const errorResolver = () =>
      HttpResponse.json({ error: 'Server error' }, { status: 500 });

    setup({
      clusterAResolver: errorResolver,
      clusterBResolver: errorResolver,
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-error-banner')).toBeInTheDocument();
    });

    expect(screen.getByTestId('mock-error-banner')).toHaveTextContent(
      'cluster-a'
    );
    expect(screen.getByTestId('mock-error-banner')).toHaveTextContent(
      'cluster-b'
    );
    expect(screen.getByTestId('mock-badge')).toHaveTextContent('0');
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
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('domain-item')).toHaveLength(1);
    expect(screen.getByTestId('mock-badge')).toHaveTextContent('1');
  });
});

function setup({
  clusterADomains = mockClusterA,
  clusterBDomains = mockClusterB,
  clusterAResolver,
  clusterBResolver,
}: {
  clusterADomains?: typeof mockClusterA;
  clusterBDomains?: typeof mockClusterB;
  clusterAResolver?: HttpResponseResolver;
  clusterBResolver?: HttpResponseResolver;
}) {
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
      <DomainsPage />
    </Suspense>,
    { endpointsMocks }
  );
}
