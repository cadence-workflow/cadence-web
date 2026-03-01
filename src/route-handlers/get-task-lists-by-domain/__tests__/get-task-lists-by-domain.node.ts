import { NextRequest } from 'next/server';

import { type GetTaskListsByDomainResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetTaskListsByDomainResponse';
import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { getTaskListsByDomain } from '../get-task-lists-by-domain';
import { type Context } from '../get-task-lists-by-domain.types';

describe('getTaskListsByDomain', () => {
  it('calls getTaskListsByDomain and returns deduplicated sorted task list names', async () => {
    const { res, mockGetTaskListsByDomain } = await setup({});

    expect(mockGetTaskListsByDomain).toHaveBeenCalledWith({
      domain: 'mock-domain',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({
      taskListNames: ['activity-only-tasklist', 'shared-tasklist'],
    });
  });

  it('returns an empty array when no task lists exist', async () => {
    const { res } = await setup({ empty: true });

    const responseJson = await res.json();
    expect(responseJson).toEqual({
      taskListNames: [],
    });
  });

  it('returns an error when getTaskListsByDomain errors out', async () => {
    const { res, mockGetTaskListsByDomain } = await setup({
      error: true,
    });

    expect(mockGetTaskListsByDomain).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error fetching task lists by domain',
      })
    );
  });
});

async function setup({ error, empty }: { error?: true; empty?: true }) {
  const mockGetTaskListsByDomain = jest
    .spyOn(mockGrpcClusterMethods, 'getTaskListsByDomain')
    .mockImplementationOnce(async (): Promise<GetTaskListsByDomainResponse> => {
      if (error) {
        throw new GRPCError('Error fetching task lists by domain');
      }
      if (empty) {
        return {
          decisionTaskListMap: {},
          activityTaskListMap: {},
        };
      }
      return {
        decisionTaskListMap: {
          'shared-tasklist': {
            pollers: [],
            taskListStatus: null,
            partitionConfig: null,
            taskList: null,
          },
        },
        activityTaskListMap: {
          'shared-tasklist': {
            pollers: [],
            taskListStatus: null,
            partitionConfig: null,
            taskList: null,
          },
          'activity-only-tasklist': {
            pollers: [],
            taskListStatus: null,
            partitionConfig: null,
            taskList: null,
          },
        },
      };
    });

  const res = await getTaskListsByDomain(
    new NextRequest(
      'http://localhost/api/domains/mock-domain/mock-cluster/task-lists',
      {
        method: 'GET',
      }
    ),
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

  return { res, mockGetTaskListsByDomain };
}
