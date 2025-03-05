import React from 'react';

import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { screen, render } from '@/test-utils/rtl';

import WorkflowHistoryEventDetailsExecutionLink from '../workflow-history-event-details-wf-execution-link';

describe('WorkflowHistoryEventDetailsExecutionLink', () => {
  const props = {
    runId: 'testRunId',
    workflowId: 'testWorkflowId',
    cluster: 'testCluster',
    domain: 'testDomain',
  };

  it('should render the link with correct workflow run link', () => {
    render(<WorkflowHistoryEventDetailsExecutionLink {...props} />);

    const linkElement = screen.getByText(props.runId).closest('a');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}`
    );
  });

  it('should render the link with correct workflow search link', () => {
    render(
      <WorkflowHistoryEventDetailsExecutionLink
        domain={props.domain}
        cluster={props.cluster}
        workflowId={props.workflowId}
        runId=""
      />
    );

    const linkElement = screen.getByText(props.workflowId).closest('a');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/workflows?search=${props.workflowId}`
    );
  });

  it('should not render link if runId and workflowId is missing', () => {
    render(
      <WorkflowHistoryEventDetailsExecutionLink
        domain={props.domain}
        cluster={props.cluster}
        workflowId=""
        runId=""
      />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render disabled link with empty href if domain, cluster or workflowId is missing', () => {
    const propKeys = Object.keys(
      pick(props, ['domain', 'cluster', 'workflowId'])
    );

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
