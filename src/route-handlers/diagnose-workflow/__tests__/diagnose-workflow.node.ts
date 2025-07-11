import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { type DiagnoseWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DiagnoseWorkflowExecutionResponse';
import { type QueryWorkflowResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/QueryWorkflowResponse';
import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { mockWorkflowDiagnosticsResult } from '../__fixtures__/mock-workflow-diagnostics-result';
import { diagnoseWorkflow } from '../diagnose-workflow';
import {
  DIAGNOSTICS_WORKFLOW_DOMAIN,
  DIAGNOSTICS_WORKFLOW_QUERY,
} from '../diagnose-workflow.constants';
import { type Context } from '../diagnose-workflow.types';

const MAX_RETRY_ATTEMPTS = 5;

jest.mock('p-retry', () => {
  return jest.fn(
    async (
      fn: () => Promise<any>,
      options: { shouldRetry: (error: any) => boolean }
    ): Promise<any> => {
      let attempts = 0;

      while (attempts < MAX_RETRY_ATTEMPTS) {
        attempts++;
        try {
          const res = await fn();
          return res;
        } catch (error) {
          if (attempts >= MAX_RETRY_ATTEMPTS || !options.shouldRetry(error)) {
            throw error;
          }
        }
      }

      throw new Error('Ran out of attempts');
    }
  );
});

describe(diagnoseWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully diagnoses workflow on first attempt', async () => {
    const { requestParams, context } = setup();

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    expect(mockGrpcClusterMethods.getDiagnosticsWorkflow).toHaveBeenCalledWith({
      domain: 'test-domain',
      workflowExecution: {
        workflowId: 'test-wf-id',
        runId: 'test-run-id',
      },
    });

    expect(mockGrpcClusterMethods.queryWorkflow).toHaveBeenCalledWith({
      domain: DIAGNOSTICS_WORKFLOW_DOMAIN,
      workflowExecution: {
        workflowId: 'diagnostic-wf-id',
        runId: 'diagnostic-run-id',
      },
      query: {
        queryType: DIAGNOSTICS_WORKFLOW_QUERY,
      },
      queryRejectCondition: 'QUERY_REJECT_CONDITION_NOT_COMPLETED_CLEANLY',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({
      result: mockWorkflowDiagnosticsResult,
    });
  });

  it('retries when diagnostics are not completed and succeeds on retry', async () => {
    const { requestParams, context } = setup();

    jest
      .spyOn(mockGrpcClusterMethods, 'queryWorkflow')
      .mockResolvedValueOnce({
        queryResult: {
          data: Buffer.from(
            JSON.stringify({ DiagnosticsCompleted: false })
          ).toString('base64'),
        },
      } as QueryWorkflowResponse)
      .mockResolvedValueOnce({
        queryResult: {
          data: Buffer.from(
            JSON.stringify(mockWorkflowDiagnosticsResult)
          ).toString('base64'),
        },
      } as QueryWorkflowResponse);

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    expect(mockGrpcClusterMethods.queryWorkflow).toHaveBeenCalledTimes(2);

    const responseJson = await res.json();
    expect(responseJson).toEqual({
      result: mockWorkflowDiagnosticsResult,
    });
  });

  it('runs out of retries when diagnostics never complete', async () => {
    const { requestParams, context } = setup({
      queryResultData: { DiagnosticsCompleted: false },
    });

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    expect(mockGrpcClusterMethods.queryWorkflow).toHaveBeenCalledTimes(
      MAX_RETRY_ATTEMPTS
    );

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error diagnosing workflow',
      })
    );
  });

  it(`does not retry when error is not "diagnostics not completed"`, async () => {
    const { requestParams, context } = setup({
      queryWorkflowError: new GRPCError('Internal server error', {
        grpcStatusCode: status.INTERNAL,
      }),
    });

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    expect(mockGrpcClusterMethods.queryWorkflow).toHaveBeenCalledTimes(1);

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Internal server error',
      })
    );
  });

  it('handles query rejection with FAILED_PRECONDITION status', async () => {
    const { requestParams, context } = setup();

    jest.spyOn(mockGrpcClusterMethods, 'queryWorkflow').mockResolvedValue({
      queryResult: null,
      queryRejected: {
        closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
      },
    } as QueryWorkflowResponse);

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Query to Diagnostics Workflow rejected',
      })
    );
  });

  it('handles Zod parsing errors gracefully', async () => {
    const invalidData = {
      DiagnosticsCompleted: true,
      DiagnosticsResult: 'invalid-diagnostics',
    };
    const { requestParams, context } = setup({ queryResultData: invalidData });

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    const responseJson = await res.json();
    expect(responseJson).toEqual({
      parsingError: expect.objectContaining({ name: 'ZodError' }),
      result: {
        DiagnosticsCompleted: true,
        DiagnosticsResult: 'invalid-diagnostics',
      },
    });
  });

  it('handles getDiagnosticsWorkflow errors', async () => {
    const { requestParams, context } = setup();

    // Override the getDiagnosticsWorkflow spy to throw an error
    jest
      .spyOn(mockGrpcClusterMethods, 'getDiagnosticsWorkflow')
      .mockRejectedValue(
        new GRPCError('Failed to get diagnostics workflow', {
          grpcStatusCode: status.INTERNAL,
        })
      );

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Failed to get diagnostics workflow',
      })
    );
  });

  it('handles non-GRPC errors', async () => {
    const { requestParams, context } = setup();

    // Override the getDiagnosticsWorkflow spy to throw a non-GRPC error
    jest
      .spyOn(mockGrpcClusterMethods, 'getDiagnosticsWorkflow')
      .mockRejectedValue(new Error('Unexpected error'));

    const res = await diagnoseWorkflow(
      new NextRequest('http://localhost'),
      requestParams,
      context
    );

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error diagnosing workflow',
      })
    );
  });
});

