import { type ModalProps } from 'baseui/modal';

import { render, screen } from '@/test-utils/rtl';

import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';

import DomainPageFailoverModal from '../domain-page-failover-modal';

jest.mock('baseui/modal', () => ({
  ...jest.requireActual('baseui/modal'),
  Modal: ({ isOpen, children }: ModalProps) =>
    isOpen ? (
      <div aria-modal aria-label="dialog" role="dialog">
        {typeof children === 'function' ? children() : children}
      </div>
    ) : null,
}));

jest.mock('@/components/formatted-date/formatted-date', () =>
  jest.fn(({ timestampMs }: { timestampMs: number | null }) => (
    <div data-testid="formatted-date">
      {timestampMs ? new Date(timestampMs).toISOString() : 'No date'}
    </div>
  ))
);

jest.mock(
  '../../domain-page-failover-single-cluster/domain-page-failover-single-cluster',
  () =>
    jest.fn((props: { fromCluster?: string; toCluster?: string }) =>
      props.fromCluster && props.toCluster ? (
        <div data-testid="mock-single-cluster-failover">
          {`${props.fromCluster} -> ${props.toCluster}`}
        </div>
      ) : null
    )
);

describe(DomainPageFailoverModal.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({ failoverEvent, isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays failover ID correctly', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-123',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('failover-123')).toBeInTheDocument();
  });

  it('displays formatted time when createdTime is provided', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-date')).toBeInTheDocument();
  });

  it('handles null createdTime', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: null,
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-date')).toBeInTheDocument();
  });

  it('renders table with cluster failovers when clusterFailovers array is not empty', () => {
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

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('Scope')).toBeInTheDocument();
    expect(screen.getByText('Attribute')).toBeInTheDocument();
    expect(screen.getByText('Clusters')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-single-cluster-failover')
    ).toBeInTheDocument();
  });

  it('does not render table when clusterFailovers array is empty', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({ failoverEvent, isOpen: true });

    expect(screen.queryByText('Scope')).not.toBeInTheDocument();
    expect(screen.queryByText('Attribute')).not.toBeInTheDocument();
    expect(screen.queryByText('Clusters')).not.toBeInTheDocument();
  });

  it('displays Primary scope and dash for attribute when clusterAttribute is null', () => {
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

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('displays scope and attribute name when clusterAttribute is provided', () => {
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

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('city')).toBeInTheDocument();
    expect(screen.getByText('new_york')).toBeInTheDocument();
  });

  it('renders multiple cluster failovers correctly', () => {
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

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('region')).toBeInTheDocument();
    expect(screen.getByText('us-east')).toBeInTheDocument();
    const clusterComponents = screen.getAllByTestId(
      'mock-single-cluster-failover'
    );
    expect(clusterComponents).toHaveLength(2);
    expect(clusterComponents[0]).toHaveTextContent('cluster-1 -> cluster-2');
    expect(clusterComponents[1]).toHaveTextContent('cluster-3 -> cluster-4');
  });

  it('calls onClose when Close button is clicked', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    const mockOnClose = jest.fn();
    setup({ failoverEvent, isOpen: true, onClose: mockOnClose });

    const closeButton = screen.getByText('Close');
    closeButton.click();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays modal title correctly', () => {
    const failoverEvent: FailoverEvent = {
      id: 'failover-1',
      createdTime: {
        seconds: '1700000000',
        nanos: 0,
      },
      failoverType: 'FAILOVER_TYPE_GRACEFUL',
      clusterFailovers: [],
    };

    setup({ failoverEvent, isOpen: true });

    expect(screen.getByText('Failover Information')).toBeInTheDocument();
  });
});

function setup({
  failoverEvent,
  isOpen = true,
  onClose = jest.fn(),
}: {
  failoverEvent: FailoverEvent;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  render(
    <DomainPageFailoverModal
      failoverEvent={failoverEvent}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
