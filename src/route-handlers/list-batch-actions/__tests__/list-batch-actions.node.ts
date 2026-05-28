import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';
import queryString from 'query-string';

import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { mockBatchOperationWorkflows } from '../__fixtures__/mock-batch-operation-workflows';
import { listBatchActions } from '../list-batch-actions';
import { type Context, type RequestParams } from '../list-batch-actions.types';

jest.mock('@/utils/logger');

describe(listBatchActions.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls listWorkflows against cadence-batcher with a CustomDomain-filtered query and returns transformed batch actions', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: { pageSize: '10' },
    });

    expect(mockListWorkflows).toHaveBeenCalledTimes(1);
    const call = mockListWorkflows.mock.calls[0][0];
    expect(call.domain).toEqual('cadence-batcher');
    expect(call.pageSize).toEqual(10);
    expect(call.nextPageToken).toBeUndefined();
    expect(call.query).toEqual(
      'WorkflowType = "cadence-sys-batch-workflow-v2" ' +
        'AND CustomDomain = "mock-domain" ' +
        'ORDER BY StartTime DESC'
    );

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      batchActions: [
        {
          id: 'mock-batch-action-id-1',
          status: 'COMPLETED',
        },
        {
          id: 'mock-batch-action-id-2',
          status: 'RUNNING',
        },
      ],
      nextPageToken: 'mock-next-page-token',
    });
  });

  it('treats a missing closeStatus as a running workflow', async () => {
    const { res } = await setup({
      queryParams: { pageSize: '10' },
      executions: [
        {
          ...mockBatchOperationWorkflows[0],
          // @ts-expect-error - testing missing closeStatus from gRPC response
          closeStatus: null,
        },
      ],
    });

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson.batchActions).toEqual([
      { id: 'mock-batch-action-id-1', status: 'RUNNING' },
    ]);
  });

  it('forwards nextPage query param as nextPageToken', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: { pageSize: '25', nextPage: 'token-123' },
    });

    expect(mockListWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'cadence-batcher',
        pageSize: 25,
        nextPageToken: 'token-123',
      })
    );
    expect(res.status).toEqual(200);
  });

  it('returns validation error when pageSize is not a positive integer', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: { pageSize: '0' },
    });

    expect(mockListWorkflows).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for listing batch actions',
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Page size must be a positive integer',
          }),
        ]),
      })
    );
  });

  it('returns error when listWorkflows throws a GRPCError', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: { pageSize: '10' },
      error: new GRPCError('Visibility service unavailable', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockListWorkflows).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Visibility service unavailable',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        queryParams: expect.any(Object),
        error: expect.any(GRPCError),
      }),
      'Error fetching batch actions: Visibility service unavailable'
    );
  });

  it('returns error when listWorkflows throws a generic error', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: { pageSize: '10' },
      error: new Error('Network error'),
    });

    expect(mockListWorkflows).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error fetching batch actions',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        queryParams: expect.any(Object),
        error: expect.any(Error),
      }),
      'Error fetching batch actions'
    );
  });
});

async function setup({
  queryParams,
  domain = 'mock-domain',
  error,
  executions = mockBatchOperationWorkflows,
}: {
  queryParams: Record<string, string | string[] | undefined>;
  domain?: string;
  error?: Error;
  executions?: Array<WorkflowExecutionInfo>;
}) {
  const mockListWorkflows = jest
    .spyOn(mockGrpcClusterMethods, 'listWorkflows')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return {
        executions,
        nextPageToken: 'mock-next-page-token',
      };
    });

  const res = await listBatchActions(
    new NextRequest(`http://localhost?${queryString.stringify(queryParams)}`),
    {
      params: {
        domain,
        cluster: 'mock-cluster',
      },
    } as RequestParams,
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockListWorkflows };
}
