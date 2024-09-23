import {
  mockIsIntersecting,
  intersectionMockInstance,
} from 'react-intersection-observer/test-utils';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';

import WorkflowHistoryTimelineLoadMore from '../workflow-history-timeline-load-more';
import { type Props } from '../workflow-history-timeline-load-more.types';

describe('WorkflowHistoryTimelineLoadMore', () => {
  it('renders loading state while fetching next page', () => {
    setup({ isFetchingNextPage: true });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message if there is an error, and allows retrying', () => {
    const { mockFetchNextPage } = setup({
      error: new RequestError('An error occurred', 500),
    });

    expect(screen.getByText(/Failed to load more items./)).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText(/Retry manually/));
    });

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('renders loading state with the infinite scroll ref when more workflows can be loaded', () => {
    const { mockFetchNextPage } = setup({
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    const spinnerDiv = screen.getByTestId('intersection-observer-container');
    const instance = intersectionMockInstance(spinnerDiv);
    expect(instance.observe).toHaveBeenCalledWith(spinnerDiv);

    act(() => {
      mockIsIntersecting(spinnerDiv, 1);
    });
    expect(mockFetchNextPage).toHaveBeenCalled();
  });
});

function setup(overrides: Partial<Props>) {
  const mockFetchNextPage = jest.fn();
  const defaultProps: Props = {
    error: null,
    fetchNextPage: mockFetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
  };

  render(<WorkflowHistoryTimelineLoadMore {...defaultProps} {...overrides} />);

  return { mockFetchNextPage };
}
