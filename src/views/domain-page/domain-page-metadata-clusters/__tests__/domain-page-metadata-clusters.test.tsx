import { render, screen } from '@/test-utils/rtl';

import {
  mockDomainInfo,
  mockDomainInfoSingleCluster,
} from '../../__fixtures__/domain-info';
import DomainPageMetadataClusters from '../domain-page-metadata-clusters';

describe(DomainPageMetadataClusters.name, () => {
  it('renders plain text for single cluster', async () => {
    render(<DomainPageMetadataClusters {...mockDomainInfoSingleCluster} />);

    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders active/passive labels and links for multiple clusters', () => {
    const { container } = render(
      <DomainPageMetadataClusters {...mockDomainInfo} />
    );

    expect(container).toHaveTextContent(
      'cluster_1 (active), cluster_2 (passive)'
    );

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(2);

    links.forEach((link, i) => {
      expect(link.innerHTML).toBe(mockDomainInfo.clusters[i].clusterName);
      expect(link).toHaveAttribute(
        'href',
        `/domains/${mockDomainInfo.name}/${mockDomainInfo.clusters[i].clusterName}`
      );
    });
  });
});
