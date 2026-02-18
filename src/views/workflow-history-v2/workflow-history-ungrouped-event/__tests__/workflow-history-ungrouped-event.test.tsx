import { render, screen, userEvent } from '@/test-utils/rtl';

import {
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';
import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import type WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import type WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import type WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import * as generateHistoryGroupDetailsModule from '../../helpers/generate-history-group-details';
import type { EventDetailsEntries } from '../../workflow-history-event-details/workflow-history-event-details.types';
import type WorkflowHistoryGroupDetails from '../../workflow-history-group-details/workflow-history-group-details';
import type { GroupDetailsEntries } from '../../workflow-history-group-details/workflow-history-group-details.types';
import type { UngroupedEventInfo } from '../../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';
import {
  type ExtendedHistoryEvent,
  type ActivityHistoryGroup,
} from '../../workflow-history-v2.types';
import WorkflowHistoryUngroupedEvent from '../workflow-history-ungrouped-event';
import type { Props } from '../workflow-history-ungrouped-event.types';

jest.mock('@/utils/data-formatters/format-date', () =>
  jest.fn((timeMs: number) => `Formatted: ${timeMs}`)
);

jest.mock('@/utils/datetime/parse-grpc-timestamp', () =>
  jest.fn((timestamp) => {
    if (timestamp?.seconds) {
      return (
        parseInt(timestamp.seconds) * 1000 + (timestamp.nanos || 0) / 1000000
      );
    }
    return null;
  })
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
  '../../workflow-history-event-group-duration/helpers/get-formatted-events-duration',
  () => jest.fn(() => '1m 30s')
);

jest.mock(
  '../../workflow-history-event-group/helpers/get-event-group-filtering-type',
  () => jest.fn(() => 'ACTIVITY')
);

const mockActivityEventGroupWithMetadata: ActivityHistoryGroup = {
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

const createMockEventInfo = (
  event: ExtendedHistoryEvent = scheduleActivityTaskEvent,
  eventMetadataIndex = 0
): UngroupedEventInfo => ({
  id: event.eventId ?? 'unknown',
  groupId: 'groupId',
  event: event,
  eventMetadata:
    mockActivityEventGroupWithMetadata.eventsMetadata[eventMetadataIndex],
  eventGroup: mockActivityEventGroupWithMetadata,
  label: mockActivityEventGroupWithMetadata.label,
  shortLabel: mockActivityEventGroupWithMetadata.shortLabel,
  canReset: false,
});

describe(WorkflowHistoryUngroupedEvent.name, () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders event correctly', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo });

    expect(screen.getByText(eventInfo.id)).toBeInTheDocument();
    expect(
      screen.getByText(mockActivityEventGroupWithMetadata.label)
    ).toBeInTheDocument();
    expect(screen.getByText('1m 30s')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });

  it('renders formatted date when eventTime is provided', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo });

    expect(screen.getByText(/Formatted:/)).toBeInTheDocument();
  });

  it('does not render date when eventTime is missing', () => {
    const eventInfo = createMockEventInfo({
      ...scheduleActivityTaskEvent,
      eventTime: null,
    });
    setup({ eventInfo });

    expect(screen.queryByText(/Formatted:/)).not.toBeInTheDocument();
  });

  it('renders duration when eventTime and workflowStartTimeMs are provided', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo, workflowStartTimeMs: 1725747370000 });

    expect(screen.getByText('1m 30s')).toBeInTheDocument();
  });

  it('does not render duration when workflowStartTimeMs is missing', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo, workflowStartTimeMs: null });

    expect(screen.queryByText('1m 30s')).not.toBeInTheDocument();
  });

  it('renders reset button when canReset is true', () => {
    const eventInfo = createMockEventInfo();
    const eventInfoWithReset = {
      ...eventInfo,
      canReset: true,
    };
    setup({ eventInfo: eventInfoWithReset });

    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const eventInfo = createMockEventInfo();
    const eventInfoWithReset = {
      ...eventInfo,
      canReset: true,
    };
    const { mockOnReset, user } = setup({ eventInfo: eventInfoWithReset });

    const resetButton = screen.getByTestId('reset-button');
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('expands panel when isExpanded is true', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo, isExpanded: true });

    expect(
      screen.getByTestId('workflow-history-group-details')
    ).toBeInTheDocument();
  });

  it('does not expand panel when isExpanded is false', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo, isExpanded: false });

    expect(
      screen.queryByTestId('workflow-history-group-details')
    ).not.toBeInTheDocument();
  });

  it('calls toggleIsExpanded when panel is toggled', async () => {
    const eventInfo = createMockEventInfo();
    const { mockToggleIsExpanded, user } = setup({ eventInfo });

    const headerLabel = screen.getByText(eventInfo.id);
    await user.click(headerLabel);

    expect(mockToggleIsExpanded).toHaveBeenCalledTimes(1);
  });

  it('calls toggleIsExpanded when WorkflowHistoryGroupDetails onClose is called', async () => {
    const eventInfo = createMockEventInfo();
    const { mockToggleIsExpanded, user } = setup({
      eventInfo,
      isExpanded: true,
    });

    const closeButton = screen.getByTestId('group-details-close');
    await user.click(closeButton);

    expect(mockToggleIsExpanded).toHaveBeenCalledTimes(1);
  });

  it('renders event summary details when available', () => {
    const mockEventDetails: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: 'test input value',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const mockSummaryDetails: EventDetailsEntries = [
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const eventInfo = createMockEventInfo();
    setup({
      eventInfo,
      mockGroupDetails: {
        groupDetailsEntries: [
          [
            eventInfo.id,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockEventDetails,
            },
          ],
        ],
        summaryDetailsEntries: [
          [
            eventInfo.id,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockSummaryDetails,
            },
          ],
        ],
      },
    });

    // Summary details should be rendered in the header
    expect(screen.getByText('TestActivity')).toBeInTheDocument();
  });

  it('renders empty div when event summary details are not available', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo });

    // Should render an empty div in the summarized details container
    const container = screen.getByTestId('status-badge').parentElement;
    expect(container).toBeInTheDocument();
  });

  it('includes summary tab in groupDetailsEntries when expanded', () => {
    const mockEventDetails: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: 'test input value',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const mockSummaryDetails: EventDetailsEntries = [
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const eventInfo = createMockEventInfo();
    const secondEventInfo = createMockEventInfo(startActivityTaskEvent, 1);
    setup({
      eventInfo,
      isExpanded: true,
      mockGroupDetails: {
        groupDetailsEntries: [
          [
            eventInfo.id,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockEventDetails,
            },
          ],
          [
            secondEventInfo.id,
            {
              eventLabel: 'Started',
              eventDetails: mockEventDetails,
            },
          ],
        ],
        summaryDetailsEntries: [
          [
            eventInfo.id,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockSummaryDetails,
            },
          ],
          [
            secondEventInfo.id,
            {
              eventLabel: 'Started',
              eventDetails: mockSummaryDetails,
            },
          ],
        ],
      },
    });

    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('does not include summary tab in groupDetailsEntries when there is only one entry', () => {
    const mockEventDetails: EventDetailsEntries = [
      {
        key: 'input',
        path: 'input',
        value: 'test input value',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const mockSummaryDetails: EventDetailsEntries = [
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
    ];

    const eventInfo = createMockEventInfo();
    setup({
      eventInfo,
      isExpanded: true,
      mockGroupDetails: {
        groupDetailsEntries: [
          [
            eventInfo.id,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockEventDetails,
            },
          ],
        ],
        summaryDetailsEntries: [
          [
            eventInfo.id,
            {
              eventLabel: 'Scheduled',
              eventDetails: mockSummaryDetails,
            },
          ],
        ],
      },
    });

    expect(screen.queryByText('Summary')).not.toBeInTheDocument();
  });

  it('renders status badge with correct status', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo });

    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });

  it('renders event metadata label', () => {
    const eventInfo = createMockEventInfo();
    setup({ eventInfo });

    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });
});

