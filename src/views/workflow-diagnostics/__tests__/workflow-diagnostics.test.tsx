import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';

import WorkflowDiagnostics from '../workflow-diagnostics';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }) => <div data-testid="error-panel">{message}</div>)
);

jest.mock('@/components/panel-section/panel-section', () =>
  jest.fn(({ children }) => <div data-testid="panel-section">{children}</div>)
);

jest.mock('../workflow-diagnostics-content/workflow-diagnostics-content', () =>
  jest.fn(({ domain, cluster, workflowId, runId }) => (
    <div data-testid="workflow-diagnostics-content">
      <div>Domain: {domain}</div>
      <div>Cluster: {cluster}</div>
      <div>Workflow ID: {workflowId}</div>
      <div>Run ID: {runId}</div>
    </div>
  ))
);

jest.mock('../config/workflow-diagnostics-disabled-error-panel.config', () => ({
  message: 'Workflow Diagnostics is currently disabled',
}));

describe(WorkflowDiagnostics.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render workflow diagnostics content when diagnostics is enabled', async () => {
    await setup({ isDiagnosticsEnabled: true });

    await screen.findByTestId('workflow-diagnostics-content');

    expect(
      screen.getByTestId('workflow-diagnostics-content')
    ).toBeInTheDocument();
    expect(screen.getByText('Domain: test-domain')).toBeInTheDocument();
    expect(screen.getByText('Cluster: test-cluster')).toBeInTheDocument();
    expect(
      screen.getByText('Workflow ID: test-workflow-id')
    ).toBeInTheDocument();
    expect(screen.getByText('Run ID: test-run-id')).toBeInTheDocument();
  });

  it('should render error panel when diagnostics is disabled', async () => {
    await setup({ isDiagnosticsEnabled: false });

    await screen.findByTestId('error-panel');

    expect(screen.getByTestId('panel-section')).toBeInTheDocument();
    expect(
      screen.getByText('Workflow Diagnostics is currently disabled')
    ).toBeInTheDocument();
  });

  it('should handle config API errors gracefully', async () => {
    await setup({ isDiagnosticsEnabled: false, error: true });

    expect(
      await screen.findByText('Error: Failed to fetch config')
    ).toBeInTheDocument();
  });
});

async function setup({
  isDiagnosticsEnabled,
  error,
}: {
  isDiagnosticsEnabled: boolean;
  error?: boolean;
}) {
  render(
    <ErrorBoundary
      fallbackRender={({ error }) => <div>Error: {error.message}</div>}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <WorkflowDiagnostics
          params={{
            cluster: 'test-cluster',
            domain: 'test-domain',
            runId: 'test-run-id',
            workflowId: 'test-workflow-id',
            workflowTab: 'diagnostics',
          }}
        />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(isDiagnosticsEnabled ?? false);
            }
          },
        },
      ],
    }
  );
}
