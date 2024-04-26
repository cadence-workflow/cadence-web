import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import DomainsPageTitle from '../domains-page-title';

describe('DomainsPageTitle', () => {
  it('should render title', async () => {
    render(<DomainsPageTitle countBadge={null} />);
    await screen.findByText('All domains');
  });

  it('should render passed count badge', async () => {
    render(<DomainsPageTitle countBadge={<div data-testid="count-badge" />} />);
    await screen.findAllByTestId('count-badge');
  });
});
