import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { getDomainObj } from '../../__fixtures__/domains';
import { DomainsPageContext } from '../../domains-page-context-provider/domains-page-context-provider';
import { type DomainsPageContextType } from '../../domains-page-context-provider/domains-page-context-provider.types';
import useDomainsForClusters from '../../hooks/use-domains-for-clusters';
import { type UseDomainsForClustersResult } from '../../hooks/use-domains-for-clusters.types';
import DomainsPageContent from '../domains-page-content';

jest.mock('../../hooks/use-domains-for-clusters', () => jest.fn());

jest.mock(
  '../../domains-page-title/domains-page-title',
  () =>
    function MockDomainsPageTitle({
      countBadge,
    }: {
      countBadge: React.ReactNode;
    }) {
      return <div data-testid="domains-page-title">{countBadge}</div>;
    }
);

jest.mock(
  '../../domains-page-title-badge/domains-page-title-badge',
  () =>
    function MockDomainsPageTitleBadge({ content }: { content: number }) {
      return <div data-testid="domains-count-badge">{content}</div>;
    }
);

jest.mock(
  '../../domains-page-filters/domains-page-filters',
  () =>
    function MockDomainsPageFilters() {
      return <div data-testid="domains-page-filters" />;
    }
);

jest.mock(
  '../../domains-page-error-banner/domains-page-error-banner',
  () =>
    function MockDomainsPageErrorBanner({
      failedClusters,
    }: {
      failedClusters: Array<{ clusterName: string }>;
    }) {
      if (failedClusters.length === 0) return null;
      return (
        <div data-testid="domains-page-error-banner">
          {failedClusters.map(({ clusterName }) => clusterName).join(',')}
        </div>
      );
    }
);

jest.mock(
  '../../domains-table/domains-table',
  () =>
    function MockDomainsTable({ domains }: { domains: Array<unknown> }) {
      return <div data-testid="domains-table">{domains.length}</div>;
    }
);

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () =>
    function MockSectionLoadingIndicator() {
      return <div data-testid="section-loading-indicator" />;
    }
);

const mockUseDomainsForClusters = useDomainsForClusters as jest.MockedFunction<
  typeof useDomainsForClusters
>;

describe(DomainsPageContent.name, () => {
  it('shows a loading indicator while domains are loading', () => {
    setup({
      hookResult: { domains: [], failedClusters: [], isLoading: true },
    });

    expect(screen.getByTestId('section-loading-indicator')).toBeInTheDocument();
    expect(screen.queryByTestId('domains-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('domains-count-badge')).not.toBeInTheDocument();
  });

  it('renders the domains table and count badge once domains are loaded', () => {
    setup({
      hookResult: {
        domains: [
          getDomainObj({ id: 'domain-id-1', name: 'domain-1' }),
          getDomainObj({ id: 'domain-id-2', name: 'domain-2' }),
        ],
        failedClusters: [],
        isLoading: false,
      },
    });

    expect(screen.getByTestId('domains-table')).toHaveTextContent('2');
    expect(screen.getByTestId('domains-count-badge')).toHaveTextContent('2');
    expect(
      screen.queryByTestId('section-loading-indicator')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('domains-page-error-banner')
    ).not.toBeInTheDocument();
  });

  it('passes failed clusters to the error banner while still rendering other domains', () => {
    setup({
      hookResult: {
        domains: [getDomainObj({ id: 'domain-id-1', name: 'domain-1' })],
        failedClusters: [{ clusterName: 'mock-cluster-2', httpStatus: 500 }],
        isLoading: false,
      },
    });

    expect(screen.getByTestId('domains-page-error-banner')).toHaveTextContent(
      'mock-cluster-2'
    );
    expect(screen.getByTestId('domains-table')).toHaveTextContent('1');
  });

  it('requests domains for all configured clusters', () => {
    setup({
      hookResult: { domains: [], failedClusters: [], isLoading: false },
    });

    expect(mockUseDomainsForClusters).toHaveBeenCalledWith([
      'mock-cluster-1',
      'mock-cluster-2',
    ]);
  });
});

function setup({ hookResult }: { hookResult: UseDomainsForClustersResult }) {
  mockUseDomainsForClusters.mockReturnValue(hookResult);

  const contextValue: DomainsPageContextType = {
    pageConfig: {
      CLUSTERS_PUBLIC: [
        { clusterName: 'mock-cluster-1' },
        { clusterName: 'mock-cluster-2' },
      ],
    },
  };

  render(
    <DomainsPageContext.Provider value={contextValue}>
      <DomainsPageContent />
    </DomainsPageContext.Provider>
  );
}
