import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainSchedules from '../domain-schedules';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

describe(DomainSchedules.name, () => {
  it('renders toolbar', () => {
    setup();
    expect(
      screen.getByRole('heading', { name: 'Schedules (0)' })
    ).toBeInTheDocument();
  });

  it('renders the empty error panel', () => {
    setup();
    expect(screen.getByText('No schedules found')).toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();
  render(<DomainSchedules domain="d1" cluster="c1" />);
  return { user };
}