function setup({
  eventInfo,
  workflowStartTimeMs = 1725747370000,
  decodedPageUrlParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    workflowTab: 'history',
  },
  isExpanded = false,
  toggleIsExpanded = jest.fn(),
  animateOnEnter = false,
  onReset = jest.fn(),
  onClickShowInTimeline = jest.fn(),
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

    const defaultEventInfo = eventInfo ?? createMockEventInfo();
    mockGenerateHistoryGroupDetails.mockReturnValue({
      groupDetailsEntries: defaultEventInfo.eventGroup.events
        .filter((event) => event.eventId)
        .map((event, index) => [
          event.eventId!,
          {
            eventLabel:
              defaultEventInfo.eventGroup.eventsMetadata[index]?.label ??
              'Unknown',
            eventDetails: defaultMockEventDetails,
          },
        ]),
      summaryDetailsEntries: [],
    });
  }

  const mockToggleIsExpanded = toggleIsExpanded || jest.fn();
  const mockOnReset = onReset || jest.fn();
  const mockOnClickShowInTimeline = onClickShowInTimeline || jest.fn();
  const user = userEvent.setup();

  const defaultEventInfo = eventInfo ?? createMockEventInfo();

  render(
    <WorkflowHistoryUngroupedEvent
      eventInfo={eventInfo ?? defaultEventInfo}
      workflowStartTimeMs={workflowStartTimeMs}
      decodedPageUrlParams={decodedPageUrlParams}
      isExpanded={isExpanded}
      toggleIsExpanded={mockToggleIsExpanded}
      animateOnEnter={animateOnEnter}
      onReset={mockOnReset}
      onClickShowInTimeline={mockOnClickShowInTimeline}
    />
  );

  return {
    mockToggleIsExpanded,
    mockOnReset,
    mockOnClickShowInTimeline,
    user,
  };
}
