import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import ScheduleStatusTag from '../schedule-status-tag';

jest.mock('baseui/badge', () => ({
  Badge: jest.fn(({ content, hierarchy, color }) => (
    <div data-testid="badge" data-hierarchy={hierarchy} data-color={color}>
      {content}
    </div>
  )),
}));

describe(ScheduleStatusTag.name, () => {
  it('renders Running label inside an accent primary badge when not paused', () => {
    render(<ScheduleStatusTag paused={false} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-hierarchy', 'primary');
    expect(badge).toHaveAttribute('data-color', 'accent');
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('renders Paused label inside a warning primary badge when paused', () => {
    render(<ScheduleStatusTag paused={true} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-hierarchy', 'primary');
    expect(badge).toHaveAttribute('data-color', 'warning');
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });
});
