import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';
import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';

import { listDomains } from '../list-domains';
import type { Context } from '../list-domains.types';

jest.mock('@/utils/logger');

const mockDomains = [
  getDomainObj({ id: 'mock-domain-id-1', name: 'mock-domain-1' }),
  getDomainObj({ id: 'mock-domain-id-2', name: 'mock-domain-2' }),
];

describe(listDomains.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns domains for the requested cluster', async () => {
    const { res, mockListDomains } = await setup({});

    expect(mockListDomains).toHaveBeenCalledWith({ pageSize: 2000 });

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      domains: [
        expect.objectContaining({ name: 'mock-domain-1' }),
        expect.objectContaining({ name: 'mock-domain-2' }),
      ],
    });
  });

  it('returns error with mapped HTTP status code if gRPC call throws GRPCError', async () => {
    const { res } = await setup({
      error: new GRPCError('Too many requests', {
        grpcStatusCode: status.RESOURCE_EXHAUSTED,
      }),
    });

    expect(res.status).toEqual(429);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      error: 'Too many requests',
      cluster: 'mock-cluster1',
    });

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { cluster: 'mock-cluster1' },
        error: expect.any(GRPCError),
      }),
      'Failed to fetch domains for cluster mock-cluster1: Too many requests'
    );
  });

  it('returns 500 if gRPC call throws generic error', async () => {
    const { res } = await setup({
      error: new Error('Network error'),
    });

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      error: 'Failed to fetch domains',
      cluster: 'mock-cluster1',
    });
  });
});

async function setup({ error }: { error?: Error }) {
  const mockListDomains = jest
    .spyOn(mockGrpcClusterMethods, 'listDomains')
    .mockImplementationOnce(async () => {
      if (error) throw error;
      return { domains: mockDomains, nextPageToken: '' };
    });

  const res = await listDomains(
    new NextRequest('http://localhost/api/cluster/mock-cluster1/domains'),
    {
      params: {
        cluster: 'mock-cluster1',
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockListDomains };
}
