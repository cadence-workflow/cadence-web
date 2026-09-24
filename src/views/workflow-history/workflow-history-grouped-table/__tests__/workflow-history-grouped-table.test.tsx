import React from 'react';

import { VirtuosoMockContext } from 'react-virtuoso';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { RequestError } from '@/utils/request/request-error';
import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { type WorkflowPageTabContentParams } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowHistoryEventGroup from '../../workflow-history-event-group/workflow-history-event-group';
import type WorkflowHistoryTableFooter from '../../workflow-history-table-footer/workflow-history-table-footer';
import {
  type HistoryEventsGroup,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../../workflow-history.types';
import WorkflowHistoryGroupedTable from '../workflow-history-grouped-table';

jest.mock<typeof WorkflowHistoryTableFooter>(
  '../../workflow-history-table-footer/workflow-history-table-footer',
  () =>
    jest.fn(
      ({
        error,
        canFetchMoreEvents,
        isFetchingMoreEvents,
        fetchMoreEvents,
      }) => (
        <div data-testid="timeline-load-more">
          {error && <div data-testid="load-more-error">Error loading more</div>}
          {canFetchMoreEvents && (
            <div data-testid="has-next-page">Has more</div>
          )}
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
  '../../workflow-history-event-group/workflow-history-event-group',
  () =>
    jest.fn(
      ({
        eventGroup,
        selectedEventId,
        workflowDiagnosticsByEventIdMap,
      }: {
        eventGroup: HistoryEventsGroup;
        selectedEventId?: string;
        workflowDiagnosticsByEventIdMap: WorkflowDiagnosticsIssuesByEventId;
      }) => (
        <div
          data-testid="workflow-history-event-group"
          data-diagnostics={JSON.stringify(workflowDiagnosticsByEventIdMap)}
        >
          {JSON.stringify(eventGroup)}
          {selectedEventId && (
            <div data-testid="selected-event-id">{selectedEventId}</div>
          )}
        </div>
      )
    )
);

const mockDiagnosticsIssuesByEventId: WorkflowDiagnosticsIssuesByEventId = {
  '7': [
    {
      issueId: 0,
      invariantType: 'Activity Failed',
      reason: 'Activity timed out',
      metadata: null,
    },
  ],
  '2': [
    {
      issueId: 1,
      invariantType: 'Decision Failed',
      reason: 'Decision task failed',
      metadata: null,
    },
  ],
  '999': [
    {
      issueId: 2,
      invariantType: 'Unrelated',
      reason: 'Issue for an event that is not rendered',
      metadata: null,
    },
  ],
};

describe(WorkflowHistoryGroupedTable.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should pass selectedEventId to WorkflowHistoryEventGroup', () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      ['group-1', mockActivityEventGroup],
    ];
    const selectedEventId = 'test-event-id';

    setup({ eventGroupsById: mockEventGroups, selectedEventId });

    expect(screen.getByTestId('selected-event-id')).toHaveTextContent(
      selectedEventId
    );
  });

  it('should not pass selectedEventId when it is undefined', () => {
    const mockEventGroups: Array<[string, HistoryEventsGroup]> = [
      ['group-1', mockActivityEventGroup],
    ];

    setup({ eventGroupsById: mockEventGroups, selectedEventId: undefined });

    expect(screen.queryByTestId('selected-event-id')).not.toBeInTheDocument();
  });

  it('should pass diagnostics scoped to each group to WorkflowHistoryEventGroup', () => {
    setup({
      eventGroupsById: [
        ['group-1', mockActivityEventGroup],
        ['group-2', mockDecisionEventGroup],
      ],
      workflowDiagnosticsByEventIdMap: mockDiagnosticsIssuesByEventId,
    });

    const [activityGroup, decisionGroup] = screen.getAllByTestId(
      'workflow-history-event-group'
    );
    expect(activityGroup).toHaveAttribute(
      'data-diagnostics',
      JSON.stringify({ '7': mockDiagnosticsIssuesByEventId['7'] })
    );
    expect(decisionGroup).toHaveAttribute(
      'data-diagnostics',
      JSON.stringify({ '2': mockDiagnosticsIssuesByEventId['2'] })
    );
  });

  it('should pass the same diagnostics map to WorkflowHistoryEventGroup across re-renders', () => {
    const { rerender } = setup({
      eventGroupsById: [['group-1', mockActivityEventGroup]],
      workflowDiagnosticsByEventIdMap: mockDiagnosticsIssuesByEventId,
    });

    rerender();

    const diagnosticsMaps = jest
      .mocked(WorkflowHistoryEventGroup)
      .mock.calls.map(([props]) => props.workflowDiagnosticsByEventIdMap);
    expect(diagnosticsMaps.length).toBeGreaterThan(1);
    diagnosticsMaps.forEach((diagnosticsMap) =>
      expect(diagnosticsMap).toBe(diagnosticsMaps[0])
    );
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
  workflowDiagnosticsByEventIdMap = {},
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
  workflowDiagnosticsByEventIdMap?: WorkflowDiagnosticsIssuesByEventId;
} = {}) {
  const virtuosoRef = { current: null };
  const user = userEvent.setup();

  const renderTable = () => (
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
        onClickShowGroupInTimeline={jest.fn()}
        workflowDiagnosticsByEventIdMap={workflowDiagnosticsByEventIdMap}
      />
    </VirtuosoMockContext.Provider>
  );

  const { rerender } = render(renderTable());

  return {
    user,
    virtuosoRef,
    rerender: () => rerender(renderTable()),
    mockFetchMoreEvents: fetchMoreEvents,
    mockSetVisibleRange: setVisibleRange,
  };
}
