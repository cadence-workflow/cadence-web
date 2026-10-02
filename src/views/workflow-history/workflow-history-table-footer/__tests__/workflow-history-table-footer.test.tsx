import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';

import WorkflowHistoryTableFooter from '../workflow-history-table-footer';
import { type Props } from '../workflow-history-table-footer.types';

describe(WorkflowHistoryTableFooter.name, () => {
  it('renders loading spinner when canFetchMoreEvents is true', () => {
    setup({ canFetchMoreEvents: true, isFetchingMoreEvents: false });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders loading spinner when isFetchingMoreEvents is true', () => {
    setup({ canFetchMoreEvents: false, isFetchingMoreEvents: true });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message if there is an error, and allow retrying on click', () => {
    const { mockFetchMoreEvents } = setup({
      error: new RequestError('An error occurred', '/history', 500),
      canFetchMoreEvents: false,
      isFetchingMoreEvents: false,
    });

    expect(screen.getByText(/Failed to load more items./)).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText(/Retry manually/));
    });

    expect(mockFetchMoreEvents).toHaveBeenCalled();
  });

  it('renders no events message when noEventsToDisplay is true', () => {
    setup({
      noEventsToDisplay: true,
      canFetchMoreEvents: false,
      isFetchingMoreEvents: false,
    });

    expect(screen.getByText('No events to display')).toBeInTheDocument();
  });
});

function setup(props: Partial<Props> = {}) {
  const mockFetchMoreEvents = jest.fn();

  render(
    <WorkflowHistoryTableFooter
      error={null}
      noEventsToDisplay={false}
      canFetchMoreEvents={true}
      fetchMoreEvents={mockFetchMoreEvents}
      isFetchingMoreEvents={false}
      {...props}
    />
  );

  return { mockFetchMoreEvents };
}
