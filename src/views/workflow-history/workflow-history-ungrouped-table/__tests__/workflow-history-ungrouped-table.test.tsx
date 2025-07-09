import { VirtuosoMockContext } from 'react-virtuoso';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import { scheduleDecisionTaskEvent } from '../../__fixtures__/workflow-history-decision-events';
import { startWorkflowExecutionEvent } from '../../__fixtures__/workflow-history-single-events';
import { type WorkflowHistoryUngroupedEventInfo } from '../../workflow-history-ungrouped-event/workflow-history-ungrouped-event.types';
import WorkflowHistoryUngroupedTable from '../workflow-history-ungrouped-table';

// Mock child components
jest.mock(
  '../../workflow-history-ungrouped-event/workflow-history-ungrouped-event',
  () =>
    jest.fn(({ eventInfo, isExpanded, toggleIsExpanded, onReset }) => (
      <div data-testid="mock-event" data-expanded={isExpanded}>
        <button onClick={toggleIsExpanded}>Toggle Event</button>
        <div>Event ID: {eventInfo.id}</div>
        {onReset && <button onClick={onReset}>Reset Event</button>}
      </div>
    ))
);

jest.mock(
  '../../workflow-history-timeline-load-more/workflow-history-timeline-load-more',
  () =>
    jest.fn(({ error, hasNextPage, isFetchingNextPage }) => (
      <div data-testid="mock-load-more">
        {error && <div>Error: {error.message}</div>}
        {hasNextPage && <div>Has more events</div>}
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    ))
);

const mockEventsInfo: WorkflowHistoryUngroupedEventInfo[] = [
  {
    id: '1',
    label: 'Workflow Execution Started',
    status: 'COMPLETED',
    statusLabel: 'Completed',
    event: startWorkflowExecutionEvent,
  },
  {
    id: '2',
    label: 'Decision Task Scheduled',
    status: 'COMPLETED',
    statusLabel: 'Completed',
    event: scheduleDecisionTaskEvent,
  },
];

const mockDecodedPageUrlParams: WorkflowPageTabsParams = {
  cluster: 'test-cluster',
  domain: 'test-domain',
  workflowId: 'test-workflow',
  runId: 'test-run',
  workflowTab: 'history',
};

describe(WorkflowHistoryUngroupedTable.name, () => {
  it('renders the table header with correct columns', () => {
    setup();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Event')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Elapsed')).toBeInTheDocument();
  });

  it('renders events using Virtuoso', () => {
    setup();

    const events = screen.getAllByTestId('mock-event');
    expect(events).toHaveLength(2);
    expect(events[0]).toHaveTextContent('Event ID: 1');
    expect(events[1]).toHaveTextContent('Event ID: 2');
  });

  it('handles event expansion toggle', async () => {
    const { user, mockToggleIsEventExpanded } = setup();

    const toggleButtons = screen.getAllByText('Toggle Event');
    await user.click(toggleButtons[0]);

    expect(mockToggleIsEventExpanded).toHaveBeenCalledWith('1');
  });

  it('shows error state in load more component', () => {
    setup({
      error: new RequestError('Test error', 'test-url', 500),
    });

    const loadMore = screen.getByTestId('mock-load-more');
    expect(loadMore).toHaveTextContent('Error: Test error');
  });

  it('shows loading and has more states in load more component', () => {
    setup({
      hasMoreEvents: true,
      isFetchingMoreEvents: true,
    });

    const loadMore = screen.getByTestId('mock-load-more');
    expect(loadMore).toHaveTextContent('Has more events');
    expect(loadMore).toHaveTextContent('Loading more...');
  });

  it('scrolls to selected event when provided', async () => {
    setup({ selectedEventId: '2' });

    await waitFor(() => {
      const events = screen.getAllByTestId('mock-event');
      expect(events).toHaveLength(2);
    });
  });

  it('calls onResetToEventId when reset button is clicked on resettable event', async () => {
    const { user, mockOnResetToEventId } = setup({
      eventsInfo: [
        {
          ...mockEventsInfo[0],
          canReset: true,
        },
        mockEventsInfo[1],
      ],
    });

    const resetButtons = screen.getAllByText('Reset Event');
    await user.click(resetButtons[0]);

    expect(mockOnResetToEventId).toHaveBeenCalledWith('1');
  });
});

function setup({
  eventsInfo = mockEventsInfo,
  error = null,
  hasMoreEvents = false,
  isFetchingMoreEvents = false,
  selectedEventId,
}: {
  eventsInfo?: WorkflowHistoryUngroupedEventInfo[];
  error?: RequestError | null;
  hasMoreEvents?: boolean;
  isFetchingMoreEvents?: boolean;
  selectedEventId?: string;
} = {}) {
  const mockFetchMoreEvents = jest.fn();
  const mockGetIsEventExpanded = jest.fn(() => false);
  const mockToggleIsEventExpanded = jest.fn();
  const mockOnVisibleRangeChange = jest.fn();
  const mockOnResetToEventId = jest.fn();

  const props = {
    eventsInfo,
    decodedPageUrlParams: mockDecodedPageUrlParams,
    error,
    hasMoreEvents,
    isFetchingMoreEvents,
    fetchMoreEvents: mockFetchMoreEvents,
    getIsEventExpanded: mockGetIsEventExpanded,
    toggleIsEventExpanded: mockToggleIsEventExpanded,
    onVisibleRangeChange: mockOnVisibleRangeChange,
    virtuosoRef: { current: null },
    selectedEventId,
    onResetToEventId: mockOnResetToEventId,
  };

  const user = userEvent.setup();

  render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 1000, itemHeight: 100 }}
    >
      <WorkflowHistoryUngroupedTable {...props} />
    </VirtuosoMockContext.Provider>
  );

  return {
    props,
    user,
    mockFetchMoreEvents,
    mockGetIsEventExpanded,
    mockToggleIsEventExpanded,
    mockOnVisibleRangeChange,
    mockOnResetToEventId,
  };
}
