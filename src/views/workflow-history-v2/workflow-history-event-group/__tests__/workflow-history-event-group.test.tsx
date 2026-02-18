import { render, screen, userEvent } from '@/test-utils/rtl';

import {
  completedActivityTaskEvents,
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';
import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import type WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import type WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import type WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import * as generateHistoryGroupDetailsModule from '../../helpers/generate-history-group-details';
import type { EventDetailsEntries } from '../../workflow-history-event-details/workflow-history-event-details.types';
import type WorkflowHistoryGroupDetails from '../../workflow-history-group-details/workflow-history-group-details';
import type { GroupDetailsEntries } from '../../workflow-history-group-details/workflow-history-group-details.types';
import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import WorkflowHistoryEventGroup from '../workflow-history-event-group';
import type { Props } from '../workflow-history-event-group.types';

jest.mock('@/utils/data-formatters/format-date', () =>
  jest.fn((timeMs: number) => `Formatted: ${timeMs}`)
);

jest.mock('../../helpers/generate-history-group-details', () => jest.fn());

jest.mock<typeof WorkflowHistoryGroupDetails>(
  '../../workflow-history-group-details/workflow-history-group-details',
  () =>
    jest.fn(({ groupDetailsEntries, initialEventId, onClose }) => (
      <div data-testid="workflow-history-group-details">
        <div data-testid="group-details-count">
          {groupDetailsEntries.length} events
        </div>
        {groupDetailsEntries.map(([eventId, { eventLabel }]) => (
          <div key={eventId} data-testid={`event-${eventId}`}>
            {eventLabel}
          </div>
        ))}
        {initialEventId && (
          <div data-testid="initial-event-id">{initialEventId}</div>
        )}
        {onClose && (
          <button onClick={onClose} data-testid="group-details-close">
            Close
          </button>
        )}
      </div>
    ))
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
      label: 'Started',
      status: 'COMPLETED',
      timeMs: 1725747370612,
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
  beforeEach(() => {
    jest.restoreAllMocks();
  });

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

    // Panel should be expanded if any event is expanded, showing WorkflowHistoryGroupDetails
    expect(
      screen.getByTestId('workflow-history-group-details')
    ).toBeInTheDocument();
    expect(screen.getByTestId('group-details-count')).toHaveTextContent(
      `${completedActivityTaskEvents.length} events`
    );
  });

  it('passes initialEventId to WorkflowHistoryGroupDetails when selectedEventId is provided', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: completedActivityTaskEvents,
    };

    const selectedEventId = completedActivityTaskEvents[0].eventId;
    const getIsEventExpanded = jest.fn(
      (eventId: string) => eventId === completedActivityTaskEvents[0].eventId
    );

    setup({ eventGroup, selectedEventId, getIsEventExpanded });

    // Panel should be expanded, showing WorkflowHistoryGroupDetails
    expect(
      screen.getByTestId('workflow-history-group-details')
    ).toBeInTheDocument();
    // initialEventId should be passed and rendered
    expect(screen.getByTestId('initial-event-id')).toHaveTextContent(
      selectedEventId!
    );
  });

  it('calls toggleIsEventExpanded for each event when panel is toggled', async () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: [scheduleActivityTaskEvent, startActivityTaskEvent],
    };

    const toggleIsEventExpanded = jest.fn();
    const { user } = setup({ eventGroup, toggleIsEventExpanded });

    // Click on the header content to toggle the panel
    const headerLabel = screen.getByText('Mock event');
    await user.click(headerLabel);

    expect(toggleIsEventExpanded).toHaveBeenCalledTimes(2);
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

  it('calls toggleIsEventExpanded when WorkflowHistoryGroupDetails onClose is called', async () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: completedActivityTaskEvents,
    };

    const toggleIsEventExpanded = jest.fn();
    const getIsEventExpanded = jest.fn(
      (eventId: string) => eventId === completedActivityTaskEvents[0].eventId
    );

    const { user } = setup({
      eventGroup,
      getIsEventExpanded,
      toggleIsEventExpanded,
    });

    const closeButton = screen.getByTestId('group-details-close');
    await user.click(closeButton);

    // Should call toggleIsEventExpanded for each expanded event
    completedActivityTaskEvents.forEach((event) => {
      if (event.eventId && getIsEventExpanded(event.eventId)) {
        expect(toggleIsEventExpanded).toHaveBeenCalledWith(event.eventId);
      }
    });
  });

  it('shows summary tab when summaryDetailsEntries are available', () => {
    const mockEventDetails: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: 'test input value',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const mockSummaryDetails: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: 'test input value',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: completedActivityTaskEvents,
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          summaryFields: ['input', 'activityType'],
        },
        {
          label: 'Started',
          status: 'COMPLETED',
          timeMs: 1725747370612,
          timeLabel: 'Started at 07 Sep, 22:16:10 UTC',
          summaryFields: ['activityType'],
        },
        {
          label: 'Completed',
          status: 'COMPLETED',
          timeMs: 1725747370632,
          timeLabel: 'Completed at 07 Sep, 22:16:10 UTC',
          summaryFields: ['result'],
        },
      ],
    };

    const getIsEventExpanded = jest.fn(
      (eventId: string) => eventId === completedActivityTaskEvents[0].eventId
    );

    setup({
      eventGroup,
      getIsEventExpanded,
      mockGroupDetails: {
        groupDetailsEntries: [
          [
            completedActivityTaskEvents[0].eventId!,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockEventDetails,
            },
          ],
          [
            completedActivityTaskEvents[1].eventId!,
            {
              eventLabel: 'Started',
              eventDetails: mockEventDetails,
            },
          ],
          [
            completedActivityTaskEvents[2].eventId!,
            {
              eventLabel: 'Completed',
              eventDetails: mockEventDetails,
            },
          ],
        ],
        summaryDetailsEntries: [
          [
            completedActivityTaskEvents[0].eventId!,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockSummaryDetails,
            },
          ],
          [
            completedActivityTaskEvents[1].eventId!,
            {
              eventLabel: 'Started',
              eventDetails: mockSummaryDetails,
            },
          ],
        ],
      },
    });

    // Summary tab should appear in groupDetailsEntries when there are summary details
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('does not show summary tab when only one event is present in the group', () => {
    const mockEventDetails: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: 'test input value',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          summaryFields: ['input'],
        },
      ],
    };

    setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: [
          [
            scheduleActivityTaskEvent.eventId!,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockEventDetails,
            },
          ],
        ],
        summaryDetailsEntries: [
          [
            scheduleActivityTaskEvent.eventId!,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockEventDetails,
            },
          ],
        ],
      },
    });

    // Summary tab should not appear when there is only one event
    expect(screen.queryByText('Summary')).not.toBeInTheDocument();
  });

  it('does not show summary tab when summaryDetailsEntries is empty', () => {
    const mockEventDetails: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: 'test input value',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroupWithMetadata,
      events: completedActivityTaskEvents,
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          summaryFields: ['nonExistentField'],
        },
        {
          label: 'Started',
          status: 'COMPLETED',
          timeMs: 1725747370612,
          timeLabel: 'Started at 07 Sep, 22:16:10 UTC',
          summaryFields: ['anotherNonExistentField'],
        },
        {
          label: 'Completed',
          status: 'COMPLETED',
          timeMs: 1725747370632,
          timeLabel: 'Completed at 07 Sep, 22:16:10 UTC',
        },
      ],
    };

    setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: [
          [
            completedActivityTaskEvents[0].eventId!,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockEventDetails,
            },
          ],
          [
            completedActivityTaskEvents[1].eventId!,
            {
              eventLabel: 'Started',
              eventDetails: mockEventDetails,
            },
          ],
          [
            completedActivityTaskEvents[2].eventId!,
            {
              eventLabel: 'Completed',
              eventDetails: mockEventDetails,
            },
          ],
        ],
        summaryDetailsEntries: [],
      },
    });

    // Summary tab should not appear when summaryDetailsEntries is empty
    expect(screen.queryByText('Summary')).not.toBeInTheDocument();
  });
});

