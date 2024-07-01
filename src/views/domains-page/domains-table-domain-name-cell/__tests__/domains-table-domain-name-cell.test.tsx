import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { globalDomain } from '../../__fixtures__/domains';
import DomainsTableDomainNameCell from '../domains-table-domain-name-cell';

jest.mock('@/views/shared/domain-status-tag/domain-status-tag', () =>
  jest.fn(({ status }: { status: string }) => (
    <div>Mock domain status: {status}</div>
  ))
);

describe('DomainTableClusterCell', () => {
  it('should render link for domain if domain using the active cluster', async () => {
    render(<DomainsTableDomainNameCell {...globalDomain} />);
    const clusterLinks = await screen.findAllByRole('link');
    clusterLinks.forEach((clusterLink) => {
      expect(clusterLink.innerHTML).toBe(globalDomain.name);
      expect(clusterLink).toHaveAttribute(
        'href',
        `/domains/${globalDomain.name}/${globalDomain.activeClusterName}`
      );
    });
  });

  it('should render tag for domain if domain has status other than registered', async () => {
    render(
      <DomainsTableDomainNameCell
        {...globalDomain}
        status="DOMAIN_STATUS_DEPRECATED"
      />
    );

    expect(
      screen.getByText('Mock domain status: DOMAIN_STATUS_DEPRECATED')
    ).toBeInTheDocument();
  });
});
