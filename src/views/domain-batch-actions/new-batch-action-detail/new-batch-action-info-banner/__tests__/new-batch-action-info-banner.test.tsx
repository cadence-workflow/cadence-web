import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import NewBatchActionInfoBanner from '../new-batch-action-info-banner';

describe(NewBatchActionInfoBanner.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the banner title and subtitle', () => {
    render(<NewBatchActionInfoBanner />);

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
    render(<NewBatchActionInfoBanner />);

    expect(screen.getByText('Got it!')).toBeInTheDocument();
  });

  it('hides the banner when the dismiss button is clicked', async () => {
    const user = userEvent.setup();

    render(<NewBatchActionInfoBanner />);

    await user.click(screen.getByText('Got it!'));

    expect(screen.queryByText('Got it!')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Batch actions can only be submitted for running workflows'
      )
    ).not.toBeInTheDocument();
  });
});
