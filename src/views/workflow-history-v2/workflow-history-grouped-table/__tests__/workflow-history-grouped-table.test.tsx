import React from 'react';

import { VirtuosoMockContext } from 'react-virtuoso';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';
import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

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

describe(WorkflowHistoryGroupedTable.name, () => {
  it('should render all column headers in correct order', () => {
    setup();

    expect(screen.getByText('Event group')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should apply grid layout to table header', () => {
    setup();

    const header = screen.getByText('Event group').parentElement;
    expect(header).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: '0.3fr 2fr 1fr 1.2fr 1fr 3fr minmax(0, 70px)',
    });
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
} = {}) {
  const virtuosoRef = { current: null };
  const user = userEvent.setup();

  render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 1000, itemHeight: 160 }}
    >
      <WorkflowHistoryGroupedTable
        eventGroupsById={eventGroupsById}
        virtuosoRef={virtuosoRef}
        initialStartIndex={initialStartIndex}
        setVisibleRange={setVisibleRange}
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
