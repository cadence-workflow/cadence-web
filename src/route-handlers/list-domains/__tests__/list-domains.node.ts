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
  getDomainObj({
    id: 'mock-domain-id-1',
    name: 'mock-domain-1',
    clusters: [{ clusterName: 'mock-cluster1' }],
  }),
  getDomainObj({
    id: 'mock-domain-id-2',
    name: 'mock-domain-2',
    clusters: [{ clusterName: 'mock-cluster1' }],
  }),
];

describe(listDomains.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns domains with default page size when no query params provided', async () => {
    const { res, mockListDomains } = await setup({});

    expect(mockListDomains).toHaveBeenCalledWith({
      pageSize: 2000,
      nextPageToken: undefined,
    });

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      domains: [
        expect.objectContaining({ name: 'mock-domain-1' }),
        expect.objectContaining({ name: 'mock-domain-2' }),
      ],
      nextPage: '',
    });
  });

  it('uses custom pageSize and nextPage from query params', async () => {
    const { res, mockListDomains } = await setup({
      queryParams: { pageSize: '10', nextPage: 'token123' },
    });

    expect(mockListDomains).toHaveBeenCalledWith({
      pageSize: 10,
      nextPageToken: 'token123',
    });

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      domains: [
        expect.objectContaining({ name: 'mock-domain-1' }),
        expect.objectContaining({ name: 'mock-domain-2' }),
      ],
      nextPage: 'next-token-abc',
    });
  });

  it('returns 400 for invalid pageSize', async () => {
    const { res } = await setup({
      queryParams: { pageSize: '-5' },
    });

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson.error).toEqual(
      'Invalid argument(s) for domain listing'
    );
    expect(responseJson.validationErrors).toBeDefined();
  });

  it('filters out domains that are not relevant to the requested cluster', async () => {
    const { res } = await setup({
      domains: [
        ...mockDomains,
        getDomainObj({
          id: 'mock-domain-id-other',
          name: 'mock-domain-other',
          clusters: [{ clusterName: 'mock-cluster2' }],
        }),
        getDomainObj({
          id: 'mock-domain-id-deleted',
          name: 'mock-domain-deleted',
          status: 'DOMAIN_STATUS_DELETED',
          clusters: [{ clusterName: 'mock-cluster1' }],
        }),
      ],
    });

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      domains: [
        expect.objectContaining({ name: 'mock-domain-1' }),
        expect.objectContaining({ name: 'mock-domain-2' }),
      ],
      nextPage: '',
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

async function setup({
  error,
  domains = mockDomains,
  queryParams,
}: {
  error?: Error;
  domains?: Array<ReturnType<typeof getDomainObj>>;
  queryParams?: { pageSize?: string; nextPage?: string };
}) {
  const nextPageToken = queryParams?.nextPage ? 'next-token-abc' : '';

  const mockListDomains = jest
    .spyOn(mockGrpcClusterMethods, 'listDomains')
    .mockImplementationOnce(async () => {
      if (error) throw error;
      return { domains, nextPageToken };
    });

  const url = new URL('http://localhost/api/cluster/mock-cluster1/domains');
  if (queryParams?.pageSize)
    url.searchParams.set('pageSize', queryParams.pageSize);
  if (queryParams?.nextPage)
    url.searchParams.set('nextPage', queryParams.nextPage);

  const res = await listDomains(
    new NextRequest(url),
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
