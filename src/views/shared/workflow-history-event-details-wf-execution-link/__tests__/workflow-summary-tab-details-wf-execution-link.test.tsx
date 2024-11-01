import React from 'react';

import omit from 'lodash/omit';

import { render } from '@/test-utils/rtl';

import WorkflowHistoryEventDetailsExecutionLink from '../workflow-history-event-details-wf-execution-link';

describe('WorkflowHistoryEventDetailsExecutionLink', () => {
  const props = {
    runId: 'testRunId',
    workflowId: 'testWorkflowId',
    cluster: 'testCluster',
    domain: 'testDomain',
  };

  it('should render the link with correct href', () => {
    const { getByText } = render(
      <WorkflowHistoryEventDetailsExecutionLink {...props} />
    );

    const linkElement = getByText(props.runId).closest('a');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}`
    );
  });

  it('should render the runId as link text', () => {
    const { getByText } = render(
      <WorkflowHistoryEventDetailsExecutionLink {...props} />
    );

    expect(getByText(props.runId)).toBeInTheDocument();
  });

  it('should render disabled link with empty href if any prop is missing', () => {
    const propKeys = Object.keys(props);

    propKeys.forEach((key) => {
      const { container } = render(
        // @ts-expect-error testing missing props
        <WorkflowHistoryEventDetailsExecutionLink {...omit(props, key)} />
      );
      const linkElement = container.querySelector('a');
      expect(linkElement).toHaveAttribute('href', '/');
    });
  });
});
