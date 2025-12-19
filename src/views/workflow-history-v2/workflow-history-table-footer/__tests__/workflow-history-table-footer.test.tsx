import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';

import WorkflowHistoryTableFooter from '../workflow-history-table-footer';
import { type Props } from '../workflow-history-table-footer.types';

describe(WorkflowHistoryTableFooter.name, () => {
  it('renders loading spinner when hasMoreEvents is true', () => {
    setup({ hasMoreEvents: true, isFetchingMoreEvents: false });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders loading spinner when isFetchingMoreEvents is true', () => {
    setup({ hasMoreEvents: false, isFetchingMoreEvents: true });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message if there is an error, and allow retrying on click', () => {
    const { mockFetchMoreEvents } = setup({
      error: new RequestError('An error occurred', '/history', 500),
      hasMoreEvents: false,
      isFetchingMoreEvents: false,
    });

    expect(screen.getByText(/Failed to load more items./)).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText(/Retry manually/));
    });

    expect(mockFetchMoreEvents).toHaveBeenCalled();
  });
});

function setup(overrides: Partial<Props> = {}) {
  const mockFetchMoreEvents = jest.fn();
  const defaultProps: Props = {
    error: null,
    fetchMoreEvents: mockFetchMoreEvents,
    hasMoreEvents: true,
    isFetchingMoreEvents: false,
  };

  const result = render(
    <WorkflowHistoryTableFooter {...defaultProps} {...overrides} />
  );

  return { mockFetchMoreEvents, ...result };
}
