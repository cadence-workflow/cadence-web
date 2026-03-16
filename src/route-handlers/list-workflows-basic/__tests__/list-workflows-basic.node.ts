import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';
import queryString from 'query-string';

import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { mockWorkflowExecutions } from '../../list-workflows/__fixtures__/mock-workflow-executions';
import { listWorkflowsBasic } from '../list-workflows-basic';
import type { Context } from '../list-workflows-basic.types';

jest.mock('@/utils/logger');

const VALID_TIME_RANGE_START = '2024-06-01T00:00:00Z';
const VALID_TIME_RANGE_END = '2024-06-02T00:00:00Z';

describe(listWorkflowsBasic.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls openWorkflows and returns valid response for open workflows', async () => {
    const { res, mockOpenWorkflows, mockClosedWorkflows } = await setup({
      queryParams: {
        kind: 'open',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
      },
    });

    expect(mockOpenWorkflows).toHaveBeenCalledWith({
      domain: 'mock-domain',
      pageSize: 10,
      nextPageToken: undefined,
      startTimeFilter: {
        earliestTime: expect.objectContaining({
          seconds: expect.any(Number),
        }),
        latestTime: expect.objectContaining({
          seconds: expect.any(Number),
        }),
      },
    });
    expect(mockClosedWorkflows).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toMatchObject({
      workflows: [
        {
          workflowID: 'mock-wf-uuid-1',
          runID: 'mock-run-uuid-1',
          workflowName: 'mock-workflow-name',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          startTime: 1717408148258,
          closeTime: 1717409148258,
          historyLength: 100,
          isCron: false,
          taskList: 'mock-task-list',
        },
      ],
      nextPage: 'mock-next-page-token',
    });
  });

  it('calls closedWorkflows and returns valid response for closed workflows', async () => {
    const { res, mockClosedWorkflows, mockOpenWorkflows } = await setup({
      queryParams: {
        kind: 'closed',
        pageSize: '20',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
      },
    });

    expect(mockClosedWorkflows).toHaveBeenCalledWith({
      domain: 'mock-domain',
      pageSize: 20,
      nextPageToken: undefined,
      startTimeFilter: {
        earliestTime: expect.objectContaining({
          seconds: expect.any(Number),
        }),
        latestTime: expect.objectContaining({
          seconds: expect.any(Number),
        }),
      },
    });
    expect(mockOpenWorkflows).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toMatchObject({
      workflows: [
        {
          workflowID: 'mock-wf-uuid-1',
          runID: 'mock-run-uuid-1',
          workflowName: 'mock-workflow-name',
        },
      ],
      nextPage: 'mock-next-page-token',
    });
  });

  it('passes closeStatus filter for closed workflows', async () => {
    const { mockClosedWorkflows } = await setup({
      queryParams: {
        kind: 'closed',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
        closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
      },
    });

    expect(mockClosedWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: 'statusFilter',
        statusFilter: {
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
        },
      })
    );
  });

  it('passes executionFilter when workflowId is provided', async () => {
    const { mockOpenWorkflows } = await setup({
      queryParams: {
        kind: 'open',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
        workflowId: 'my-workflow-id',
      },
    });

    expect(mockOpenWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: 'executionFilter',
        executionFilter: {
          workflowId: 'my-workflow-id',
          runId: undefined,
        },
      })
    );
  });

  it('passes typeFilter when workflowType is provided', async () => {
    const { mockClosedWorkflows } = await setup({
      queryParams: {
        kind: 'closed',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
        workflowType: 'MyWorkflowType',
      },
    });

    expect(mockClosedWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: 'typeFilter',
        typeFilter: {
          name: 'MyWorkflowType',
        },
      })
    );
  });

  it('passes nextPage token when provided', async () => {
    const { mockOpenWorkflows } = await setup({
      queryParams: {
        kind: 'open',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
        nextPage: 'some-page-token',
      },
    });

    expect(mockOpenWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        nextPageToken: 'some-page-token',
      })
    );
  });

  it('filters out executions that cannot be converted to WorkflowListItem', async () => {
    const { res } = await setup({
      queryParams: {
        kind: 'open',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
      },
      executions: [
        ...mockWorkflowExecutions,
        {
          workflowExecution: null,
          type: null,
          startTime: null,
          closeTime: null,
          closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: '0',
          parentExecutionInfo: null,
          executionTime: null,
          memo: null,
          searchAttributes: null,
          autoResetPoints: null,
          taskList: '',
          isCron: false,
          updateTime: null,
          partitionConfig: {},
          taskListInfo: null,
          activeClusterSelectionPolicy: null,
          cronOverlapPolicy: 'CRON_OVERLAP_POLICY_INVALID',
        },
      ],
    });

    const responseJson = await res.json();
    expect(responseJson.workflows).toHaveLength(1);
    expect(responseJson.workflows[0].workflowID).toBe('mock-wf-uuid-1');
  });

  it('returns validation error for invalid query params', async () => {
    const { res, mockOpenWorkflows, mockClosedWorkflows } = await setup({
      queryParams: {
        kind: 'open',
        pageSize: 'invalid',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
      },
    });

    expect(mockOpenWorkflows).not.toHaveBeenCalled();
    expect(mockClosedWorkflows).not.toHaveBeenCalled();

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for workflow listing',
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Expected number, received nan',
          }),
        ]),
      })
    );
  });

  it('returns validation error when multiple filters are provided', async () => {
    const { res, mockOpenWorkflows, mockClosedWorkflows } = await setup({
      queryParams: {
        kind: 'closed',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
        workflowId: 'some-id',
        workflowType: 'SomeType',
      },
    });

    expect(mockOpenWorkflows).not.toHaveBeenCalled();
    expect(mockClosedWorkflows).not.toHaveBeenCalled();

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for workflow listing',
      })
    );
  });

  it('returns error if grpc call throws GRPCError', async () => {
    const { res, mockOpenWorkflows } = await setup({
      queryParams: {
        kind: 'open',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
      },
      error: new GRPCError('Workflow not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockOpenWorkflows).toHaveBeenCalled();

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

  it('returns error if grpc call throws generic error', async () => {
    const { res, mockClosedWorkflows } = await setup({
      queryParams: {
        kind: 'closed',
        pageSize: '10',
        timeRangeStart: VALID_TIME_RANGE_START,
        timeRangeEnd: VALID_TIME_RANGE_END,
      },
      error: new Error('Network error'),
    });

    expect(mockClosedWorkflows).toHaveBeenCalled();

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
});

async function setup({
  queryParams,
  error,
  executions = mockWorkflowExecutions,
}: {
  queryParams: Record<string, string | string[] | undefined>;
  error?: Error;
  executions?: typeof mockWorkflowExecutions;
}) {
  const mockOpenWorkflows = jest
    .spyOn(mockGrpcClusterMethods, 'openWorkflows')
    .mockImplementationOnce(async () => {
      if (error) throw error;
      return {
        executions,
        nextPageToken: 'mock-next-page-token',
      };
    });

  const mockClosedWorkflows = jest
    .spyOn(mockGrpcClusterMethods, 'closedWorkflows')
    .mockImplementationOnce(async () => {
      if (error) throw error;
      return {
        executions,
        nextPageToken: 'mock-next-page-token',
      };
    });

  const res = await listWorkflowsBasic(
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
    mockOpenWorkflows,
    mockClosedWorkflows,
  };
}
