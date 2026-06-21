import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  }),
}));

import SchedulePageTabsError from '../schedule-page-tabs-error';

describe(SchedulePageTabsError.name, () => {
  it('renders the error message', () => {
    setup();

    expect(
      screen.getByText('Failed to load schedule content')
    ).toBeInTheDocument();
  });

  it('renders a Retry button', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('calls reset when Retry is clicked', async () => {
    const reset = jest.fn();
    const { user } = setup({ reset });

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});

function setup({
  error = new Error('Something went wrong'),
  reset = jest.fn(),
}: {
  error?: Error;
  reset?: jest.Mock;
} = {}) {
  const user = userEvent.setup();
  render(<SchedulePageTabsError error={error} reset={reset} />);
  return { user };
}
