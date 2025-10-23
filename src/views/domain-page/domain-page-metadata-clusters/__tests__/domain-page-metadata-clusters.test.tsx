import { render, screen } from '@/test-utils/rtl';

import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import {
  mockDomainDescription,
  mockDomainDescriptionSingleCluster,
} from '../../__fixtures__/domain-description';
import DomainPageMetadataClusters from '../domain-page-metadata-clusters';

jest.mock('../../helpers/get-cluster-replication-status-label');

describe(DomainPageMetadataClusters.name, () => {
  it('renders plain text for single cluster', async () => {
    render(
      <DomainPageMetadataClusters {...mockDomainDescriptionSingleCluster} />
    );

    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders active/passive labels and links for active-passive domains', () => {
    const { container } = render(
      <DomainPageMetadataClusters {...mockDomainDescription} />
    );

    expect(container).toHaveTextContent(
      'cluster_1 (active), cluster_2 (passive)'
    );

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(2);

    links.forEach((link, i) => {
      expect(link.innerHTML).toBe(
        mockDomainDescription.clusters[i].clusterName
      );
      expect(link).toHaveAttribute(
        'href',
        `/domains/${mockDomainDescription.name}/${mockDomainDescription.clusters[i].clusterName}`
      );
    });
  });

  it('renders primary label only for active cluster in active-active domains', () => {
    const { container } = render(
      <DomainPageMetadataClusters {...mockActiveActiveDomain} />
    );

    expect(container).toHaveTextContent('cluster0 (primary), cluster1');

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(2);

    links.forEach((link, i) => {
      expect(link.innerHTML).toBe(
        mockActiveActiveDomain.clusters[i].clusterName
      );
      expect(link).toHaveAttribute(
        'href',
        `/domains/${mockActiveActiveDomain.name}/${mockActiveActiveDomain.clusters[i].clusterName}`
      );
    });
  });
});
