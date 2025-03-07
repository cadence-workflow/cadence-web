import React from 'react';

import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { screen, render } from '@/test-utils/rtl';

import WorkflowEventDetailsExecutionLink from '../workflow-event-details-execution-link';

describe('WorkflowEventDetailsExecutionLink', () => {
  const props = {
    runId: 'testRunId',
    workflowId: 'testWorkflowId',
    cluster: 'testCluster',
    domain: 'testDomain',
  };

  it('should render the link with correct workflow run link', () => {
    render(<WorkflowEventDetailsExecutionLink {...props} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}`
    );
  });

  it('should render runId as a the link text for workflow run link', () => {
    render(<WorkflowEventDetailsExecutionLink {...props} />);

    const linkElement = screen.getByRole('link', { name: props.runId });
    expect(linkElement).toBeInTheDocument();
  });

  it('should render the link with correct workflow search link', () => {
    render(
      <WorkflowEventDetailsExecutionLink
        domain={props.domain}
        cluster={props.cluster}
        workflowId={props.workflowId}
        runId=""
      />
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/workflows?search=${props.workflowId}&workflowId=${props.workflowId}`
    );
  });

  it('should render workflowId as a the link text for workflow search link', () => {
    render(
      <WorkflowEventDetailsExecutionLink
        domain={props.domain}
        cluster={props.cluster}
        workflowId={props.workflowId}
        runId=""
      />
    );

    const linkElement = screen.getByRole('link', { name: props.workflowId });
    expect(linkElement).toBeInTheDocument();
  });

  it('should not render link if runId and workflowId is missing', () => {
    render(
      <WorkflowEventDetailsExecutionLink
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
        <WorkflowEventDetailsExecutionLink {...omit(props, key)} />
      );
      const linkElement = container.querySelector('a');
      expect(linkElement).toHaveAttribute('href', '/');
    });
  });
});
