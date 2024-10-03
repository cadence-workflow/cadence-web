import { render, screen, userEvent, act } from '@/test-utils/rtl';

import {
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '../../__fixtures__/workflow-history-activity-events';
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

describe('WorkflowHistoryEventsCard', () => {
  const mockParams: Props['decodedPageUrlParams'] = {
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
    workflowTab: 'history',
  };

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
    render(
      <WorkflowHistoryEventsCard
        events={events}
        eventsMetadata={eventsMetadata}
        decodedPageUrlParams={mockParams}
      />
    );

    expect(screen.getByText('First event')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED status')).toBeInTheDocument();

    expect(screen.getByText('Second event')).toBeInTheDocument();
    expect(screen.getByText('ONGOING status')).toBeInTheDocument();
  });

  it('render accordion collapsed initially', () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    render(
      <WorkflowHistoryEventsCard
        events={events}
        eventsMetadata={eventsMetadata}
        decodedPageUrlParams={mockParams}
      />
    );

    expect(screen.queryByText('Details eventId:')).not.toBeInTheDocument();
  });

  it('expand panel onClick', async () => {
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
    render(
      <WorkflowHistoryEventsCard
        events={events}
        eventsMetadata={eventsMetadata}
        decodedPageUrlParams={mockParams}
      />
    );
    expect(
      screen.queryByText(JSON.stringify(events[1]))
    ).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByText('Second event'));
    });
    const panelContent = screen.getByText(
      `Details eventId: ${events[1].eventId}`
    );
    expect(panelContent).toBeInTheDocument();
  });

  it('should add placeholder event when showMissingEventPlaceholder is set to true', async () => {
    const events: Props['events'] = [scheduleActivityTaskEvent];
    const eventsMetadata: Props['eventsMetadata'] = [
      {
        label: 'First event',
        status: 'COMPLETED',
      },
    ];
    const { container } = render(
      <WorkflowHistoryEventsCard
        events={events}
        eventsMetadata={eventsMetadata}
        decodedPageUrlParams={mockParams}
        showEventPlaceholder
      />
    );
    expect(container.querySelector('[testid="loader"]')).toBeInTheDocument();
  });

  it('should add placeholder event when showMissingEventPlaceholder and eventsMetadata is empty', async () => {
    const events: Props['events'] = [];
    const eventsMetadata: Props['eventsMetadata'] = [];
    const { container } = render(
      <WorkflowHistoryEventsCard
        events={events}
        eventsMetadata={eventsMetadata}
        decodedPageUrlParams={mockParams}
        showEventPlaceholder
      />
    );
    expect(container.querySelector('[testid="loader"]')).toBeInTheDocument();
  });

  it('should handle eventsMetadata set to null  gracefully', async () => {
    //@ts-expect-error Type 'null' is not assignable to type 'Pick<HistoryGroupEventMetadata, "label" | "status">[]'
    render(<WorkflowHistoryEventsCard events={null} eventsMetadata={null} />);
  });
});
