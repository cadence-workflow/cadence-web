import { render, screen } from '@/test-utils/rtl';

import * as usePageQueryParamsModule from '@/hooks/use-page-query-params/use-page-query-params';
import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import { PRIMARY_CLUSTER_SCOPE } from '@/views/domain-page/domain-page-failovers/domain-page-failovers.constants';

import DomainPageFailoverActiveActive from '../domain-page-failover-active-active';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

jest.mock(
  '../../domain-page-failover-single-cluster/domain-page-failover-single-cluster',
  () =>
    jest.fn((props: { fromCluster?: string; toCluster?: string }) => (
      <div data-testid="mock-single-cluster-failover">
        {`${props.fromCluster} -> ${props.toCluster}`}
      </div>
    ))
);

describe(DomainPageFailoverActiveActive.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cluster failover when matching primary cluster failover is found', () => {
    const failoverEvent: FailoverEvent = {
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

    setup({
      failoverEvent,
      clusterAttributeScope: PRIMARY_CLUSTER_SCOPE,
    });

    expect(screen.getByText('Primary:')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-single-cluster-failover')
    ).toBeInTheDocument();
    expect(screen.getByText('cluster-1 -> cluster-2')).toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
  });

  it('renders cluster failover when matching non-primary cluster failover is found', () => {
    const failoverEvent: FailoverEvent = {
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
          clusterAttribute: {
            scope: 'city',
            name: 'new_york',
          },
        },
      ],
    };

    setup({
      failoverEvent,
      clusterAttributeScope: 'city',
      clusterAttributeValue: 'new_york',
    });

    expect(screen.getByText('city (new_york):')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-single-cluster-failover')
    ).toBeInTheDocument();
    expect(screen.getByText('cluster-1 -> cluster-2')).toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
  });

  it('does not render cluster failover section when clusterAttributeScope is set but clusterAttributeValue is undefined for non-primary scope', () => {
    const failoverEvent: FailoverEvent = {
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
          clusterAttribute: {
            scope: 'region',
            name: 'us-east',
          },
        },
      ],
    };

    setup({
      failoverEvent,
      clusterAttributeScope: 'region',
    });

    expect(
      screen.queryByTestId('mock-single-cluster-failover')
    ).not.toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
  });

  it('does not render cluster failover section when no matching cluster failover is found', () => {
    const failoverEvent: FailoverEvent = {
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
          clusterAttribute: {
            scope: 'city',
            name: 'new_york',
          },
        },
      ],
    };

    setup({
      failoverEvent,
      clusterAttributeScope: 'city',
      clusterAttributeValue: 'los_angeles',
    });

    expect(screen.queryByText('city (los_angeles):')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('mock-single-cluster-failover')
    ).not.toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
  });

  it('does not render cluster failover section when clusterAttributeScope is undefined', () => {
    const failoverEvent: FailoverEvent = {
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

    setup({
      failoverEvent,
      clusterAttributeScope: undefined,
    });

    expect(
      screen.queryByTestId('mock-single-cluster-failover')
    ).not.toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
  });

  it('renders "See more" button even when no matching cluster failover is found', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({
      failoverEvent,
      clusterAttributeScope: PRIMARY_CLUSTER_SCOPE,
    });

    expect(
      screen.queryByTestId('mock-single-cluster-failover')
    ).not.toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
  });

  it('selects the correct cluster failover when multiple cluster failovers exist', () => {
    const failoverEvent: FailoverEvent = {
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
          clusterAttribute: {
            scope: 'city',
            name: 'new_york',
          },
        },
        {
          fromCluster: {
            activeClusterName: 'cluster-3',
            failoverVersion: '3',
          },
          toCluster: {
            activeClusterName: 'cluster-4',
            failoverVersion: '4',
          },
          clusterAttribute: {
            scope: 'region',
            name: 'us-east',
          },
        },
      ],
    };

    setup({
      failoverEvent,
      clusterAttributeScope: 'region',
      clusterAttributeValue: 'us-east',
    });

    expect(screen.getByText('region (us-east):')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-single-cluster-failover')
    ).toBeInTheDocument();
    expect(screen.getByText('cluster-3 -> cluster-4')).toBeInTheDocument();
  });
});

function setup({
  failoverEvent,
  clusterAttributeScope,
  clusterAttributeValue,
}: {
  failoverEvent: FailoverEvent;
  clusterAttributeScope?: string;
  clusterAttributeValue?: string;
}) {
  jest.spyOn(usePageQueryParamsModule, 'default').mockReturnValue([
    {
      ...mockDomainPageQueryParamsValues,
      clusterAttributeScope,
      clusterAttributeValue,
    } as typeof mockDomainPageQueryParamsValues,
    mockSetQueryParams,
  ]);

  render(<DomainPageFailoverActiveActive failoverEvent={failoverEvent} />);
}
