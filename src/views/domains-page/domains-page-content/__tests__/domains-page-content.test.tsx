import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { getDomainObj } from '../../__fixtures__/domains';
import { type Props as ErrorBannerProps } from '../../domains-page-error-banner/domains-page-error-banner.types';
import { type Props as BadgeProps } from '../../domains-page-title-badge/domains-page-title-badge.types';
import { type FilteredDomains } from '../../domains-page.types';
import { type Props as DomainsTableProps } from '../../domains-table/domains-table.types';
import useFilteredDomains from '../../hooks/use-filtered-domains';
import useListDomains from '../../hooks/use-list-domains';
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

jest.mock('../../hooks/use-list-domains', () => jest.fn());
jest.mock('../../hooks/use-filtered-domains', () => jest.fn());

const mockUseListDomains = jest.mocked(useListDomains);
const mockUseFilteredDomains = jest.mocked(useFilteredDomains);

type ListDomainsResult = ReturnType<typeof useListDomains>;

const mockDomains = [
  getDomainObj({ id: '1', name: 'alpha-domain' }),
  getDomainObj({ id: '2', name: 'bravo-domain' }),
  getDomainObj({ id: '3', name: 'charlie-domain' }),
];

describe(DomainsPageContent.name, () => {
  it('passes the filtered domains to the table', () => {
    setup({});

    const names = screen
      .getAllByTestId('domain-item')
      .map((el) => el.textContent);
    expect(names).toEqual(['alpha-domain', 'bravo-domain']);
  });

  it('passes the filtered count and the total count to the title badge', () => {
    setup({});

    expect(screen.getByTestId('badge-count')).toHaveTextContent('2');
    expect(screen.getByTestId('badge-total')).toHaveTextContent('3');
  });

  it('passes the loading state to the badge and the table', () => {
    setup({ listDomainsResult: { isLoading: true } });

    expect(screen.getByTestId('badge-loading')).toBeInTheDocument();
    expect(screen.getByTestId('mock-table-loading')).toBeInTheDocument();
  });

  it('passes hasNextPage to the badge and the table', () => {
    setup({ listDomainsResult: { hasNextPage: true } });

    expect(screen.getByTestId('badge-has-next-page')).toHaveTextContent('true');
    expect(screen.getByTestId('has-next-page')).toHaveTextContent('true');
  });

  it('wires fetchNextPage to the table', async () => {
    const { user, listDomainsResult } = setup({});

    await user.click(screen.getByRole('button', { name: 'fetch next page' }));

    expect(listDomainsResult.fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('passes failed clusters to the error banner', () => {
    setup({
      listDomainsResult: {
        failedClusters: [{ clusterName: 'cluster-b', httpStatus: 503 }],
      },
    });

    expect(screen.getByTestId('mock-error-banner')).toHaveTextContent(
      'cluster-b'
    );
  });

  it('does not render the error banner when no cluster failed', () => {
    setup({});

    expect(screen.queryByTestId('mock-error-banner')).not.toBeInTheDocument();
  });

  it('renders the filters', () => {
    setup({});

    expect(screen.getByTestId('mock-filters')).toBeInTheDocument();
  });

  it('derives the filtered domains from the listed domains', () => {
    const { listDomainsResult } = setup({});

    expect(mockUseFilteredDomains).toHaveBeenCalledWith(listDomainsResult.data);
  });
});

function setup({
  listDomainsResult,
  filteredDomains,
}: {
  listDomainsResult?: Partial<ListDomainsResult>;
  filteredDomains?: Partial<FilteredDomains>;
}) {
  const user = userEvent.setup();

  const fullListDomainsResult: ListDomainsResult = {
    data: mockDomains,
    failedClusters: [],
    status: 'success',
    isLoading: false,
    isFetching: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    error: null,
    refetch: jest.fn(),
    ...listDomainsResult,
  };

  const fullFilteredDomains: FilteredDomains = {
    filteredDomains: mockDomains.slice(0, 2),
    totalCount: 3,
    ...filteredDomains,
  };

  mockUseListDomains.mockReturnValue(fullListDomainsResult);
  mockUseFilteredDomains.mockReturnValue(fullFilteredDomains);

  render(<DomainsPageContent />);

  return {
    user,
    listDomainsResult: fullListDomainsResult,
    filteredDomains: fullFilteredDomains,
  };
}
