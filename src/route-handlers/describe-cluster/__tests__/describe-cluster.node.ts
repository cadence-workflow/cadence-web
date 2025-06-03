import { NextRequest } from 'next/server';

import type { DescribeClusterResponse as OriginalDescribeClusterResponse } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterResponse';
import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { describeCluster } from '../describe-cluster';
import {
  type DescribeClusterResponse,
  type Context,
} from '../describe-cluster.types';

describe('describeCluster', () => {
  it('calls describeCluster and returns valid response without membershipInfo', async () => {
    const { res, mockDescribeCluster, mockSuccessResponse } = await setup({});

    expect(mockDescribeCluster).toHaveBeenCalledWith({
      name: 'mock-cluster',
    });
    const { membershipInfo, ...rest } = mockSuccessResponse;
    const routHandleRes: DescribeClusterResponse = rest;
    const responseJson = await res.json();
    expect(responseJson).toEqual(routHandleRes);
  });

  it('returns an error when describeCluster errors out', async () => {
    const { res, mockDescribeCluster } = await setup({
      error: true,
    });

    expect(mockDescribeCluster).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Failed to fetch cluster info',
      })
    );
  });
});

async function setup({ error }: { error?: true }) {
  const mockSuccessResponse: OriginalDescribeClusterResponse = {
    persistenceInfo: {},
    membershipInfo: null,
    supportedClientVersions: null,
  };

  const mockDescribeCluster = jest
    .spyOn(mockGrpcClusterMethods, 'describeCluster')
    .mockImplementationOnce(async () => {
      if (error) {
        throw new GRPCError('Failed to fetch cluster info');
      }
      return mockSuccessResponse;
    });

  const res = await describeCluster(
    new NextRequest('http://localhost/api/clusters/:cluster', {
      method: 'Get',
    }),
    {
      params: {
        cluster: 'mock-cluster',
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockDescribeCluster, mockSuccessResponse };
}
