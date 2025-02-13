import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { describeCluster } from '../describe-cluster';
import {
  DescribeClusterResponse,
  type Context,
} from '../describe-cluster.types';
import type { DescribeClusterResponse as OriginalDescribeClusterResponse } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterResponse';

describe('describeCluster', () => {

  it('calls describeCluster and returns valid response without membershipInfo', async () => {
    const { res, mockDescribeCluster, mockSuccessResponse } = await setup({});

    expect(mockDescribeCluster).toHaveBeenCalledWith({
      name: 'mock-cluster'
    });
    const { membershipInfo, ...rest } = mockSuccessResponse
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

  it('returns static response with advancedVisibilityEnabled true when CADENCE_ADVANCED_VISIBILITY env value is true', async () => {
    const originalEnvObj = globalThis.process.env;
    globalThis.process.env = {
      ...process.env,
      CADENCE_ADVANCED_VISIBILITY: "true"
    }

    const { res, mockDescribeCluster } = await setup({});

    expect(mockDescribeCluster).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson.persistenceInfo.visibilityStore.features[0].enabled).toBe(
      true
    )
    globalThis.process.env = originalEnvObj;
  });

  it('returns static response with advancedVisibilityEnabled false when CADENCE_ADVANCED_VISIBILITY env value is not true', async () => {
    const originalEnvObj = globalThis.process.env;
    globalThis.process.env = {
      ...process.env,
      CADENCE_ADVANCED_VISIBILITY: "not true"
    }

    const { res, mockDescribeCluster } = await setup({});

    expect(mockDescribeCluster).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson.persistenceInfo.visibilityStore.features[0].enabled).toBe(
      false
    )
    globalThis.process.env = originalEnvObj;
  });
});

async function setup({
  error,
}: {
  error?: true;
}) {
  const mockSuccessResponse: OriginalDescribeClusterResponse = {
    persistenceInfo: {},
    membershipInfo: null,
    supportedClientVersions: null,
  }

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
