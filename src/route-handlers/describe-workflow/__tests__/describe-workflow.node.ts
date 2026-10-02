import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import {
  MOCK_CURRENT_RUN_ID,
  MOCK_ORIGINAL_EXECUTION_RUN_ID,
  mockCloseEventHistory,
  mockDescribeWorkflowClosedCurrentRunResponse,
  mockDescribeWorkflowClosedResponse,
  mockDescribeWorkflowClosedWithoutExecutionResponse,
  mockDescribeWorkflowOpenResponse,
  mockEmptyHistory,
  mockNullHistory,
  mockStartedEventHistory,
} from '../__fixtures__/describe-workflow-grpc-responses';
import describeWorkflow from '../describe-workflow';
import { type Context } from '../describe-workflow.types';

jest.mock('@/utils/logger');

const notFoundError = () =>
  new GRPCError('Workflow execution not found', {
    grpcStatusCode: status.NOT_FOUND,
  });

describe(describeWorkflow.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('describes an open workflow without looking up a close event', async () => {
    const { res, mockDescribeWorkflow, mockGetHistory } = await setup({
      describeResponse: mockDescribeWorkflowOpenResponse,
    });

    expect(mockDescribeWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
    });
    expect(mockGetHistory).not.toHaveBeenCalled();

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson.workflowExecutionInfo).toEqual(
      expect.objectContaining({ isArchived: false, closeEvent: null })
    );
  });

  it('attaches the close event when the workflow is closed', async () => {
    const { res, mockGetHistory } = await setup({
      describeResponse: mockDescribeWorkflowClosedResponse,
      historyResponse: mockCloseEventHistory,
    });

    expect(mockGetHistory).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      historyEventFilterType: 'EVENT_FILTER_TYPE_CLOSE_EVENT',
    });

    const responseJson = await res.json();
    expect(responseJson.workflowExecutionInfo).toEqual(
      expect.objectContaining({
        isArchived: false,
        closeEvent: mockCloseEventHistory.history?.events?.[0],
      })
    );
  });

  it('describes the current run when the runId param is omitted', async () => {
    const { res, mockDescribeWorkflow } = await setup({
      omitRunId: true,
      describeResponse: mockDescribeWorkflowOpenResponse,
    });

    expect(mockDescribeWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: undefined,
      },
    });
    expect(res.status).toEqual(200);
  });

  it('pins the close event lookup to the run resolved by describeWorkflow when the runId param is omitted', async () => {
    const { mockGetHistory } = await setup({
      omitRunId: true,
      describeResponse: mockDescribeWorkflowClosedCurrentRunResponse,
      historyResponse: mockCloseEventHistory,
    });

    expect(mockGetHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowExecution: {
          workflowId: 'mock-wfid',
          runId: MOCK_CURRENT_RUN_ID,
        },
      })
    );
  });

  it('falls back to the requested runId for the close event lookup when describeWorkflow returns no execution', async () => {
    const { mockGetHistory } = await setup({
      describeResponse: mockDescribeWorkflowClosedWithoutExecutionResponse,
      historyResponse: mockCloseEventHistory,
    });

    expect(mockGetHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowExecution: {
          workflowId: 'mock-wfid',
          runId: 'mock-runid',
        },
      })
    );
  });

  it('falls back to history when describeWorkflow data is unavailable', async () => {
    const { res, mockGetHistory } = await setup({
      describeError: notFoundError(),
      historyResponse: mockStartedEventHistory,
    });

    expect(mockGetHistory).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      pageSize: 1,
    });

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson.workflowExecutionInfo).toEqual(
      expect.objectContaining({
        isArchived: true,
        workflowExecution: {
          workflowId: 'mock-wfid',
          runId: 'mock-runid',
        },
        type: { name: 'mock-workflow-type' },
      })
    );
  });

  it('reports the started event run in the archived fallback when the runId param is omitted', async () => {
    const { res } = await setup({
      omitRunId: true,
      describeError: notFoundError(),
      historyResponse: mockStartedEventHistory,
    });

    const responseJson = await res.json();
    expect(responseJson.workflowExecutionInfo.workflowExecution).toEqual({
      workflowId: 'mock-wfid',
      runId: MOCK_ORIGINAL_EXECUTION_RUN_ID,
    });
  });

  it('returns 404 when neither describeWorkflow nor history have the workflow', async () => {
    const { res } = await setup({
      describeError: notFoundError(),
      historyError: notFoundError(),
    });

    expect(res.status).toEqual(404);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Requested workflow history not found',
      })
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('returns 404 when history has no started event to build an archived response from', async () => {
    const { res } = await setup({
      describeError: notFoundError(),
      historyResponse: mockEmptyHistory,
    });

    expect(res.status).toEqual(404);
  });

  it('returns 404 when the archived history response has no history at all', async () => {
    const { res } = await setup({
      describeError: notFoundError(),
      historyResponse: mockNullHistory,
    });

    expect(res.status).toEqual(404);
  });

  it('treats an unconfigured archive as 404', async () => {
    const { res } = await setup({
      describeError: notFoundError(),
      historyError: new GRPCError(
        'Requested workflow history not found, may have passed retention period.',
        { grpcStatusCode: status.INVALID_ARGUMENT }
      ),
    });

    expect(res.status).toEqual(404);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Requested workflow history not found',
      })
    );
  });

  it('does not attempt the archived fallback for non-404 backend errors', async () => {
    const { res, mockGetHistory } = await setup({
      describeError: new GRPCError('Cluster is unavailable', {
        grpcStatusCode: status.UNAVAILABLE,
      }),
    });

    expect(mockGetHistory).not.toHaveBeenCalled();

    expect(res.status).toEqual(503);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({ message: 'Cluster is unavailable' })
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('returns 500 for unexpected errors', async () => {
    const { res } = await setup({
      describeError: new Error('something went wrong'),
      historyResponse: mockEmptyHistory,
    });

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error fetching workflow execution info',
      })
    );
    expect(logger.error).toHaveBeenCalled();
  });
});

async function setup({
  omitRunId,
  describeResponse,
  describeError,
  historyResponse,
  historyError,
}: {
  omitRunId?: boolean;
  describeResponse?: DescribeWorkflowExecutionResponse;
  describeError?: Error;
  historyResponse?: GetWorkflowExecutionHistoryResponse;
  historyError?: Error;
}) {
  const mockDescribeWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'describeWorkflow')
    .mockImplementation(async () => {
      if (describeError) throw describeError;
      return describeResponse ?? mockDescribeWorkflowOpenResponse;
    });

  const mockGetHistory = jest
    .spyOn(mockGrpcClusterMethods, 'getHistory')
    .mockImplementation(async () => {
      if (historyError) throw historyError;
      return historyResponse ?? mockEmptyHistory;
    });

  const res = await describeWorkflow(
    new NextRequest('http://localhost', { method: 'GET' }),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        workflowId: 'mock-wfid',
        runId: omitRunId ? undefined : 'mock-runid',
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockDescribeWorkflow, mockGetHistory };
}
