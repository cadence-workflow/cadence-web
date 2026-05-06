import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainSchedules from '../domain-schedules';

describe(DomainSchedules.name, () => {
  it('renders the schedules page', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Schedules Placeholder' })
    ).toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();
  render(<DomainSchedules domain="d1" cluster="c1" />);
  return { user };
}
