import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import WorkflowDiagnostics from '../workflow-diagnostics';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }) => <div data-testid="error-panel">{message}</div>)
);

jest.mock('@/components/panel-section/panel-section', () =>
  jest.fn(({ children }) => <div data-testid="panel-section">{children}</div>)
);

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div data-testid="loading-indicator">Loading...</div>)
);

jest.mock('../workflow-diagnostics-content/workflow-diagnostics-content', () =>
  jest.fn(({ domain, cluster, workflowId, runId, diagnosticsResult }) => (
    <div data-testid="workflow-diagnostics-content">
      <div>Domain: {domain}</div>
      <div>Cluster: {cluster}</div>
      <div>Workflow ID: {workflowId}</div>
      <div>Run ID: {runId}</div>
      <div>Diagnostics Result: {JSON.stringify(diagnosticsResult)}</div>
    </div>
  ))
);

jest.mock(
  '../workflow-diagnostics-fallback/workflow-diagnostics-fallback',
  () =>
    jest.fn(({ workflowId, runId, diagnosticsResult }) => (
      <div data-testid="workflow-diagnostics-fallback">
        <div>Workflow ID: {workflowId}</div>
        <div>Run ID: {runId}</div>
        <div>Diagnostics Result: {JSON.stringify(diagnosticsResult)}</div>
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

  it('should render workflow diagnostics content when diagnostics is enabled and successful', async () => {
    await setup({
      isDiagnosticsEnabled: true,
      diagnosticsResponse: {
        result: mockWorkflowDiagnosticsResult,
        parsingError: null,
      },
    });

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

  it('should render workflow diagnostics fallback when parsing error exists', async () => {
    await setup({
      isDiagnosticsEnabled: true,
      diagnosticsResponse: {
        result: { raw: 'invalid data' },
        parsingError: new Error('Parsing failed'),
      },
    });

    await screen.findByTestId('workflow-diagnostics-fallback');

    expect(
      screen.getByTestId('workflow-diagnostics-fallback')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Workflow ID: test-workflow-id')
    ).toBeInTheDocument();
    expect(screen.getByText('Run ID: test-run-id')).toBeInTheDocument();
  });

  it('should render loading indicator when diagnostics is enabled but data is pending', async () => {
    await setup({
      isDiagnosticsEnabled: true,
      diagnosticsResponse: 'pending',
    });

    expect(await screen.findByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should throw error when diagnostics is enabled but data fetch fails', async () => {
    await setup({
      isDiagnosticsEnabled: true,
      diagnosticsResponse: 'error',
    });

    expect(
      await screen.findByText('Error: Failed to fetch diagnostics')
    ).toBeInTheDocument();
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
  diagnosticsResponse,
}: {
  isDiagnosticsEnabled: boolean;
  error?: boolean;
  diagnosticsResponse?: any;
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
        ...(isDiagnosticsEnabled
          ? [
              {
                path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/diagnose',
                httpMethod: 'GET' as const,
                mockOnce: false,
                httpResolver: async () => {
                  if (diagnosticsResponse === 'error') {
                    return HttpResponse.json(
                      { message: 'Failed to fetch diagnostics' },
                      { status: 500 }
                    );
                  } else if (diagnosticsResponse === 'pending') {
                    return new Promise<never>(() => {}); // Never resolves to simulate pending
                  } else {
                    return HttpResponse.json(diagnosticsResponse);
                  }
                },
              },
            ]
          : []),
      ],
    }
  );
}
