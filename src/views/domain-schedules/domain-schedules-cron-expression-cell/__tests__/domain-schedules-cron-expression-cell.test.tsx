import { render, screen } from '@/test-utils/rtl';

import DomainSchedulesCronExpressionCell from '../domain-schedules-cron-expression-cell';

describe(DomainSchedulesCronExpressionCell.name, () => {
  it('renders the human-readable description and the expression for a valid cron expression', () => {
    setup({ cronExpression: '0 * * * *' });

    expect(screen.getByText('Every hour (0 * * * *), UTC')).toBeInTheDocument();
  });

  it('renders the timezone when a CRON_TZ prefix is present', () => {
    setup({ cronExpression: 'CRON_TZ=America/New_York 30 1 * * *' });

    expect(
      screen.getByText('At 01:30 AM (30 1 * * *), America/New_York')
    ).toBeInTheDocument();
  });

  it('renders only the raw expression when the cron expression is invalid', () => {
    setup({ cronExpression: 'invalid-cron' });

    expect(screen.getByText('invalid-cron')).toBeInTheDocument();
  });
});

function setup({ cronExpression }: { cronExpression: string }) {
  render(<DomainSchedulesCronExpressionCell cronExpression={cronExpression} />);
}
