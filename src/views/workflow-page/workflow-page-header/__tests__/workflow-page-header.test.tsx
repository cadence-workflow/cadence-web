import React from 'react';
import { render } from '@/test-utils/rtl';
import WorkflowPageHeader from '../workflow-page-header'; // Import the component
import type { Props } from '../workflow-page-header.types';

describe('WorkflowPageHeader', () => {
  it('renders breadcrumbs with correct domain content and link', () => {
    const domain = 'test-domain';
    const cluster = 'test-cluster';
    const { getByText } = setup({ domain, cluster });
    // Verify domain breadcrumb
    const domainBreadcrumb = getByText(domain);
    expect(domainBreadcrumb).toBeInTheDocument();
    expect(domainBreadcrumb).toHaveAttribute(
      'href',
      `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}`
    );
  });

  it('renders breadcrumbs with correct workflowId content and link', () => {
    const workflowId = 'test-workflowId';
    const { getByText } = setup({ workflowId });

    // Verify workflowId breadcrumb
    const workflowIdBreadcrumb = getByText(workflowId);
    expect(workflowIdBreadcrumb).toBeInTheDocument();
    expect(workflowIdBreadcrumb).toHaveAttribute('href', `/#`);
  });

  it('renders breadcrumbs with correct runId and status tag', () => {
    const runId = 'test-runId';
    const workflowStatusTag = (
      <div data-testid="workflow-status-tag">Example Status Tag</div>
    );
    const { getByText, getByTestId } = setup({ runId, workflowStatusTag });

    // Verify runId breadcrumb
    expect(getByText(runId)).toBeInTheDocument();

    // Verify runId breadcrumb has status bage
    expect(getByTestId('workflow-status-tag')).toBeInTheDocument();
  });

  it('renders Cadence Icon image with correct alt text and source', () => {
    const { getByAltText } = setup({});

    const cadenceIcon = getByAltText('Cadence Icon');
    expect(cadenceIcon).toBeInTheDocument();
  });
});

function setup({
  domain = 'example-domain',
  workflowId = 'example-workflow-id',
  runId = 'example-run-id',
  cluster = 'example-cluster',
  workflowStatusTag = null,
}: Partial<Props>) {
  return render(
    <WorkflowPageHeader
      domain={domain}
      workflowId={workflowId}
      runId={runId}
      cluster={cluster}
      workflowStatusTag={workflowStatusTag}
    />
  );
}
