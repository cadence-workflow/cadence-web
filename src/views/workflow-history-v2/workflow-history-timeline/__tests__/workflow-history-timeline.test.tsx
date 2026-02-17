import React from 'react';

import { VirtuosoMockContext } from 'react-virtuoso';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import {
  mockActivityEventGroup,
  mockChildWorkflowEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import { type EventGroupEntry } from '../../workflow-history-v2.types';
import WorkflowHistoryTimeline from '../workflow-history-timeline';

jest.mock(
  '../../workflow-history-event-group/helpers/get-event-group-filtering-type',
  () => jest.fn(() => 'ACTIVITY')
);

jest.mock(
  '../../workflow-history-timeline-event-group/workflow-history-timeline-event-group',
  () =>
    jest.fn(
      ({
        eventGroup,
        onClickShowInTable,
      }: {
        eventGroup: { label: string };
        onClickShowInTable: () => void;
      }) => (
        <div data-testid="timeline-event-group">
          {eventGroup.label}
          <button
            data-testid="show-in-table-button"
            onClick={onClickShowInTable}
          >
            Show in table
          </button>
        </div>
      )
    )
);

jest.mock(
  '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge',
  () =>
    jest.fn((props: { status: string; statusReady: boolean; size: string }) => (
      <div data-testid="status-badge" data-status={props.status}>
        {props.statusReady ? props.status : 'Loading'}
      </div>
    ))
);

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number }) => React.ReactNode;
  }) => {
    return <>{children({ width: 1000 })}</>;
  },
}));

const mockNow = new Date('2024-09-10').getTime();

describe(WorkflowHistoryTimeline.name, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: mockNow });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render with valid event groups and display timeline rows', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    expect(screen.getByText('Event group')).toBeInTheDocument();
    expect(screen.getByText(mockActivityEventGroup.label)).toBeInTheDocument();
  });

  it('should render timeline axis', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    const { container } = setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    // Timeline axis should be rendered in SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should render correct number of rows matching valid event groups', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
      ['group2', mockDecisionEventGroup],
      ['group3', mockChildWorkflowEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    expect(screen.getByText(mockActivityEventGroup.label)).toBeInTheDocument();
    expect(screen.getByText(mockDecisionEventGroup.label)).toBeInTheDocument();
    expect(
      screen.getByText(mockChildWorkflowEventGroup.label)
    ).toBeInTheDocument();
  });

  it('should display correct labels for each row', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
      ['group2', mockDecisionEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    expect(screen.getByText(mockActivityEventGroup.label)).toBeInTheDocument();
    expect(screen.getByText(mockDecisionEventGroup.label)).toBeInTheDocument();
  });

  it('should display status badges for each row', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    const statusBadge = screen.getByTestId('status-badge');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveAttribute('data-status', 'COMPLETED');
  });

  it('should render striped pattern for running groups', () => {
    const runningGroup = {
      ...mockActivityEventGroup,
      hasMissingEvents: true,
    };
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', runningGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    const { container } = setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    // PatternLines should be rendered for running groups
    const pattern = container.querySelector('pattern');
    expect(pattern).toBeInTheDocument();
  });

  it('should render solid color for completed groups', () => {
    const completedGroup = {
      ...mockActivityEventGroup,
      hasMissingEvents: false,
    };
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', completedGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    const { container } = setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    // No pattern should be rendered for completed groups
    const pattern = container.querySelector('pattern');
    expect(pattern).not.toBeInTheDocument();
  });

  it('should calculate content width correctly based on viewport width', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    const { container } = setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    // SVG width should be calculated based on viewport width minus label column width
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    // Content width should be 1000 - 300 = 700
    expect(svgs[0]?.getAttribute('width')).toBe('700');
  });

  it('should display timeline event group in tooltip when hovering over timeline bar', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    const { container } = setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    const bar = container.querySelector('rect');
    expect(bar).toBeInTheDocument();

    // If bar is null, the test would fail above
    await user.hover(bar!);

    const tooltip = await screen.findByRole('tooltip');
    expect(
      within(tooltip).getByTestId('timeline-event-group')
    ).toBeInTheDocument();
    expect(
      within(tooltip).getByText(mockActivityEventGroup.label)
    ).toBeInTheDocument();
  });

  it('should call onClickShowInTable with row ID and close popover when "Show in table" is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    const workflowStartTimeMs = mockNow - 1000000;

    const { container, onClickShowInTable } = setup({
      eventGroupsEntries,
      workflowStartTimeMs,
    });

    const bar = container.querySelector('rect');
    expect(bar).toBeInTheDocument();

    await user.hover(bar!);

    const tooltip = await screen.findByRole('tooltip');
    const showInTableButton = within(tooltip).getByTestId(
      'show-in-table-button'
    );

    await user.click(showInTableButton);

    expect(onClickShowInTable).toHaveBeenCalledTimes(1);
    expect(onClickShowInTable).toHaveBeenCalledWith('group1');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

function setup({
  eventGroupsEntries,
  workflowStartTimeMs,
  workflowCloseTimeMs,
  onClickShowInTable = jest.fn(),
  decodedPageUrlParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    workflowTab: 'history',
  },
}: {
  eventGroupsEntries: Array<EventGroupEntry>;
  workflowStartTimeMs: number;
  workflowCloseTimeMs?: number | null;
  onClickShowInTable?: (eventId: string) => void;
  decodedPageUrlParams?: {
    domain: string;
    cluster: string;
    workflowId: string;
    runId: string;
    workflowTab: 'history';
  };
}) {
  const virtuosoRef = { current: null };

  const renderResult = render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 1000, itemHeight: 24 }}
    >
      <WorkflowHistoryTimeline
        eventGroupsEntries={eventGroupsEntries}
        workflowStartTimeMs={workflowStartTimeMs}
        workflowCloseTimeMs={workflowCloseTimeMs}
        onClickShowInTable={onClickShowInTable}
        decodedPageUrlParams={decodedPageUrlParams}
        virtuosoRef={virtuosoRef}
      />
    </VirtuosoMockContext.Provider>
  );

  return { ...renderResult, onClickShowInTable };
}
