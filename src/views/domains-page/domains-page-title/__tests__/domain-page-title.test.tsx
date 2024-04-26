import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import DomainPageTitle from '../domains-page-title';

describe('DomainPageTitle', () => {
  it('should render title', async () => {
    render(<DomainPageTitle countBadge={null} />);
    await screen.findByText('All domains');
  });

  it('should render passed count badge', async () => {
    render(<DomainPageTitle countBadge={<div data-testid="count-badge" />} />);
    await screen.findAllByTestId('count-badge');
  });
});
