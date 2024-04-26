import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import DomainsTableClusterCell from '../domains-table-cluster-cell';
import { globalDomain, localDomain } from '../../__fixtures__/domains';

describe('DomainTableClusterCell', () => {
  it('should render link for each cluster if domain is in more than one cluster', async () => {
    render(<DomainsTableClusterCell {...globalDomain} />);
    const clusterLinks = await screen.findAllByRole('link');
    clusterLinks.forEach((clusterLink, i) => {
      expect(clusterLink.innerHTML).toBe(globalDomain.clusters[i].clusterName);
      expect(clusterLink).toHaveAttribute('href', '/');
    });
  });

  it('should render cluster name as text if domain is in single cluser', async () => {
    render(<DomainsTableClusterCell {...localDomain} />);
    const clusterLinks = screen.queryAllByRole('link');
    expect(clusterLinks).toHaveLength(0);
    await screen.findAllByText(localDomain.clusters[0].clusterName);
  });
});
