import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';
import queryString from 'query-string';

import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { mockWorkflowExecutions } from '../__fixtures__/mock-workflow-executions';
import * as getListWorkflowExecutionsQueryModule from '../helpers/get-list-workflow-executions-query';
import { listWorkflows } from '../list-workflows';
import type { Context } from '../list-workflows.types';

jest.mock('@/utils/logger');
jest.mock('../helpers/get-list-workflow-executions-query');

describe(listWorkflows.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls listWorkflows and returns valid response', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: {
        pageSize: '10',
        listType: 'default',
        inputType: 'search',
      },
    });

    expect(mockListWorkflows).toHaveBeenCalledWith({
      domain: 'mock-domain',
      pageSize: 10,
      nextPageToken: undefined,
      query: 'mock list workflow executions query',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({
      workflows: [
        {
          workflowID: 'mock-wf-uuid-1',
          runID: 'mock-run-uuid-1',
          workflowName: 'mock-workflow-name',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          startTime: 1717408148258,
          closeTime: 1717409148258,
        },
      ],
      nextPage: 'mock-next-page-token',
    });
  });

  it('calls archivedWorkflows when listType is archived', async () => {
    const { res, mockArchivedWorkflows, mockListWorkflows } = await setup({
      queryParams: {
        pageSize: '20',
        listType: 'archived',
        inputType: 'query',
        query: 'WorkflowType = "test"',
        timeColumn: 'CloseTime',
        timeRangeStart: '2024-01-01T00:00:00Z',
        timeRangeEnd: '2024-01-02T00:00:00Z',
      },
    });

    expect(mockArchivedWorkflows).toHaveBeenCalledWith({
      domain: 'mock-domain',
      pageSize: 20,
      nextPageToken: undefined,
      query: 'WorkflowType = "test"',
    });

    expect(mockListWorkflows).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toEqual({
      workflows: [
        {
          workflowID: 'mock-wf-uuid-1',
          runID: 'mock-run-uuid-1',
          workflowName: 'mock-workflow-name',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          startTime: 1717408148258,
          closeTime: 1717409148258,
        },
      ],
      nextPage: 'mock-next-page-token',
    });
  });

  it('escapes quote characters in search term', async () => {
    const { mockGetListWorkflowExecutionsQuery } = await setup({
      queryParams: {
        pageSize: '10',
        listType: 'default',
        inputType: 'search',
        search: `test"workflow'name`,
      },
    });

    expect(mockGetListWorkflowExecutionsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        search: `test\\"workflow\\'name`,
      })
    );
  });

  it('returns validation error for invalid query params', async () => {
    const { res, mockListWorkflows, mockArchivedWorkflows } = await setup({
      queryParams: {
        pageSize: 'invalid',
        listType: 'default',
        inputType: 'search',
      },
    });

    expect(mockListWorkflows).not.toHaveBeenCalled();
    expect(mockArchivedWorkflows).not.toHaveBeenCalled();

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for workflow search',
        validationErrors: expect.arrayContaining([
          expect.objectContaining({ message: 'Expected number, received nan' }),
        ]),
      })
    );
  });

  it('returns validation error for archived workflows with StartTime', async () => {
    const { res, mockArchivedWorkflows } = await setup({
      queryParams: {
        pageSize: '10',
        listType: 'archived',
        inputType: 'search',
        timeColumn: 'StartTime',
      },
    });

    expect(mockArchivedWorkflows).not.toHaveBeenCalled();

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for workflow search',
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Cannot search for archived workflows by start time',
          }),
        ]),
      })
    );
  });

  it('returns validation error for archived workflows without time range', async () => {
    const { res, mockArchivedWorkflows } = await setup({
      queryParams: {
        pageSize: '10',
        listType: 'archived',
        inputType: 'search',
        timeColumn: 'CloseTime',
      },
    });

    expect(mockArchivedWorkflows).not.toHaveBeenCalled();

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for workflow search',
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            message:
              'Start and End time need to be passed for searching archived workflows',
          }),
        ]),
      })
    );
  });

  it('returns error if listWorkflows throws GRPCError', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: {
        pageSize: '10',
        listType: 'default',
        inputType: 'search',
      },
      error: new GRPCError('Workflow not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockListWorkflows).toHaveBeenCalled();

    expect(res.status).toEqual(404);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Workflow not found',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        queryParams: expect.any(Object),
        error: expect.any(GRPCError),
      }),
      'Error fetching workflows: Workflow not found'
    );
  });

  it('returns error if listWorkflows throws generic error', async () => {
    const { res, mockListWorkflows } = await setup({
      queryParams: {
        pageSize: '10',
        listType: 'default',
        inputType: 'search',
      },
      error: new Error('Network error'),
    });

    expect(mockListWorkflows).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error fetching workflows',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        queryParams: expect.any(Object),
        error: expect.any(Error),
      }),
      'Error fetching workflows'
    );
  });

  it('returns error if archivedWorkflows throws GRPCError', async () => {
    const { res, mockArchivedWorkflows } = await setup({
      queryParams: {
        pageSize: '10',
        listType: 'archived',
        inputType: 'query',
        query: 'WorkflowType = "test"',
        timeColumn: 'CloseTime',
        timeRangeStart: '2024-01-01T00:00:00Z',
        timeRangeEnd: '2024-01-02T00:00:00Z',
      },
      error: new GRPCError('Archival disabled for domain', {
        grpcStatusCode: status.FAILED_PRECONDITION,
      }),
    });

    expect(mockArchivedWorkflows).toHaveBeenCalled();

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Archival disabled for domain',
      })
    );
  });
});

async function setup({
  queryParams,
  error,
}: {
  queryParams: Record<string, string | string[] | undefined>;
  error?: Error;
}) {
  const mockGetListWorkflowExecutionsQuery = jest
    .spyOn(getListWorkflowExecutionsQueryModule, 'default')
    .mockReturnValue('mock list workflow executions query');

  const mockListWorkflows = jest
    .spyOn(mockGrpcClusterMethods, 'listWorkflows')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return {
        executions: mockWorkflowExecutions,
        nextPageToken: 'mock-next-page-token',
      };
    });

  const mockArchivedWorkflows = jest
    .spyOn(mockGrpcClusterMethods, 'archivedWorkflows')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return {
        executions: mockWorkflowExecutions,
        nextPageToken: 'mock-next-page-token',
      };
    });

  const res = await listWorkflows(
    new NextRequest(`http://localhost?${queryString.stringify(queryParams)}`),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return {
    res,
    mockListWorkflows,
    mockArchivedWorkflows,
    mockGetListWorkflowExecutionsQuery,
  };
}
