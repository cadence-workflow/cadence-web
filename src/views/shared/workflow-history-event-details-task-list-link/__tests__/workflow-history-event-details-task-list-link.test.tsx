import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';
import useDescribeTaskList from '@/views/shared/hooks/use-describe-task-list/use-describe-task-list';

import WorkflowHistoryEventDetailsTaskListLink from '../workflow-history-event-details-task-list-link';
import { type Props } from '../workflow-history-event-details-task-list-link.types';

jest.mock(
  '@/views/shared/hooks/use-describe-task-list/use-describe-task-list',
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

jest.mock(
  '@/views/shared/task-list-workers-badge/task-list-workers-badge',
  () =>
    function MockTaskListWorkersBadge({
      variant,
      count,
      isLoading,
    }: {
      variant: string;
      count?: number;
      isLoading?: boolean;
    }) {
      if (isLoading) return <div data-testid="badge-loading" />;
      return (
        <div data-testid={`badge-${variant}`}>
          {count === undefined ? variant : `${variant}:${count}`}
        </div>
      );
    }
);

const mockedUseDescribeTaskList = useDescribeTaskList as jest.MockedFunction<
  typeof useDescribeTaskList
>;

const mockTaskListResponse: DescribeTaskListResponse = {
  taskList: {
    name: 'testTaskListName',
    workers: [
      {
        hasActivityHandler: true,
        hasDecisionHandler: false,
        identity: 'a',
        lastAccessTime: 1,
        ratePerSecond: 1,
      },
      {
        hasActivityHandler: false,
        hasDecisionHandler: true,
        identity: 'd',
        lastAccessTime: 1,
        ratePerSecond: 1,
      },
      {
        hasActivityHandler: true,
        hasDecisionHandler: true,
        identity: 'both',
        lastAccessTime: 1,
        ratePerSecond: 1,
      },
    ],
    decisionTaskListStatus: null,
    activityTaskListStatus: null,
  },
};

const defaultProps = {
  cluster: 'testCluster',
  domain: 'testDomain',
  taskList: {
    name: 'testTaskListName',
    kind: 'NORMAL',
  },
} as const satisfies Props;

describe('WorkflowHistoryEventDetailsTaskListLink', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the link with correct href and workers badge', () => {
    setup();

    const linkElement = screen
      .getByText(defaultProps.taskList.name)
      .closest('a');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${defaultProps.domain}/${defaultProps.cluster}/task-lists/${defaultProps.taskList.name}`
    );
    expect(screen.getByTestId('badge-workers')).toHaveTextContent('workers:3');
    expect(mockedUseDescribeTaskList).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: defaultProps.domain,
        cluster: defaultProps.cluster,
        taskListName: defaultProps.taskList.name,
      })
    );
  });

  it('should count decision handlers when handlerKind is decision', () => {
    setup({ handlerKind: 'decision' });

    expect(screen.getByTestId('badge-decision')).toHaveTextContent(
      'decision:2'
    );
  });

  it('should count activity handlers when handlerKind is activity', () => {
    setup({ handlerKind: 'activity' });

    expect(screen.getByTestId('badge-activity')).toHaveTextContent(
      'activity:2'
    );
  });

  it('should show a loading badge while fetching', () => {
    setup({}, { isLoading: true, data: undefined });

    expect(screen.getByTestId('badge-loading')).toBeInTheDocument();
  });

  it('should render sticky task list as text with a sticky badge and not fetch', () => {
    setup({
      taskList: {
        name: 'testTaskListName',
        kind: 'STICKY',
      },
    });

    expect(screen.getByText(defaultProps.taskList.name)).toBeInTheDocument();
    expect(
      screen.getByText(defaultProps.taskList.name).closest('a')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('badge-sticky')).toBeInTheDocument();
    expect(screen.queryByTestId('badge-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-workers')).not.toBeInTheDocument();
    expect(mockedUseDescribeTaskList).toHaveBeenCalledWith(
      expect.objectContaining({ taskListName: '' })
    );
  });

  it('should omit the workers badge when fetch fails', () => {
    setup({}, { isError: true, data: undefined, isLoading: false });

    expect(screen.getByText(defaultProps.taskList.name)).toBeInTheDocument();
    expect(screen.queryByTestId('badge-workers')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-loading')).not.toBeInTheDocument();
  });

  it('should not render link if taskList name is empty', () => {
    setup({
      taskList: {
        name: '',
        kind: 'STICKY',
      },
    });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-sticky')).not.toBeInTheDocument();
  });
});

function setup(
  props: Partial<Props> = {},
  query: {
    data?: DescribeTaskListResponse | undefined;
    isLoading?: boolean;
    isError?: boolean;
  } = {}
) {
  mockedUseDescribeTaskList.mockReturnValue({
    data:
      query.data === undefined && !query.isError && !query.isLoading
        ? mockTaskListResponse
        : query.data,
    isLoading: query.isLoading ?? false,
    isError: query.isError ?? false,
    error: query.isError ? new Error('Error fetching task list') : null,
  });

  return render(
    <WorkflowHistoryEventDetailsTaskListLink {...defaultProps} {...props} />
  );
}
