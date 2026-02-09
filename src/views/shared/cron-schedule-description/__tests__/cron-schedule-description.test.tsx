import { render, screen } from '@/test-utils/rtl';

import CronScheduleWithDescription from '../cron-schedule-description';

describe(CronScheduleWithDescription.name, () => {
  it('renders the cron expression', () => {
    render(<CronScheduleWithDescription cronSchedule="0 0 * * *" />);

    expect(screen.getByText(/0 0 \* \* \*/)).toBeInTheDocument();
  });

  it('renders human-readable description for valid cron expression', () => {
    render(<CronScheduleWithDescription cronSchedule="0 0 * * *" />);

    expect(screen.getByText(/0 0 \* \* \*/)).toBeInTheDocument();
    expect(screen.getByText(/At 12:00 AM/)).toBeInTheDocument();
  });

  it('renders human-readable description for complex cron expression', () => {
    render(<CronScheduleWithDescription cronSchedule="*/15 9-17 * * 1-5" />);

    expect(
      screen.getByText(
        /Every 15 minutes, between 09:00 AM and 05:59 PM, Monday through Friday/
      )
    ).toBeInTheDocument();
  });

  it('does not render description for invalid cron expression', () => {
    render(<CronScheduleWithDescription cronSchedule="invalid-cron" />);

    expect(screen.getByText('invalid-cron')).toBeInTheDocument();
    // Should only have the cron expression, no description in parentheses
    expect(screen.queryByText(/\(.*\)/)).not.toBeInTheDocument();
  });
});
