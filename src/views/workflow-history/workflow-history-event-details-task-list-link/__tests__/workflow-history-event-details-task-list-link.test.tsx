import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowHistoryEventDetailsTaskListLink from '../workflow-history-event-details-task-list-link';
import { type Props } from '../workflow-history-event-details-task-list-link.types';

describe('WorkflowHistoryEventDetailsTaskListLink', () => {
  const props: Props = {
    runId: 'testRunId',
    workflowId: 'testWorkflowId',
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowTab: 'history',
    entryKey: 'taskList',
    entryPath: 'event.taskList',
    entryValue: {
      name: 'testTaskListName',
    },
  };

  it('should render the link with correct href', () => {
    const { getByText } = render(
      <WorkflowHistoryEventDetailsTaskListLink {...props} />
    );

    const linkElement = getByText(props.entryValue.name).closest('a');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/task-lists/${props.entryValue.name}`
    );
  });

  it('should render the tasklist name as link text', () => {
    const { getByText } = render(
      <WorkflowHistoryEventDetailsTaskListLink {...props} />
    );

    expect(getByText(props.entryValue.name)).toBeInTheDocument();
  });
});
