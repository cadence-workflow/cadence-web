import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowSummaryTabDetailsExecutionLink from '../workflow-summary-tab-details-wf-execution-link';

describe('WorkflowSummaryTabDetailsExecutionLink', () => {
  const props = {
    runId: 'testRunId',
    workflowId: 'testWorkflowId',
    cluster: 'testCluster',
    domain: 'testDomain',
  };

  it('should render the link with correct href', () => {
    const { getByText } = render(
      <WorkflowSummaryTabDetailsExecutionLink {...props} />
    );

    const linkElement = getByText(props.runId).closest('a');
    expect(linkElement).toHaveAttribute(
      'href',
      `/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}`
    );
  });

  it('should render the runId as link text', () => {
    const { getByText } = render(
      <WorkflowSummaryTabDetailsExecutionLink {...props} />
    );

    expect(getByText(props.runId)).toBeInTheDocument();
  });
});
