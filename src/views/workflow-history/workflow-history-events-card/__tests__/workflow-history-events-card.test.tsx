import { render, screen, userEvent } from '@/test-utils/rtl';

import {
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '../../__fixtures__/workflow-history-activity-events';
import { pendingActivityTaskStartEvent } from '../../__fixtures__/workflow-history-pending-events';
import WorkflowHistoryEventsCard from '../workflow-history-events-card';
import type { Props } from '../workflow-history-events-card.types';

jest.mock(
  '../../workflow-history-event-status-badge/workflow-history-event-status-badge',
  () => jest.fn(({ status }) => <div>{status} status</div>)
);

jest.mock(
  '../../workflow-history-event-details/workflow-history-event-details',
  () => jest.fn(({ event }) => <div>Details eventId: {event.eventId}</div>)
);

jest.mock(
  '../../workflow-history-event-summary/workflow-history-event-summary',
  () => jest.fn(() => <div>Event summary</div>)
);

jest.mock(
  '../../workflow-history-event-link-button/workflow-history-event-link-button',
  () =>
    jest.fn(({ historyEventId }) => (
      <div data-testid="event-link-button" data-event-id={historyEventId}>
        Link to Event {historyEventId}
      </div>
    ))
);

describe('WorkflowHistoryEventsCard', () => {
  it('shows events label and status correctly', () => {
    const events: Props['events'] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
    ];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
      {
        label: 'Second event',
        status: 'ONGOING',
      },
    ];
    setup({
      events,
      eventsMetadata,
    });

    expect(screen.getByText('First event')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED status')).toBeInTheDocument();

    expect(screen.getByText('Second event')).toBeInTheDocument();
    expect(screen.getByText('ONGOING status')).toBeInTheDocument();
  });

  it('render accordion collapsed when get getIsEventExpanded returns false', () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    setup({
      events,
      eventsMetadata,
      getIsEventExpanded: jest.fn().mockReturnValue(false),
    });

    expect(
      screen.queryByText(
        `Details eventId: ${scheduleActivityTaskEvent.eventId}`
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('event-link-button')).not.toBeInTheDocument();
  });

  it('render accordion expanded when get getIsEventExpanded returns true', async () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    setup({
      events,
      eventsMetadata,
      getIsEventExpanded: jest.fn().mockReturnValue(true),
    });

    expect(
      await screen.findByText(
        `Details eventId: ${scheduleActivityTaskEvent.eventId}`
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('event-link-button')).toBeInTheDocument();
    expect(screen.getByTestId('event-link-button')).toHaveAttribute(
      'data-event-id',
      scheduleActivityTaskEvent.eventId
    );
  });

  it('should show copy button when event is expanded', () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    setup({
      events,
      eventsMetadata,
      getIsEventExpanded: jest.fn().mockReturnValue(true),
    });

    expect(screen.getByTestId('event-link-button')).toBeInTheDocument();
    expect(screen.getByTestId('event-link-button')).toHaveAttribute(
      'data-event-id',
      scheduleActivityTaskEvent.eventId
    );
  });

  it('should not show copy button for pending event even when expanded', () => {
    const events: Props['events'] = [pendingActivityTaskStartEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'Pending event',
        status: 'WAITING',
      },
    ];
    setup({
      events,
      eventsMetadata,
      getIsEventExpanded: jest.fn().mockReturnValue(true),
    });

    expect(screen.queryByTestId('event-link-button')).not.toBeInTheDocument();
  });

  it('should call onEventToggle callback on click', async () => {
    const events: Props['events'] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
    ];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
      {
        label: 'Second event',
        status: 'ONGOING',
      },
    ];

    const { user, mockedOnEventToggle } = setup({
      events,
      eventsMetadata,
    });

    expect(
      screen.queryByText(JSON.stringify(events[1]))
    ).not.toBeInTheDocument();

    await user.click(screen.getByText('Second event'));

    expect(mockedOnEventToggle).toHaveBeenCalledWith('9');
  });

  it('should add placeholder event when showMissingEventPlaceholder is set to true', async () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    const { container } = setup({
      events,
      eventsMetadata,
      showEventPlaceholder: true,
    });
    expect(container.querySelector('[testid="loader"]')).toBeInTheDocument();
  });

  it('should add placeholder event when showMissingEventPlaceholder and eventsMetadata is empty', async () => {
    const events: Props['events'] = [];
    const eventsMetadata: Props['eventsMetadata'] = [];
    const { container } = setup({
      events,
      eventsMetadata,
      showEventPlaceholder: true,
    });
    expect(container.querySelector('[testid="loader"]')).toBeInTheDocument();
  });

  it('should show summary when accordion is not expanded', () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    setup({
      events,
      eventsMetadata,
      getIsEventExpanded: jest.fn().mockReturnValue(false),
    });

    expect(screen.getByText('Event summary')).toBeInTheDocument();
  });

  it('should not show summary when accordion is expanded', () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    setup({
      events,
      eventsMetadata,
      getIsEventExpanded: jest.fn().mockReturnValue(true),
    });

    expect(screen.queryByText('Event summary')).not.toBeInTheDocument();
  });

  it('should handle eventsMetadata set to null gracefully', async () => {
    //@ts-expect-error Type 'null' is not assignable to type 'HistoryGroupEventMetadata[]'
    render(<WorkflowHistoryEventsCard events={null} eventsMetadata={null} />);
  });
});

const mockParams: Props['decodedPageUrlParams'] = {
  cluster: 'testCluster',
  domain: 'testDomain',
  workflowId: 'testWorkflowId',
  runId: 'testRunId',
  workflowTab: 'history',
};

function setup({
  events,
  eventsMetadata,
  decodedPageUrlParams = mockParams,
  showEventPlaceholder = false,
  onEventToggle = jest.fn(),
  getIsEventExpanded = jest.fn(),
}: Partial<Omit<Props, 'events' | 'eventsMetadata'>> &
  Pick<Props, 'events' | 'eventsMetadata'>) {
  const user = userEvent.setup();

  const props: Props = {
    events,
    eventsMetadata,
    decodedPageUrlParams,
    showEventPlaceholder,
    onEventToggle,
    getIsEventExpanded,
  };

  const renderResult = render(<WorkflowHistoryEventsCard {...props} />);

  return {
    ...renderResult,
    user,
    mockedGetIsEventExpanded: props.getIsEventExpanded,
    mockedOnEventToggle: props.onEventToggle,
  };
}
