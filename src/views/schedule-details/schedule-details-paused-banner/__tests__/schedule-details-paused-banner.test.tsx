import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { formatScheduleTimestamp } from '../../helpers/format-schedule-timestamp';

import ScheduleDetailsPausedBanner from '../schedule-details-paused-banner';
import { type Props } from '../schedule-details-paused-banner.types';

describe(ScheduleDetailsPausedBanner.name, () => {
  it('shows paused banner when schedule is paused', () => {
    const pausedAt = { seconds: '1704112496', nanos: 0 };

    setup({
      paused: true,
      pauseInfo: {
        pausedBy: 'operator@example.com',
        reason: 'Paused for maintenance',
        pausedAt,
      },
    });

    expect(screen.getByText(/Schedule was paused/)).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes(formatScheduleTimestamp(pausedAt)!)
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/operator@example.com/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/Reason: "Paused for maintenance"/);
  });

  it('omits unknown pause details when pause info is missing', () => {
    setup({
      paused: true,
      pauseInfo: {
        pausedBy: '',
        reason: '',
        pausedAt: null,
      },
    });

    expect(screen.getByText('Schedule was paused')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Unknown/);
    expect(document.body.textContent).not.toMatch(/Reason:/);
  });

  it('does not render when schedule is running', () => {
    setup({ paused: false, pauseInfo: null });

    expect(screen.queryByText(/Schedule was paused/)).not.toBeInTheDocument();
  });
});

function setup(props: Props) {
  return render(<ScheduleDetailsPausedBanner {...props} />);
}
