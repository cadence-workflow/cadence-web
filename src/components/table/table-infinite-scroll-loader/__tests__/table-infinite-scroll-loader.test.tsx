import {
  mockIsIntersecting,
  intersectionMockInstance,
} from 'react-intersection-observer/test-utils';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import TableInfiniteScrollLoader from '../table-infinite-scroll-loader';
import { type Props } from '../table-infinite-scroll-loader.types';

describe(TableInfiniteScrollLoader.name, () => {
  it('renders loading state while fetching next page', () => {
    setup({ isFetchingNextPage: true });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message if there is an error, and allows retrying', () => {
    const { mockFetchNextPage } = setup({
      error: new Error('An error occurred'),
    });

    expect(screen.getByText(/Failed to load more items./)).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText(/Retry manually/));
    });

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('renders loading state with the infinite scroll ref when more data can be loaded', () => {
    const { mockFetchNextPage } = setup({
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    const spinnerDiv = screen.getByTestId('infinite-scroll-spinner');
    const instance = intersectionMockInstance(spinnerDiv);
    expect(instance.observe).toHaveBeenCalledWith(spinnerDiv);

    act(() => {
      mockIsIntersecting(spinnerDiv, 1);
    });

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('renders end message when there are workflows', () => {
    setup({ hasData: true, hasNextPage: false });

    expect(screen.getByText('End of results')).toBeInTheDocument();
  });

  it('renders end message when there is no data', () => {
    setup({ hasData: false, hasNextPage: false });

    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

function setup(overrides: Partial<Props>) {
  const mockFetchNextPage = jest.fn();
  const defaultProps: Props = {
    hasData: true,
    error: null,
    fetchNextPage: mockFetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
  };

  render(<TableInfiniteScrollLoader {...defaultProps} {...overrides} />);

  return { mockFetchNextPage };
}
