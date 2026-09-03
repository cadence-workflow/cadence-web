import { render, screen } from '@/test-utils/rtl';

import TaskListWorkersBadge from '../task-list-workers-badge';
import { TASK_LIST_WORKERS_BADGE_TOOLTIPS } from '../task-list-workers-badge.constants';
import { type Props } from '../task-list-workers-badge.types';

jest.mock('baseui/tag', () => ({
  ...jest.requireActual('baseui/tag'),
  Tag: jest.fn(({ kind, children }) => (
    <div data-testid={`mock-tag-${kind}`}>{children}</div>
  )),
}));

jest.mock('baseui/skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />),
}));

jest.mock('baseui/tooltip', () => ({
  StatefulTooltip: jest.fn(({ content, children }) => (
    <div>
      <div data-testid="tooltip-content">{content}</div>
      {children}
    </div>
  )),
}));

describe(TaskListWorkersBadge.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const cases: Array<{
    name: string;
    props: Props;
    text: string;
    kind: string;
    tooltip: string;
  }> = [
    {
      name: 'renders multiple workers',
      props: { variant: 'workers', count: 2 },
      text: '2 workers',
      kind: 'accent',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.workers,
    },
    {
      name: 'renders one worker',
      props: { variant: 'workers', count: 1 },
      text: '1 worker',
      kind: 'accent',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.workers,
    },
    {
      name: 'renders zero workers as negative',
      props: { variant: 'workers', count: 0 },
      text: '0 workers',
      kind: 'negative',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.workers,
    },
    {
      name: 'renders decision handlers',
      props: { variant: 'decision', count: 3 },
      text: '3 decision handlers',
      kind: 'accent',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.decision,
    },
    {
      name: 'renders one decision handler',
      props: { variant: 'decision', count: 1 },
      text: '1 decision handler',
      kind: 'accent',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.decision,
    },
    {
      name: 'renders activity handlers',
      props: { variant: 'activity', count: 2 },
      text: '2 activity handlers',
      kind: 'accent',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.activity,
    },
    {
      name: 'renders one activity handler',
      props: { variant: 'activity', count: 1 },
      text: '1 activity handler',
      kind: 'accent',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.activity,
    },
    {
      name: 'renders sticky badge',
      props: { variant: 'sticky' },
      text: 'Sticky',
      kind: 'accent',
      tooltip: TASK_LIST_WORKERS_BADGE_TOOLTIPS.sticky,
    },
  ];

  cases.forEach((test) => {
    it(test.name, () => {
      setup(test.props);

      expect(screen.getByText(test.text)).toBeInTheDocument();
      expect(screen.getByTestId(`mock-tag-${test.kind}`)).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
        test.tooltip
      );
    });
  });

  it('renders a skeleton while loading', () => {
    setup({ variant: 'workers', count: 2, isLoading: true });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByText('2 workers')).not.toBeInTheDocument();
  });
});

function setup(props: Props) {
  render(<TaskListWorkersBadge {...props} />);
}
