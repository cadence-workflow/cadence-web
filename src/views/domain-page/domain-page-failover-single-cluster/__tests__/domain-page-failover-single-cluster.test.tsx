import { render, screen } from '@/test-utils/rtl';

import DomainPageFailoverSingleCluster from '../domain-page-failover-single-cluster';

describe(DomainPageFailoverSingleCluster.name, () => {
  it('renders fromCluster and toCluster with arrow', () => {
    setup({ fromCluster: 'cluster-1', toCluster: 'cluster-2' });

    expect(screen.getByText(/cluster-1/)).toBeInTheDocument();
    expect(screen.getByText(/cluster-2/)).toBeInTheDocument();
  });

  it('returns null when fromCluster is missing', () => {
    setup({ toCluster: 'cluster-2' });

    expect(screen.queryByText(/cluster-2/)).not.toBeInTheDocument();
  });

  it('returns null when toCluster is missing', () => {
    setup({ fromCluster: 'cluster-1' });

    expect(screen.queryByText(/cluster-1/)).not.toBeInTheDocument();
  });
});

function setup(props: { fromCluster?: string; toCluster?: string }) {
  render(<DomainPageFailoverSingleCluster {...props} />);
}
