import { render, screen, userEvent } from '@/test-utils/rtl';

import {
  completedActivityTaskEvents,
  scheduleActivityTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';
import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import type WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import type WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import type WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import WorkflowHistoryEventGroup from '../workflow-history-event-group';
import type { Props } from '../workflow-history-event-group.types';

jest.mock('@/utils/data-formatters/format-date', () =>
  jest.fn((timeMs: number) => `Formatted: ${timeMs}`)
);

jest.mock<typeof WorkflowHistoryEventStatusBadge>(
  '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge',
  () =>
    jest.fn((props) => (
      <div data-testid="status-badge">
        {props.statusReady ? props.status : 'Loading'}
      </div>
    ))
);

jest.mock<typeof WorkflowHistoryGroupLabel>(
  '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label',
  () => jest.fn((props) => <>{props.label}</>)
);

jest.mock<typeof WorkflowHistoryTimelineResetButton>(
  '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button',
  () =>
    jest.fn((props) => (
      <button onClick={props.onReset} data-testid="reset-button">
        Reset Button
      </button>
    ))
);

jest.mock(
  '../../workflow-history-event-group-duration/workflow-history-event-group-duration',
  () => jest.fn(() => <span>1m 30s</span>)
);

jest.mock('../helpers/get-event-group-filtering-type', () =>
  jest.fn(() => 'ACTIVITY')
);

jest.mock(
  '../../config/workflow-history-event-filtering-type-colors.config',
  () => ({
    __esModule: true,
    default: {
      ACTIVITY: {
        content: '#FF5733',
        background: '#FFE5E0',
        backgroundHighlighted: '#FFD4CC',
      },
    },
  })
);

const mockActivityEventGroupWithMetadata: HistoryEventsGroup = {
  ...mockActivityEventGroup,
  eventsMetadata: [
    {
      label: 'Scheduled',
      status: 'COMPLETED',
      timeMs: 1725747370599,
      timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
    },
    {
      label: 'Completed',
      status: 'COMPLETED',
      timeMs: 1725747370632,
      timeLabel: 'Completed at 07 Sep, 22:16:10 UTC',
    },
  ],
};

const mockDecisionEventGroupWithMetadata: HistoryEventsGroup = {
  ...mockDecisionEventGroup,
  eventsMetadata: [
    {
      label: 'Scheduled',
      status: 'COMPLETED',
      timeMs: 1725747370599,
      timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
    },
    {
      label: 'Started',
      status: 'COMPLETED',
      timeMs: 1725747370575,
      timeLabel: 'Started at 07 Sep, 22:16:10 UTC',
    },
    {
      label: 'Completed',
      status: 'COMPLETED',
      timeMs: 1725747370632,
      timeLabel: 'Completed at 07 Sep, 22:16:10 UTC',
    },
  ],
};

describe(WorkflowHistoryEventGroup.name, () => {
  it('renders group correctly', () => {
    setup({ eventGroup: mockActivityEventGroupWithMetadata });

    expect(screen.getByText('Mock event')).toBeInTheDocument();
    expect(screen.getByText('1m 30s')).toBeInTheDocument();

    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();

    expect(screen.getByText('Completed')).toBeInTheDocument();

    expect(screen.getByText('Formatted: 1725747370632')).toBeInTheDocument();
  });

  it('renders reset button when resetToDecisionEventId is provided', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockDecisionEventGroupWithMetadata,
      resetToDecisionEventId: 'decision-event-id',
    };

    setup({ eventGroup });

    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockDecisionEventGroupWithMetadata,
      resetToDecisionEventId: 'decision-event-id',
    };

    const { mockOnReset, user } = setup({ eventGroup });

    const resetButton = screen.getByTestId('reset-button');
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('expands panel when any event is expanded', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: completedActivityTaskEvents,
    };

    const getIsEventExpanded = jest.fn(
      (eventId: string) => eventId === completedActivityTaskEvents[1].eventId
    );

    setup({ eventGroup, getIsEventExpanded });

    // Panel should be expanded if any event is expanded, showing content
    expect(screen.getByText('TODO: Full event details')).toBeInTheDocument();
  });

  it('calls toggleIsEventExpanded when panel is toggled', async () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: [scheduleActivityTaskEvent],
    };

    const toggleIsEventExpanded = jest.fn();
    const { user } = setup({ eventGroup, toggleIsEventExpanded });

    // Click on the header content to toggle the panel
    const headerLabel = screen.getByText('Mock event');
    await user.click(headerLabel);

    expect(toggleIsEventExpanded).toHaveBeenCalledWith(
      scheduleActivityTaskEvent.eventId
    );
  });

  it('handles missing event group time gracefully', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      timeMs: null,
    };

    setup({ eventGroup });

    // Should not crash, and should render null for date
    expect(screen.queryByText(/Formatted:/)).not.toBeInTheDocument();
  });

  it('shows status when statusReady is true (showLoadingMoreEvents is false)', () => {
    setup({
      eventGroup: mockActivityEventGroupWithMetadata,
      showLoadingMoreEvents: false,
    });

    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('shows Loading when statusReady is false (showLoadingMoreEvents is true)', () => {
    setup({
      eventGroup: mockActivityEventGroupWithMetadata,
      showLoadingMoreEvents: true,
    });

    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('COMPLETED')).not.toBeInTheDocument();
  });
});

function setup({
  eventGroup = mockActivityEventGroupWithMetadata,
  selected = false,
  workflowCloseTimeMs = null,
  workflowCloseStatus = null,
  workflowIsArchived = false,
  showLoadingMoreEvents = false,
  decodedPageUrlParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    workflowTab: 'history',
  },
  onReset = jest.fn(),
  getIsEventExpanded = jest.fn(() => false),
  toggleIsEventExpanded = jest.fn(),
}: Partial<Props> = {}) {
  const mockOnReset = onReset || jest.fn();
  const user = userEvent.setup();

  render(
    <WorkflowHistoryEventGroup
      eventGroup={eventGroup}
      selected={selected}
      workflowCloseTimeMs={workflowCloseTimeMs}
      workflowCloseStatus={workflowCloseStatus}
      workflowIsArchived={workflowIsArchived}
      showLoadingMoreEvents={showLoadingMoreEvents}
      decodedPageUrlParams={decodedPageUrlParams}
      onReset={mockOnReset}
      getIsEventExpanded={getIsEventExpanded}
      toggleIsEventExpanded={toggleIsEventExpanded}
    />
  );

  return {
    mockOnReset,
    user,
    toggleIsEventExpanded,
    getIsEventExpanded,
  };
}
