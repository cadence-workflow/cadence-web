import React from 'react';

import { render, screen } from '@/test-utils/rtl';

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

    const expectedMessage =
      'Schedule was paused 01 Jan 2024, 12:34:56 UTC by operator@example.com. Reason: "Paused for maintenance"';

    expect(document.body).toHaveTextContent(expectedMessage);
  });

  it('omits missing pause details when other pause info is present', () => {
    setup({
      paused: true,
      pauseInfo: {
        pausedBy: 'operator@example.com',
        reason: '',
        pausedAt: { seconds: '1704112496', nanos: 0 },
      },
    });

    expect(document.body).toHaveTextContent(
      'Schedule was paused 01 Jan 2024, 12:34:56 UTC by operator@example.com'
    );
    expect(document.body.textContent).not.toMatch(/Reason:/);
  });

  it('omits pausedBy when other pause info is present', () => {
    setup({
      paused: true,
      pauseInfo: {
        pausedBy: '',
        reason: 'Paused for maintenance',
        pausedAt: { seconds: '1704112496', nanos: 0 },
      },
    });

    expect(document.body).toHaveTextContent(
      'Schedule was paused 01 Jan 2024, 12:34:56 UTC. Reason: "Paused for maintenance"'
    );
    expect(document.body.textContent).not.toMatch(/ by /);
  });

  it('omits pausedAt when other pause info is present', () => {
    setup({
      paused: true,
      pauseInfo: {
        pausedBy: 'operator@example.com',
        reason: 'Paused for maintenance',
        pausedAt: null,
      },
    });

    expect(document.body).toHaveTextContent(
      'Schedule was paused by operator@example.com. Reason: "Paused for maintenance"'
    );
    expect(document.body.textContent).not.toMatch(/01 Jan 2024/);
  });

  it('does not render when schedule is running', () => {
    setup({ paused: false, pauseInfo: null });

    expect(screen.queryByText(/Schedule was paused/)).not.toBeInTheDocument();
  });
});

function setup(props: Props) {
  return render(<ScheduleDetailsPausedBanner {...props} />);
}
