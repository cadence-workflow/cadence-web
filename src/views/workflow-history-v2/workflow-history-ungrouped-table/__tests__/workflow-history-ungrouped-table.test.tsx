import React from 'react';

import { VirtuosoMockContext } from 'react-virtuoso';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type RequestError } from '@/utils/request/request-error';
import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import WorkflowHistoryUngroupedTable from '../workflow-history-ungrouped-table';

jest.mock(
  '../../workflow-history-table-footer/workflow-history-table-footer',
  () =>
    jest.fn(
      ({ error, hasMoreEvents, isFetchingMoreEvents, fetchMoreEvents }) => (
        <div data-testid="timeline-load-more">
          {error && <div data-testid="load-more-error">Error loading more</div>}
          {hasMoreEvents && <div data-testid="has-next-page">Has more</div>}
          {isFetchingMoreEvents && (
            <div data-testid="is-fetching">Fetching...</div>
          )}
          <button onClick={fetchMoreEvents} data-testid="fetch-more-button">
            Fetch More
          </button>
        </div>
      )
    )
);

jest.mock(
  '../../workflow-history-ungrouped-event/workflow-history-ungrouped-event',
  () =>
    jest.fn(
      ({
        eventInfo,
        isExpanded,
        toggleIsExpanded,
        onReset,
        animateOnEnter,
      }) => (
        <div
          data-testid="workflow-history-ungrouped-event"
          data-expanded={isExpanded}
          data-animate-on-enter={animateOnEnter}
          data-event-id={eventInfo.id}
        >
          <button onClick={toggleIsExpanded}>Toggle Event</button>
          <div>Event ID: {eventInfo.id}</div>
          <div>Label: {eventInfo.label}</div>
          {onReset && <button onClick={onReset}>Reset Event</button>}
        </div>
      )
    )
);

describe(WorkflowHistoryUngroupedTable.name, () => {
  it('should render all column headers in correct order', () => {
    setup();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Event group')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should render events from event groups', () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      ['group-1', mockActivityEventGroup],
    ];
    setup({ eventGroupsById: mockEventGroups });

    const events = screen.getAllByTestId('workflow-history-ungrouped-event');
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveTextContent('Event ID:');
  });

  it('should render events with correct labels from groups', () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      ['group-1', mockActivityEventGroup],
    ];
    setup({ eventGroupsById: mockEventGroups });

    const events = screen.getAllByTestId('workflow-history-ungrouped-event');
    expect(events[0]).toHaveTextContent(
      `Label: ${mockActivityEventGroup.label}`
    );
  });

  it('should handle event expansion toggle', async () => {
    const { user, mockToggleIsEventExpanded } = setup({
      eventGroupsById: [['group-1', mockActivityEventGroup]],
    });

    const toggleButtons = screen.getAllByText('Toggle Event');
    await user.click(toggleButtons[0]);

    const firstEventId =
      mockActivityEventGroup.events[0].eventId ??
      mockActivityEventGroup.events[0].computedEventId;
    expect(mockToggleIsEventExpanded).toHaveBeenCalledWith(firstEventId);
  });

  it('should pass isExpanded state to events', () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      ['group-1', mockActivityEventGroup],
    ];
    const firstEventId =
      mockActivityEventGroup.events[0].eventId ??
      mockActivityEventGroup.events[0].computedEventId;

    setup({
      eventGroupsById: mockEventGroups,
      getIsEventExpanded: jest.fn((id) => id === firstEventId),
    });

    const events = screen.getAllByTestId('workflow-history-ungrouped-event');
    expect(events[0]).toHaveAttribute('data-expanded', 'true');
    if (events.length > 1) {
      expect(events[1]).toHaveAttribute('data-expanded', 'false');
    }
  });

  it('should pass hasMoreEvents to load more component', () => {
    setup({
      hasMoreEvents: true,
      isFetchingMoreEvents: false,
      fetchMoreEvents: jest.fn(),
    });

    expect(screen.getByTestId('timeline-load-more')).toBeInTheDocument();
    expect(screen.getByTestId('has-next-page')).toBeInTheDocument();
  });

  it('should pass animateOnEnter for selectedEventId', async () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      ['group-1', mockActivityEventGroup],
    ];
    const firstEventId =
      mockActivityEventGroup.events[0].eventId ??
      mockActivityEventGroup.events[0].computedEventId;

    setup({
      eventGroupsById: mockEventGroups,
      selectedEventId: firstEventId,
    });

    await waitFor(() => {
      const events = screen.getAllByTestId('workflow-history-ungrouped-event');
      expect(events[0]).toHaveAttribute('data-animate-on-enter', 'true');
    });
  });

  it('should call resetToDecisionEventId when reset button is clicked on resettable event', async () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      [
        'group-1',
        {
          ...mockActivityEventGroup,
          resetToDecisionEventId: mockActivityEventGroup.events[0].eventId,
        },
      ],
    ];
    const { user, mockResetToDecisionEventId } = setup({
      eventGroupsById: mockEventGroups,
    });

    const resetButtons = screen.getAllByText('Reset Event');
    await user.click(resetButtons[0]);

    const firstEventId =
      mockActivityEventGroup.events[0].eventId ??
      mockActivityEventGroup.events[0].computedEventId;
    expect(mockResetToDecisionEventId).toHaveBeenCalledWith(firstEventId);
  });

  it('should not show reset button for non-resettable events', () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      [
        'group-1',
        {
          ...mockActivityEventGroup,
          resetToDecisionEventId: undefined,
        },
      ],
    ];
    setup({ eventGroupsById: mockEventGroups });

    expect(screen.queryByText('Reset Event')).not.toBeInTheDocument();
  });
});

