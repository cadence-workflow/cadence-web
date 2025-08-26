import { render, screen } from '@/test-utils/rtl';

import {
  mockDomainDescription,
  mockDomainDescriptionSingleCluster,
} from '../../__fixtures__/domain-description';
import * as isActiveClusterModule from '../../helpers/is-active-cluster';
import DomainPageMetadataClusters from '../domain-page-metadata-clusters';

jest.mock('../../helpers/is-active-cluster', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(false),
}));

describe(DomainPageMetadataClusters.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders plain text for single cluster', async () => {
    render(
      <DomainPageMetadataClusters {...mockDomainDescriptionSingleCluster} />
    );

    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders active/passive labels and links for multiple clusters', () => {
    jest
      .spyOn(isActiveClusterModule, 'default')
      .mockReturnValueOnce(true) // cluster_1 is active
      .mockReturnValueOnce(false); // cluster_2 is passive

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
});