function setup({
  eventGroup = mockActivityEventGroupWithMetadata,
  selectedEventId = undefined,
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
  mockGroupDetails,
}: Partial<Props> & {
  mockGroupDetails?: {
    groupDetailsEntries: GroupDetailsEntries;
    summaryDetailsEntries: GroupDetailsEntries;
  };
} = {}) {
  const mockGenerateHistoryGroupDetails = jest.spyOn(
    generateHistoryGroupDetailsModule,
    'default'
  );

  if (mockGroupDetails) {
    mockGenerateHistoryGroupDetails.mockReturnValue(mockGroupDetails);
  } else {
    const defaultMockEventDetails: EventDetailsEntries = [
      {
        key: 'testKey',
        path: 'testPath',
        value: 'testValue',
        isGroup: false,
        renderConfig: null,
      },
    ];

    mockGenerateHistoryGroupDetails.mockReturnValue({
      groupDetailsEntries: eventGroup.events
        .filter((event) => event.eventId)
        .map((event, index) => [
          event.eventId!,
          {
            eventLabel: eventGroup.eventsMetadata[index]?.label ?? 'Unknown',
            eventDetails: defaultMockEventDetails,
          },
        ]),
      summaryDetailsEntries: [],
    });
  }

  const mockOnReset = onReset || jest.fn();
  const user = userEvent.setup();

  render(
    <WorkflowHistoryEventGroup
      eventGroup={eventGroup}
      selectedEventId={selectedEventId}
      workflowCloseTimeMs={workflowCloseTimeMs}
      workflowCloseStatus={workflowCloseStatus}
      workflowIsArchived={workflowIsArchived}
      showLoadingMoreEvents={showLoadingMoreEvents}
      decodedPageUrlParams={decodedPageUrlParams}
      onReset={mockOnReset}
      getIsEventExpanded={getIsEventExpanded}
      toggleIsEventExpanded={toggleIsEventExpanded}
      onClickShowInTimeline={jest.fn()}
    />
  );

  return {
    mockOnReset,
    user,
    toggleIsEventExpanded,
    getIsEventExpanded,
  };
}
