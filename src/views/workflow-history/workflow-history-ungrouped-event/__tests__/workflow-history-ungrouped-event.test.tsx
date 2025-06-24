import { render, screen, userEvent } from '@/test-utils/rtl';

import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '../../__fixtures__/workflow-history-pending-events';
import { startWorkflowExecutionEvent } from '../../__fixtures__/workflow-history-single-events';
import getRetriesForHistoryEvent from '../helpers/get-retries-for-history-event';
import WorkflowHistoryUngroupedEvent from '../workflow-history-ungrouped-event';
import { type WorkflowHistoryUngroupedEventInfo } from '../workflow-history-ungrouped-event.types';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdHourglassTop: () => <div data-testid="hourglass-icon" />,
}));

jest.mock('../helpers/get-retries-for-history-event', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(undefined),
}));

jest.mock(
  '../../workflow-history-event-status-badge/workflow-history-event-status-badge',
  () => ({
    __esModule: true,
    default: ({
      status,
      statusReady,
    }: {
      status: string;
      statusReady: boolean;
    }) => (
      <div
        data-testid="status-badge"
        data-status={status}
        data-ready={statusReady}
      >
        {status}
      </div>
    ),
  })
);

jest.mock(
  '../../workflow-history-event-link-button/workflow-history-event-link-button',
  () => ({
    __esModule: true,
    default: ({
      historyEventId,
      isUngroupedView,
    }: {
      historyEventId: string;
      isUngroupedView: boolean;
    }) => (
      <div
        data-testid="event-link-button"
        data-event-id={historyEventId}
        data-ungrouped={isUngroupedView}
      >
        Link to Event {historyEventId}
      </div>
    ),
  })
);

jest.mock(
  '../../workflow-history-event-details/workflow-history-event-details',
  () => ({
    __esModule: true,
    default: ({ event }: { event: any; decodedPageUrlParams: any }) => (
      <div
        data-testid="event-details"
        data-event-id={event.eventId || event.computedEventId}
      >
        Expanded Content
      </div>
    ),
  })
);

jest.mock(
  '../../workflow-history-timeline-reset-button/workflow-history-timeline-reset-button',
  () => ({
    __esModule: true,
    default: ({ onReset }: { onReset: () => void }) => (
      <button onClick={onReset} data-testid="reset-button">
        Reset
      </button>
    ),
  })
);

const mockEventInfo: WorkflowHistoryUngroupedEventInfo = {
  id: '1',
  label: 'Workflow Execution Started',
  status: 'COMPLETED',
  statusLabel: 'Completed',
  event: startWorkflowExecutionEvent,
};

const mockPendingActivityEventInfo: WorkflowHistoryUngroupedEventInfo = {
  id: 'pending-7',
  label: 'Activity Task Started',
  status: 'WAITING',
  statusLabel: 'Pending',
  event: pendingActivityTaskStartEvent,
};

const mockPendingDecisionEventInfo: WorkflowHistoryUngroupedEventInfo = {
  id: 'pending-7',
  label: 'Decision Task Started',
  status: 'WAITING',
  statusLabel: 'Pending',
  event: pendingDecisionTaskStartEvent,
};

const mockDecodedPageUrlParams: WorkflowPageTabsParams = {
  cluster: 'test-cluster',
  domain: 'test-domain',
  workflowId: 'test-workflow',
  runId: 'test-run',
  workflowTab: 'history' as const,
};

describe(WorkflowHistoryUngroupedEvent.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders event info correctly', () => {
    setup();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Workflow Execution Started')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('handles expansion toggle', async () => {
    const { user, mockToggleIsExpanded } = setup();

    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);

    expect(mockToggleIsExpanded).toHaveBeenCalled();
  });

  it('shows expanded content when isExpanded is true', () => {
    setup({ isExpanded: true });

    expect(screen.getByTestId('event-details')).toBeInTheDocument();
  });

  it('renders pending activity event correctly', () => {
    setup({ eventInfo: mockPendingActivityEventInfo });

    expect(screen.getByTestId('hourglass-icon')).toBeInTheDocument();
    expect(screen.getByText('Activity Task Started')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders pending decision event correctly', () => {
    setup({ eventInfo: mockPendingDecisionEventInfo });

    expect(screen.getByTestId('hourglass-icon')).toBeInTheDocument();
    expect(screen.getByText('Decision Task Started')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows retry badge when event has retries', () => {
    (getRetriesForHistoryEvent as jest.Mock).mockReturnValue(2);
    setup();

    expect(screen.getByText('2 retries')).toBeInTheDocument();
  });

  it('shows single retry badge when event has one retry', () => {
    (getRetriesForHistoryEvent as jest.Mock).mockReturnValue(1);
    setup();

    expect(screen.getByText('1 retry')).toBeInTheDocument();
  });

  it('does not show retry badge when event has no retries', () => {
    (getRetriesForHistoryEvent as jest.Mock).mockReturnValue(0);
    setup();

    expect(screen.queryByText(/retry/)).not.toBeInTheDocument();
  });

  it('renders reset button when onReset function is provided', async () => {
    const mockOnReset = jest.fn();
    setup({ onReset: mockOnReset });

    expect(await screen.findByTestId('reset-button')).toBeInTheDocument();
    expect(await screen.findByText('Reset')).toBeInTheDocument();
  });

  it('does not render reset button when onReset function is not provided', () => {
    setup({ onReset: undefined });

    expect(screen.queryByTestId('reset-button')).not.toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const mockOnReset = jest.fn();
    const { user } = setup({ onReset: mockOnReset });

    const resetButton = await screen.findByTestId('reset-button');
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});

function setup({
  eventInfo = mockEventInfo,
  isExpanded = false,
  animateBorderOnEnter = false,
  onReset,
}: {
  eventInfo?: WorkflowHistoryUngroupedEventInfo;
  isExpanded?: boolean;
  animateBorderOnEnter?: boolean;
  onReset?: (() => void) | undefined;
} = {}) {
  const mockToggleIsExpanded = jest.fn();

  const props = {
    eventInfo,
    workflowStartTime: {
      seconds: '1704067200',
      nanos: 0,
    },
    decodedPageUrlParams: mockDecodedPageUrlParams,
    isExpanded,
    toggleIsExpanded: mockToggleIsExpanded,
    animateBorderOnEnter,
    onReset,
  };

  const user = userEvent.setup();

  render(<WorkflowHistoryUngroupedEvent {...props} />);

  return {
    props,
    user,
    mockToggleIsExpanded,
  };
}
