import React from 'react';

import { VirtuosoMockContext } from 'react-virtuoso';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { RequestError } from '@/utils/request/request-error';
import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';
import { type WorkflowPageTabContentParams } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowHistoryGroupedTable from '../workflow-history-grouped-table';

jest.mock(
  '@/views/workflow-history/workflow-history-timeline-load-more/workflow-history-timeline-load-more',
  () =>
    jest.fn(({ error, hasNextPage, isFetchingNextPage, fetchNextPage }) => (
      <div data-testid="timeline-load-more">
        {error && <div data-testid="load-more-error">Error loading more</div>}
        {hasNextPage && <div data-testid="has-next-page">Has more</div>}
        {isFetchingNextPage && <div data-testid="is-fetching">Fetching...</div>}
        <button onClick={fetchNextPage} data-testid="fetch-more-button">
          Fetch More
        </button>
      </div>
    ))
);

jest.mock(
  '../../workflow-history-event-group/workflow-history-event-group',
  () =>
    jest.fn(({ eventGroup }: { eventGroup: HistoryEventsGroup }) => (
      <div data-testid="workflow-history-event-group">
        {JSON.stringify(eventGroup)}
      </div>
    ))
);

describe(WorkflowHistoryGroupedTable.name, () => {
  it('should render all column headers in correct order', () => {
    setup();

    expect(screen.getByText('Event group')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should render event groups data', () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      ['group-1', mockActivityEventGroup],
    ];
    setup({ eventGroupsById: mockEventGroups });

    expect(
      screen.getByText(JSON.stringify(mockActivityEventGroup))
    ).toBeInTheDocument();
  });

  it('should render timeline load more component with correct props', () => {
    const mockFetchMoreEvents = jest.fn();

    setup({
      error: new RequestError('Test error', '/mock-history-url', 500),
      hasMoreEvents: true,
      isFetchingMoreEvents: false,
      fetchMoreEvents: mockFetchMoreEvents,
    });

    expect(screen.getByTestId('timeline-load-more')).toBeInTheDocument();
    expect(screen.getByTestId('has-next-page')).toBeInTheDocument();
  });

  it('should show error state in load more component', () => {
    setup({ error: new RequestError('Test error', '/mock-history-url', 500) });

    expect(screen.getByTestId('load-more-error')).toBeInTheDocument();
  });

  it('should show fetching state in load more component', () => {
    setup({ isFetchingMoreEvents: true });

    expect(screen.getByTestId('is-fetching')).toBeInTheDocument();
  });
});

function setup({
  eventGroupsById = [],
  error = null,
  hasMoreEvents = false,
  isFetchingMoreEvents = false,
  fetchMoreEvents = jest.fn(),
  setVisibleRange = jest.fn(),
  initialStartIndex,
  decodedPageUrlParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    workflowTab: 'history',
  },
  reachedEndOfAvailableHistory = false,
  workflowCloseStatus = null,
  workflowIsArchived = false,
  workflowCloseTimeMs = null,
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
  decodedPageUrlParams?: WorkflowPageTabContentParams;
  reachedEndOfAvailableHistory?: boolean;
  workflowCloseStatus?: WorkflowExecutionCloseStatus | null;
  workflowIsArchived?: boolean;
  workflowCloseTimeMs?: number | null;
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
      <WorkflowHistoryGroupedTable
        eventGroupsById={eventGroupsById}
        virtuosoRef={virtuosoRef}
        initialStartIndex={initialStartIndex}
        setVisibleRange={setVisibleRange}
        decodedPageUrlParams={decodedPageUrlParams}
        reachedEndOfAvailableHistory={reachedEndOfAvailableHistory}
        workflowCloseStatus={workflowCloseStatus}
        workflowIsArchived={workflowIsArchived}
        workflowCloseTimeMs={workflowCloseTimeMs}
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
  };
}
