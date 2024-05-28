import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import DomainsTableDomainNameCell from '../domains-table-domain-name-cell';
import { globalDomain } from '../../__fixtures__/domains';

describe('DomainTableClusterCell', () => {
  it('should render link for domain if domain using the active cluster', async () => {
    render(<DomainsTableDomainNameCell {...globalDomain} />);
    const clusterLinks = await screen.findAllByRole('link');
    clusterLinks.forEach((clusterLink, i) => {
      expect(clusterLink.innerHTML).toBe(globalDomain.name);
      expect(clusterLink).toHaveAttribute(
        'href',
        `/domains/${globalDomain.name}/${globalDomain.activeClusterName}`
      );
    });
  });
});
