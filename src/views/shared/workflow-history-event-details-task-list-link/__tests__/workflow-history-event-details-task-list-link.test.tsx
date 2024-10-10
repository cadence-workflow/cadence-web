import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowHistoryEventDetailsTaskListLink from '../workflow-history-event-details-task-list-link';
import { type Props } from '../workflow-history-event-details-task-list-link.types';

describe('WorkflowHistoryEventDetailsTaskListLink', () => {
  const props = {
    cluster: 'testCluster',
    domain: 'testDomain',
    taskList: {
      name: 'testTaskListName',
      kind: 'NORMAL',
    },
  } as const satisfies Props;

  it('should render the link with correct href', () => {
    const { getByText } = render(
      <WorkflowHistoryEventDetailsTaskListLink {...props} />
    );

    const linkElement = getByText(props.taskList.name).closest('a');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/task-lists/${props.taskList.name}`
    );
  });

  it('should render sticky task list as text', () => {
    const stickyTasklistProps = {
      ...props,
      taskList: {
        name: 'testTaskListName',
        kind: 'STICKY',
      },
    } as const satisfies Props;
    const { getByText, queryByText } = render(
      <WorkflowHistoryEventDetailsTaskListLink {...stickyTasklistProps} />
    );
    expect(getByText(props.taskList.name)).toBeInTheDocument();

    expect(
      queryByText(props.taskList.name)?.closest('a')
    ).not.toBeInTheDocument();
  });

  it('should not render link if taskList name is empty', () => {
    const emptyTasklistProps = {
      ...props,
      taskList: {
        name: '',
        kind: 'STICKY',
      },
    } as const satisfies Props;
    const { queryByRole } = render(
      <WorkflowHistoryEventDetailsTaskListLink {...emptyTasklistProps} />
    );
    expect(queryByRole('link')).not.toBeInTheDocument();
  });
});