function setup({
  eventGroupsById = [],
  error = null,
  hasMoreEvents = false,
  isFetchingMoreEvents = false,
  fetchMoreEvents = jest.fn(),
  setVisibleRange = jest.fn(),
  decodedPageUrlParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    workflowTab: 'history',
  },
  selectedEventId,
  getIsEventExpanded = jest.fn(() => false),
  toggleIsEventExpanded = jest.fn(),
  resetToDecisionEventId = jest.fn(),
}: {
  eventGroupsById?: Array<[string, HistoryEventsGroup]>;
  error?: RequestError | null;
  hasMoreEvents?: boolean;
  isFetchingMoreEvents?: boolean;
  fetchMoreEvents?: () => void;
  setVisibleRange?: ({
    startIndex,
    endIndex,
  }: {
    startIndex: number;
    endIndex: number;
  }) => void;
  initialStartIndex?: number;
  decodedPageUrlParams?: WorkflowPageTabsParams;
  selectedEventId?: string;
  getIsEventExpanded?: (eventId: string) => boolean;
  toggleIsEventExpanded?: (eventId: string) => void;
  resetToDecisionEventId?: (decisionEventId: string) => void;
} = {}) {
  const virtuosoRef = { current: null };
  const user = userEvent.setup();

  render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 1000, itemHeight: 36 }}
    >
      <WorkflowHistoryUngroupedTable
        eventGroupsById={eventGroupsById}
        virtuosoRef={virtuosoRef}
        setVisibleRange={setVisibleRange}
        decodedPageUrlParams={decodedPageUrlParams}
        selectedEventId={selectedEventId}
        getIsEventExpanded={getIsEventExpanded}
        toggleIsEventExpanded={toggleIsEventExpanded}
        resetToDecisionEventId={resetToDecisionEventId}
        error={error}
        hasMoreEvents={hasMoreEvents}
        fetchMoreEvents={fetchMoreEvents}
        isFetchingMoreEvents={isFetchingMoreEvents}
      />
    </VirtuosoMockContext.Provider>
  );

  return {
    user,
    virtuosoRef,
    mockFetchMoreEvents: fetchMoreEvents,
    mockSetVisibleRange: setVisibleRange,
    mockToggleIsEventExpanded: toggleIsEventExpanded,
    mockResetToDecisionEventId: resetToDecisionEventId,
  };
}
