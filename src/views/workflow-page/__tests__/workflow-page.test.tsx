import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import WorkflowPage from '../workflow-page';
import type { Props } from '../workflow-page.types';

jest.mock(
  '../workflow-page-header/workflow-page-header',
  () =>
    function TestPageHeader() {
      return <div data-testid="page-header" />;
    }
);

jest.mock(
  '../workflow-page-tabs/workflow-page-tabs',
  () =>
    function TestPageHeader() {
      return <div data-testid="page-tabs" />;
    }
);

jest.mock('../helpers/get-workflow-execution', () => ({
  getWorkflowExecution: jest.fn().mockResolvedValue({
    workflowExecutionInfo: {
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    },
  }),
}));

describe('WorkflowPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders workflow page header correctly', async () => {
    await setup({});
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
  });

  it('renders workflow page tabs correctly', async () => {
    await setup({});
    expect(screen.getByTestId('page-tabs')).toBeInTheDocument();
  });

  it('renders children', async () => {
    await setup({
      children: <div>Mock Children</div>,
    });
    expect(screen.getByText('Mock Children')).toBeInTheDocument();
  });
});

async function setup({ params, children }: Partial<Props>) {
  const p = params || {
    cluster: 'example-cluster',
    domain: 'example-domain',
    runId: 'example-runId',
    workflowId: 'example-workflowId',
  };
  const c = children || null;
  const workflowPage = await WorkflowPage({ params: p, children: c });
  return render(workflowPage);
}
