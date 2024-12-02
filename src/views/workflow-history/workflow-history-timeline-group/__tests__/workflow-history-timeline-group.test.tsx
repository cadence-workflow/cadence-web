import { render, screen } from '@/test-utils/rtl';

import { startWorkflowExecutionEvent } from '../../__fixtures__/workflow-history-single-events';
import type WorkflowHistoryEventStatusBadge from '../../workflow-history-event-status-badge/workflow-history-event-status-badge';
import type WorkflowHistoryEventsCard from '../../workflow-history-events-card/workflow-history-events-card';
import WorkflowHistoryTimelineGroup from '../workflow-history-timeline-group';
import { type styled } from '../workflow-history-timeline-group.styles';
import type { Props } from '../workflow-history-timeline-group.types';

jest.mock<typeof WorkflowHistoryEventStatusBadge>(
  '../../workflow-history-event-status-badge/workflow-history-event-status-badge',
  () => jest.fn((props) => <div>{props.status}</div>)
);

jest.mock<typeof WorkflowHistoryEventsCard>(
  '../../workflow-history-events-card/workflow-history-events-card',
  () => jest.fn(() => <div>Events Card</div>)
);

jest.mock('../workflow-history-timeline-group.styles', () => {
  const actual = jest.requireActual(
    '../workflow-history-timeline-group.styles'
  );
  return {
    ...actual,
    styled: {
      ...actual.styled,
      VerticalDivider: ({ $hidden }: { $hidden?: boolean }) => (
        <div>Divider {$hidden ? 'hidden' : 'visible'}</div>
      ),
    } satisfies typeof styled,
  };
});

describe('WorkflowHistoryTimelineGroup', () => {
  it('renders group label correctly', () => {
    setup({ label: 'test label' });

    expect(screen.getByText('test label')).toBeInTheDocument();
  });

  it('renders group status correctly', () => {
    setup({ status: 'CANCELED' });

    expect(screen.getByText('CANCELED')).toBeInTheDocument();
  });

  it('renders badges correctly', () => {
    setup({
      badges: [{ content: 'test badge 1' }, { content: 'test badge 2' }],
    });
    expect(screen.getByText('test badge 1')).toBeInTheDocument();
    expect(screen.getByText('test badge 2')).toBeInTheDocument();
  });

  it('renders group timeLabel correctly', () => {
    setup({ timeLabel: 'Started at 19 Sep, 11:37:12 GMT+2' });

    expect(
      screen.getByText('Started at 19 Sep, 11:37:12 GMT+2')
    ).toBeInTheDocument();
  });

  it('renders events card', () => {
    setup({});

    expect(screen.getByText('Events Card')).toBeInTheDocument();
  });

  it('renders divider when isLastEvent is false', () => {
    setup({ isLastEvent: false });
    expect(screen.getByText('Divider visible')).toBeInTheDocument();
  });

  it('hides divider when isLastEvent is true', () => {
    setup({ isLastEvent: true });
    expect(screen.getByText('Divider hidden')).toBeInTheDocument();
  });
});

function setup({
  label = 'Workflow Started',
  hasMissingEvents = false,
  eventsMetadata = [
    {
      label: 'Started',
      status: 'COMPLETED',
      timeMs: 1726652232190.7927,
      timeLabel: 'Started at 18 Sep, 11:37:12 GMT+2',
    },
  ],
  events = [startWorkflowExecutionEvent],
  status = 'COMPLETED',
  timeLabel = 'Started at 18 Sep, 11:37:12 GMT+2',
  isLastEvent = false,
  decodedPageUrlParams = {
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
    workflowTab: 'history',
  },
  badges,
}: Partial<Props>) {
  return render(
    <WorkflowHistoryTimelineGroup
      events={events}
      eventsMetadata={eventsMetadata}
      isLastEvent={isLastEvent}
      label={label}
      timeLabel={timeLabel}
      hasMissingEvents={hasMissingEvents}
      status={status}
      decodedPageUrlParams={decodedPageUrlParams}
      getIsEventExpanded={jest.fn()}
      onEventToggle={jest.fn()}
      badges={badges}
    />
  );
}
