import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import buildPausedBannerMessage from '../build-paused-banner-message';

describe(buildPausedBannerMessage.name, () => {
  it('renders full pause details', () => {
    render(
      buildPausedBannerMessage({
        pausedAt: 'Apr 27, 2026, 10:19:20.00 PM GMT+2',
        pausedBy: 'operator@example.com',
        reason: 'Paused for maintenance',
      })
    );

    expect(
      screen.getByText(/Schedule was paused Apr 27, 2026, 10:19:20\.00 PM GMT\+2 by/)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'operator@example.com' })).toHaveAttribute(
      'href',
      'mailto:operator@example.com'
    );
    expect(document.body.textContent).toMatch(/Reason: "Paused for maintenance"/);
  });

  it('omits missing pause details', () => {
    render(
      buildPausedBannerMessage({
        pausedAt: null,
        pausedBy: null,
        reason: null,
      })
    );

    expect(screen.getByText('Schedule was paused')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Unknown/);
    expect(document.body.textContent).not.toMatch(/Reason:/);
  });
});
