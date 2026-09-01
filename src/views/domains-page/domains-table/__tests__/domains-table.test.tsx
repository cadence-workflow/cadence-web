import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { getDomainObj } from '../../__fixtures__/domains';
import DomainsTable from '../domains-table';
import { type Props } from '../domains-table.types';

jest.mock(
  '@/components/table-virtualized/table-virtualized',
  () =>
    function MockTableVirtualized({
      data,
      endMessageProps,
    }: {
      data: any[];
      endMessageProps: any;
    }) {
      return (
        <div data-testid="mock-table">
          <span data-testid="row-count">{data.length}</span>
          <span data-testid="has-next-page">
            {String(endMessageProps.hasNextPage)}
          </span>
          <span data-testid="is-fetching-next-page">
            {String(endMessageProps.isFetchingNextPage)}
          </span>
          <span data-testid="has-data">{String(endMessageProps.hasData)}</span>
          <span data-testid="has-error">
            {String(endMessageProps.error !== null)}
          </span>
          <button
            data-testid="fetch-next-page"
            onClick={endMessageProps.fetchNextPage}
          >
            Load more
          </button>
        </div>
      );
    }
);

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () =>
    function MockLoadingIndicator() {
      return <div data-testid="loading-indicator" />;
    }
);

jest.mock(
  '../../domains-page-context-provider/domains-page-context-provider',
  () => ({
    DomainsPageContext: {
      ...jest.requireActual('react').createContext({}),
    },
  })
);

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [{}, mockSetQueryParams])
);

describe(DomainsTable.name, () => {
  it('shows loading indicator when isLoading is true', () => {
    setup({ isLoading: true });

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-table')).not.toBeInTheDocument();
  });

  it('renders table with domains when loaded', () => {
    setup({});

    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    expect(screen.getByTestId('row-count')).toHaveTextContent('2');
  });

  it('passes infinite scroll props to table', () => {
    setup({ hasNextPage: true, isFetchingNextPage: true });

    expect(screen.getByTestId('has-next-page')).toHaveTextContent('true');
    expect(screen.getByTestId('is-fetching-next-page')).toHaveTextContent(
      'true'
    );
  });

  it('passes error to table endMessageProps', () => {
    setup({ error: new Error('test error') });

    expect(screen.getByTestId('has-error')).toHaveTextContent('true');
  });

  it('calls fetchNextPage when triggered', async () => {
    const { user, mockFetchNextPage } = setup({});

    await user.click(screen.getByTestId('fetch-next-page'));

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no domains', () => {
    setup({ domains: [] });

    expect(screen.getByTestId('has-data')).toHaveTextContent('false');
  });
});

function setup(overrides: Partial<Props>) {
  const { userEvent } = jest.requireActual('@testing-library/user-event');
  const user = userEvent.setup();
  const mockFetchNextPage = jest.fn();

  const defaultProps: Props = {
    domains: [
      getDomainObj({ id: 'domain-1', name: 'alpha-domain' }),
      getDomainObj({ id: 'domain-2', name: 'beta-domain' }),
    ],
    fetchNextPage: mockFetchNextPage,
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    error: null,
  };

  render(<DomainsTable {...defaultProps} {...overrides} />);

  return { user, mockFetchNextPage };
}
