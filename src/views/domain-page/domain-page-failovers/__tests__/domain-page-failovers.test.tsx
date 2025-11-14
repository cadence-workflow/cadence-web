import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { type Props as LoaderProps } from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader.types';
import { type DescribeDomainResponse } from '@/route-handlers/describe-domain/describe-domain.types';
import {
  type FailoverEvent,
  type ListFailoverHistoryResponse,
} from '@/route-handlers/list-failover-history/list-failover-history.types';
import { mockDomainDescription } from '@/views/domain-page/__fixtures__/domain-description';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import DomainPageFailovers from '../domain-page-failovers';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

jest.mock(
  '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader',
  () =>
    jest.fn((props: LoaderProps) => (
      <button data-testid="mock-loader" onClick={props.fetchNextPage}>
        Mock end message: {props.error ? 'Error' : 'OK'}
      </button>
    ))
);

jest.mock('../../config/domain-page-failovers-table.config', () => [
  {
    name: 'Failover ID',
    id: 'failoverId',
    width: '35%',
    renderCell: (event: FailoverEvent) => <div>{event.id}</div>,
  },
  {
    name: 'Time',
    id: 'time',
    width: '15%',
    renderCell: (event: FailoverEvent) => (
      <div>{event.createdTime?.seconds || 'No date'}</div>
    ),
  },
  {
    name: 'Type',
    id: 'type',
    width: '10%',
    renderCell: (event: FailoverEvent) => <div>{event.failoverType}</div>,
  },
  {
    name: 'Failover Information',
    id: 'failoverInfo',
    width: '40%',
    renderCell: (event: FailoverEvent) => (
      <div>
        {event.clusterFailovers[0]?.fromCluster?.activeClusterName}
        {` -> `}
        {event.clusterFailovers[0]?.toCluster?.activeClusterName}
      </div>
    ),
  },
]);

jest.mock(
  '../../config/domain-page-failovers-table-active-active.config',
  () => [
    {
      name: 'Failover ID',
      id: 'failoverId',
      width: '35%',
      renderCell: (event: FailoverEvent) => <div>{event.id}</div>,
    },
    {
      name: 'Time',
      id: 'time',
      width: '15%',
      renderCell: (event: FailoverEvent) => (
        <div>{event.createdTime?.seconds || 'No date'}</div>
      ),
    },
    {
      name: 'Type',
      id: 'type',
      width: '10%',
      renderCell: (event: FailoverEvent) => <div>{event.failoverType}</div>,
    },
    {
      name: 'Failover Information',
      id: 'failoverInfo',
      width: '40%',
      renderCell: (event: FailoverEvent) => (
        <div>Active Active: {event.id}</div>
      ),
    },
  ]
);

const mockFailoverEvent: FailoverEvent = {
  id: 'failover-1',
  createdTime: {
    seconds: '1700000000',
    nanos: 0,
  },
  failoverType: 'FAILOVER_TYPE_GRACEFUL',
  clusterFailovers: [
    {
      fromCluster: {
        activeClusterName: 'cluster-1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster-2',
        failoverVersion: '2',
      },
      clusterAttribute: null,
    },
  ],
};

describe(DomainPageFailovers.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with column headers', async () => {
    await setup({});

    expect(await screen.findByText('Failover ID')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Failover Information')).toBeInTheDocument();
  });

  it('renders failover events in table', async () => {
    await setup({
      failoverResponse: {
        failoverEvents: [mockFailoverEvent],
        nextPageToken: '',
      },
    });

    expect(await screen.findByText('failover-1')).toBeInTheDocument();
    expect(screen.getByText('FAILOVER_TYPE_GRACEFUL')).toBeInTheDocument();
  });

  it('does not render data rows when no failover events', async () => {
    await setup({
      failoverResponse: {
        failoverEvents: [],
        nextPageToken: '',
      },
    });

    await screen.findByText('Failover ID');
    expect(screen.queryByText('failover-1')).not.toBeInTheDocument();
  });

  it('renders table with active-active config when domain is active-active', async () => {
    await setup({
      domainDescription: mockActiveActiveDomain,
      failoverResponse: {
        failoverEvents: [mockFailoverEvent],
        nextPageToken: '',
      },
    });

    expect(await screen.findByText('failover-1')).toBeInTheDocument();
  });
});

async function setup({
  domain = 'mock-domain',
  cluster = 'mock-cluster',
  domainDescription = mockDomainDescription,
  failoverResponse = {
    failoverEvents: [],
    nextPageToken: '',
  },
  failoverError = false,
}: {
  domain?: string;
  cluster?: string;
  domainDescription?: typeof mockDomainDescription;
  failoverResponse?: ListFailoverHistoryResponse;
  failoverError?: boolean;
}) {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <DomainPageFailovers domain={domain} cluster={cluster} />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: domainDescription satisfies DescribeDomainResponse,
        },
        {
          path: '/api/domains/:domain/:cluster/failovers',
          httpMethod: 'GET',
          mockOnce: false,
          ...(failoverError
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch failover history' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse:
                  failoverResponse satisfies ListFailoverHistoryResponse,
              }),
        },
      ],
    }
  );

  await screen.findByText('Failover ID');
}
