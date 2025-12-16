import { render, screen } from '@/test-utils/rtl';

import DomainPageFailoverSingleCluster from '../domain-page-failover-single-cluster';

describe(DomainPageFailoverSingleCluster.name, () => {
  it('renders fromCluster and toCluster with arrow', () => {
    setup({ fromCluster: 'cluster-1', toCluster: 'cluster-2' });

    expect(screen.getByText(/cluster-1/)).toBeInTheDocument();
    expect(screen.getByText(/cluster-2/)).toBeInTheDocument();
  });

  it('renders a placeholder when fromCluster is missing', () => {
    setup({ toCluster: 'cluster-2' });

    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText(/cluster-2/)).toBeInTheDocument();
  });

  it('renders a placeholder when toCluster is missing', () => {
    setup({ fromCluster: 'cluster-1' });

    expect(screen.getByText(/cluster-1/)).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('renders null (and not the None placeholders) when both clusters are missing', () => {
    setup({});

    expect(screen.queryByText('None')).not.toBeInTheDocument();
  });
});

function setup(props: { fromCluster?: string; toCluster?: string }) {
  render(<DomainPageFailoverSingleCluster {...props} />);
}
