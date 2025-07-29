import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import WorkflowDiagnostics from '../workflow-diagnostics';

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

  it('should throw error when diagnostics is disabled', async () => {
    await setup({ isDiagnosticsEnabled: false });

    expect(
      await screen.findByText(
        'Error: Workflow diagnostics is currently disabled'
      )
    ).toBeInTheDocument();
  });

  it('should handle config API errors gracefully', async () => {
    await setup({ isDiagnosticsEnabled: false, error: true });

    expect(
      await screen.findByText('Error: Failed to fetch config')
    ).toBeInTheDocument();
  });

  it('should throw error when workflow is not closed', async () => {
    await setup({
      isDiagnosticsEnabled: true,
      isWorkflowClosed: false,
    });

    expect(
      await screen.findByText(
        'Error: Cannot load diagnostics for a running workflow'
      )
    ).toBeInTheDocument();
  });
});

async function setup({
  isDiagnosticsEnabled,
  error,
  diagnosticsResponse,
  isWorkflowClosed = true,
}: {
  isDiagnosticsEnabled: boolean;
  error?: boolean;
  diagnosticsResponse?: any;
  isWorkflowClosed?: boolean;
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
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            return HttpResponse.json({
              ...mockDescribeWorkflowResponse,
              workflowExecutionInfo: {
                ...mockDescribeWorkflowResponse.workflowExecutionInfo,
                ...(isWorkflowClosed
                  ? { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' }
                  : {
                      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
                      closeEvent: null,
                    }),
              },
            } satisfies DescribeWorkflowResponse);
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
