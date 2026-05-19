import { render, screen } from '@/test-utils/rtl';

import DomainSchedulesCronExpressionCell from '../domain-schedules-cron-expression-cell';

describe(DomainSchedulesCronExpressionCell.name, () => {
  it('renders the human-readable description and the expression for a valid cron expression', () => {
    setup({ cronExpression: '0 * * * *' });

    expect(screen.getByText('Every hour (0 * * * *)')).toBeInTheDocument();
  });

  it('renders only the raw expression when the cron expression is invalid', () => {
    setup({ cronExpression: 'invalid-cron' });

    expect(screen.getByText('invalid-cron')).toBeInTheDocument();
  });
});

function setup({ cronExpression }: { cronExpression: string }) {
  render(<DomainSchedulesCronExpressionCell cronExpression={cronExpression} />);
}
