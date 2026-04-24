import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainNewBatchActionInfoBanner from '../domain-new-batch-action-info-banner';

describe(DomainNewBatchActionInfoBanner.name, () => {
  it('renders the banner title and subtitle', () => {
    setup();

    expect(
      screen.getByText(
        'Batch actions can only be submitted for running workflows'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/That means that the workflows listed below/)
    ).toBeInTheDocument();
  });

  it('renders the dismiss button', () => {
    setup();

    expect(screen.getByText('Got it!')).toBeInTheDocument();
  });

  it('hides the banner when the dismiss button is clicked', async () => {
    const { user } = setup();

    await user.click(screen.getByText('Got it!'));

    expect(screen.queryByText('Got it!')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Batch actions can only be submitted for running workflows'
      )
    ).not.toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();
  render(<DomainNewBatchActionInfoBanner />);
  return { user };
}
