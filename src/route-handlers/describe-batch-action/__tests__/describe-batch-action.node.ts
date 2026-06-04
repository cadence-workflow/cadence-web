import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import {
  mockBatcherStartedHistory,
  mockBatcherStartedHistoryWithUnknownType,
  mockDescribeBatchOperationWorkflowCompleted,
  mockDescribeBatchOperationWorkflowRunning,
  mockDescribeBatchOperationWorkflowTerminated,
} from '../__fixtures__/mock-describe-batch-operation-workflow';
import { describeBatchAction } from '../describe-batch-action';
import {
  type Context,
  type RequestParams,
} from '../describe-batch-action.types';

jest.mock('@/utils/logger');

describe(describeBatchAction.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls describeWorkflow and getHistory against cadence-batcher in parallel and merges input fields into the response', async () => {
    const { res, mockDescribeWorkflow, mockGetHistory } = await setup({
      describeResponse: mockDescribeBatchOperationWorkflowCompleted,
    });

    expect(mockDescribeWorkflow).toHaveBeenCalledWith({
      domain: 'cadence-batcher',
      workflowExecution: {
        workflowId: 'mock-batch-action-id-1',
        runId: '',
      },
    });
    expect(mockGetHistory).toHaveBeenCalledWith({
      domain: 'cadence-batcher',
      workflowExecution: {
        workflowId: 'mock-batch-action-id-1',
        runId: '',
      },
      pageSize: 1,
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
      id: 'mock-batch-action-id-1',
      status: 'COMPLETED',
      startTime: 1717408148258,
      endTime: 1717409148258,
      actionType: 'terminate',
      rps: 100,
      concurrency: 5,
    });
  });

  it('returns running status and undefined endTime for an in-flight batch action', async () => {
    const { res } = await setup({
      describeResponse: mockDescribeBatchOperationWorkflowRunning,
    });

    expect(res.status).toEqual(200);
    const body = await res.json();
    expect(body.status).toEqual('RUNNING');
    expect(body.endTime).toBeUndefined();
    expect(body.startTime).toEqual(1717408148258);
  });

  it('maps TERMINATED close status to aborted', async () => {
    const { res } = await setup({
      describeResponse: mockDescribeBatchOperationWorkflowTerminated,
    });

    expect(res.status).toEqual(200);
    expect((await res.json()).status).toEqual('ABORTED');
  });

  it('leaves actionType undefined when BatchType in input is not a UI-supported value', async () => {
    const { res } = await setup({
      describeResponse: mockDescribeBatchOperationWorkflowRunning,
      historyResponse: mockBatcherStartedHistoryWithUnknownType,
    });

    const body = await res.json();
    expect(body.actionType).toBeUndefined();
    expect(body.rps).toEqual(50);
    expect(body.concurrency).toBeUndefined();
  });

  it('returns 500 and logs when getHistory fails', async () => {
    const { res } = await setup({
      describeResponse: mockDescribeBatchOperationWorkflowCompleted,
      historyError: new Error('History service unavailable'),
    });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Error fetching batch action' })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: {
          domain: 'mock-domain',
          cluster: 'mock-cluster',
          batchActionId: 'mock-batch-action-id-1',
        },
        error: expect.any(Error),
      }),
      'Error fetching batch action'
    );
  });

  it('returns 404 when the response is missing workflowExecutionInfo', async () => {
    const { res } = await setup({
      describeResponse: {
        ...mockDescribeBatchOperationWorkflowRunning,
        workflowExecutionInfo: null,
      },
    });

    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Batch action not found' })
    );
  });

  it('returns 404 when describeWorkflow throws a NOT_FOUND GRPCError', async () => {
    const { res } = await setup({
      describeError: new GRPCError('Batcher workflow not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Batcher workflow not found' })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: {
          domain: 'mock-domain',
          cluster: 'mock-cluster',
          batchActionId: 'mock-batch-action-id-1',
        },
        error: expect.any(GRPCError),
      }),
      'Error fetching batch action: Batcher workflow not found'
    );
  });

  it('returns 500 when describeWorkflow throws a generic error', async () => {
    const { res } = await setup({
      describeError: new Error('Network error'),
    });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Error fetching batch action' })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: {
          domain: 'mock-domain',
          cluster: 'mock-cluster',
          batchActionId: 'mock-batch-action-id-1',
        },
        error: expect.any(Error),
      }),
      'Error fetching batch action'
    );
  });
});

async function setup({
  describeResponse,
  historyResponse = mockBatcherStartedHistory,
  describeError,
  historyError,
  batchActionId = 'mock-batch-action-id-1',
}: {
  describeResponse?: DescribeWorkflowExecutionResponse;
  historyResponse?: GetWorkflowExecutionHistoryResponse;
  describeError?: Error;
  historyError?: Error;
  batchActionId?: string;
}) {
  const mockDescribeWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'describeWorkflow')
    .mockImplementationOnce(async () => {
      if (describeError) throw describeError;
      return describeResponse!;
    });

  const mockGetHistory = jest
    .spyOn(mockGrpcClusterMethods, 'getHistory')
    .mockImplementationOnce(async () => {
      if (historyError) throw historyError;
      return historyResponse;
    });

  const res = await describeBatchAction(
    new NextRequest('http://localhost'),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        batchActionId,
      },
    } as RequestParams,
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockDescribeWorkflow, mockGetHistory };
}