function setup(options?: {
  queryResultData?: any;
  getDiagnosticsWorkflowError?: Error;
  queryWorkflowError?: Error;
  queryRejected?: boolean;
}) {
  const mockDiagnosticWorkflowExecution = {
    workflowId: 'diagnostic-wf-id',
    runId: 'diagnostic-run-id',
  };

  const requestParams = {
    params: {
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowId: 'test-wf-id',
      runId: 'test-run-id',
    },
  };

  const context = {
    grpcClusterMethods: mockGrpcClusterMethods,
  } as Context;

  const mockQueryResultJson =
    options?.queryResultData || mockWorkflowDiagnosticsResult;

  const mockQueryResponse = {
    queryResult: {
      data: Buffer.from(JSON.stringify(mockQueryResultJson)).toString('base64'),
    },
  };

  // Set up spies based on options
  if (options?.getDiagnosticsWorkflowError) {
    jest
      .spyOn(mockGrpcClusterMethods, 'getDiagnosticsWorkflow')
      .mockRejectedValue(options.getDiagnosticsWorkflowError);
  } else {
    jest
      .spyOn(mockGrpcClusterMethods, 'getDiagnosticsWorkflow')
      .mockResolvedValue({
        diagnosticWorkflowExecution: mockDiagnosticWorkflowExecution,
      } as DiagnoseWorkflowExecutionResponse);
  }

  if (options?.queryWorkflowError) {
    jest
      .spyOn(mockGrpcClusterMethods, 'queryWorkflow')
      .mockRejectedValue(options.queryWorkflowError);
  } else if (options?.queryRejected) {
    jest.spyOn(mockGrpcClusterMethods, 'queryWorkflow').mockResolvedValue({
      queryResult: null,
      queryRejected: {
        closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
      },
    } as QueryWorkflowResponse);
  } else {
    jest
      .spyOn(mockGrpcClusterMethods, 'queryWorkflow')
      .mockResolvedValue(mockQueryResponse as QueryWorkflowResponse);
  }

  return {
    mockDiagnosticWorkflowExecution,
    requestParams,
    context,
    mockQueryResultJson,
  };
}
