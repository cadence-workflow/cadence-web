import { render, screen } from '@/test-utils/rtl';

import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';
import { DEFAULT_CLUSTER_SCOPE } from '@/views/domain-page/domain-page-failovers/domain-page-failovers.constants';

import DomainPageFailoverActiveActive from '../domain-page-failover-active-active';

jest.mock(
  '../../domain-page-failover-single-cluster/domain-page-failover-single-cluster',
  () =>
    jest.fn((props: { fromCluster?: string; toCluster?: string }) => (
      <div data-testid="mock-single-cluster-failover">
        {`${props.fromCluster} -> ${props.toCluster}`}
      </div>
    ))
);

jest.mock('../../domain-page-failover-modal/domain-page-failover-modal', () =>
  jest.fn(() => <div data-testid="mock-failover-modal">Modal</div>)
);

describe(DomainPageFailoverActiveActive.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cluster failover when matching default cluster failover is found', () => {
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
      clusterAttributeScope: DEFAULT_CLUSTER_SCOPE,
    });

    expect(screen.getByText('Default:')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-single-cluster-failover')
    ).toBeInTheDocument();
    expect(screen.getByText('cluster-1 -> cluster-2')).toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
    expect(screen.getByTestId('mock-failover-modal')).toBeInTheDocument();
  });

  it('renders cluster failover when matching non-default cluster failover is found', () => {
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
    expect(screen.getByTestId('mock-failover-modal')).toBeInTheDocument();
  });

  it('does not render cluster failover section when clusterAttributeScope is set but clusterAttributeValue is undefined for non-default scope', () => {
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
    expect(screen.getByTestId('mock-failover-modal')).toBeInTheDocument();
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
    expect(screen.getByTestId('mock-failover-modal')).toBeInTheDocument();
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
    expect(screen.getByTestId('mock-failover-modal')).toBeInTheDocument();
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
      clusterAttributeScope: DEFAULT_CLUSTER_SCOPE,
    });

    expect(
      screen.queryByTestId('mock-single-cluster-failover')
    ).not.toBeInTheDocument();
    expect(screen.getByText('See more')).toBeInTheDocument();
    expect(screen.getByTestId('mock-failover-modal')).toBeInTheDocument();
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
    expect(screen.getByTestId('mock-failover-modal')).toBeInTheDocument();
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
  render(
    <DomainPageFailoverActiveActive
      failoverEvent={failoverEvent}
      clusterAttributeScope={clusterAttributeScope}
      clusterAttributeValue={clusterAttributeValue}
    />
  );
}
