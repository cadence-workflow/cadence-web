import { createElement, Suspense } from 'react';

import { HttpResponse } from 'msw';
import { ZodError } from 'zod';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';
import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';
import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import useWorkflowDiagnosticsIssuesCount from '../use-workflow-diagnostics-issues-count';

describe(useWorkflowDiagnosticsIssuesCount.name, () => {
  it('should return total issues count when diagnostics is enabled and workflow is closed', async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current).toBe(5); // 5 issues from mockWorkflowDiagnosticsResult
    });
  });

  it('should return undefined when diagnostics is disabled', async () => {
    const { result } = setup({ isDiagnosticsEnabled: false });

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should return undefined when workflow is running and diagnostics in history is disabled', async () => {
    const { result } = setup({ isWorkflowClosed: false });

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should return total issues count when workflow is running and diagnostics in history is enabled', async () => {
    const { result } = setup({
      isWorkflowClosed: false,
      isDiagnosticsInHistoryEnabled: true,
    });

    await waitFor(() => {
      expect(result.current).toBe(5);
    });
  });

  it('should return undefined when diagnostics has parsing error', async () => {
    const { result } = setup({
      diagnosticsResponse: {
        result: mockWorkflowDiagnosticsResult,
        parsingError: new ZodError([]),
      },
    });

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should return undefined when diagnostics data is undefined', async () => {
    const { result } = setup({ diagnosticsResponse: undefined });

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should return 0 when diagnostics result has no issues', async () => {
    const { result } = setup({
      diagnosticsResponse: {
        result: {
          result: {
            Timeouts: null,
            Failures: null,
            Retries: null,
          },
          completed: true,
        },
        parsingError: null,
      },
    });

    await waitFor(() => {
      expect(result.current).toBe(0);
    });
  });

  it('should handle config API errors gracefully', async () => {
    const { result } = setup({ configError: true });

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should handle describe workflow API errors gracefully', async () => {
    const { result } = setup({ describeWorkflowError: true });

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should handle diagnostics API errors gracefully', async () => {
    const { result } = setup({ diagnosticsError: true });

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });
});

function setup({
  isDiagnosticsEnabled = true,
  isDiagnosticsInHistoryEnabled = false,
  isWorkflowClosed = true,
  diagnosticsResponse = {
    result: mockWorkflowDiagnosticsResult,
    parsingError: null,
  },
  configError = false,
  describeWorkflowError = false,
  diagnosticsError = false,
}: {
  isDiagnosticsEnabled?: boolean;
  isDiagnosticsInHistoryEnabled?: boolean;
  isWorkflowClosed?: boolean;
  diagnosticsResponse?: DiagnoseWorkflowResponse;
  configError?: boolean;
  describeWorkflowError?: boolean;
  diagnosticsError?: boolean;
} = {}) {
  return renderHook(
    () =>
      useWorkflowDiagnosticsIssuesCount({
        domain: 'test-domain',
        cluster: 'test-cluster',
        workflowId: 'test-workflow-id',
        runId: 'test-run-id',
      }),
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            if (configError) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            }

            const configKey = new URL(request.url).searchParams.get(
              'configKey'
            );

            switch (configKey) {
              case 'WORKFLOW_DIAGNOSTICS_ENABLED':
                return HttpResponse.json(
                  isDiagnosticsEnabled satisfies GetConfigResponse<'WORKFLOW_DIAGNOSTICS_ENABLED'>
                );
              case 'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED':
                return HttpResponse.json(
                  isDiagnosticsInHistoryEnabled satisfies GetConfigResponse<'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'>
                );
              default:
                return HttpResponse.json(false);
            }
          },
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (describeWorkflowError) {
              return HttpResponse.json(
                { message: 'Failed to fetch workflow' },
                { status: 500 }
              );
            }
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
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/diagnose',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (diagnosticsError) {
              return HttpResponse.json(
                { message: 'Failed to fetch diagnostics' },
                { status: 500 }
              );
            }
            return HttpResponse.json(diagnosticsResponse);
          },
        },
      ],
    },
    {
      wrapper: ({ children }) =>
        createElement(Suspense, { fallback: 'Loading' }, children),
    }
  );
}
