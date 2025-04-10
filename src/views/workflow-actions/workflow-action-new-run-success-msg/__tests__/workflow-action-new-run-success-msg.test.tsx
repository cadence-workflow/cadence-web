import { render, screen } from '@testing-library/react';

import { type RestartWorkflowResponse } from '@/route-handlers/restart-workflow/restart-workflow.types';

import WorkflowActionNewRunSuccessMsg from '../workflow-action-new-run-success-msg';

describe('WorkflowActionNewRunSuccessMsg', () => {
  const mockProps = {
    result: {
      runId: 'test-run-id',
    } as RestartWorkflowResponse,
    inputParams: {
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
    },
    successMessage: 'Workflow has been restarted.',
  };

  it('renders the success message with a link', () => {
    render(<WorkflowActionNewRunSuccessMsg {...mockProps} />);

    expect(
      screen.getByText(new RegExp(mockProps.successMessage))
    ).toBeInTheDocument();
    expect(screen.getByText('Click here')).toBeInTheDocument();
    expect(
      screen.getByText(/to view the new workflow[\.]/)
    ).toBeInTheDocument();
  });

  it('renders the link with the correct href', () => {
    render(<WorkflowActionNewRunSuccessMsg {...mockProps} />);
    const { domain, cluster, workflowId, runId } = mockProps.inputParams;
    const link = screen.getByText('Click here');
    expect(link).toHaveAttribute(
      'href',
      `/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}`
    );
  });
});
