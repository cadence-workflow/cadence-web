import { render, screen } from '@/test-utils/rtl';

import ScheduleCronExpression from '../schedule-cron-expression';
import { type Props } from '../schedule-cron-expression.types';

describe(ScheduleCronExpression.name, () => {
  it('renders the description, expression and default timezone', () => {
    setup({ cronExpression: '0 * * * *' });

    expect(screen.getByText('Every hour, UTC')).toBeInTheDocument();
    expect(screen.getByText('0 * * * *')).toBeInTheDocument();
  });

  it('renders the timezone when a CRON_TZ prefix is present', () => {
    setup({ cronExpression: 'CRON_TZ=America/New_York 30 1 * * *' });

    expect(screen.getByText('At 01:30, America/New_York')).toBeInTheDocument();
    expect(screen.getByText('30 1 * * *')).toBeInTheDocument();
  });

  it('renders times in 24-hour format', () => {
    setup({ cronExpression: '0 17 * * 0' });

    expect(
      screen.getByText('At 17:00, only on Sunday, UTC')
    ).toBeInTheDocument();
    expect(screen.getByText('0 17 * * 0')).toBeInTheDocument();
  });

  it('renders only the raw expression when the cron expression is invalid', () => {
    const { container } = setup({ cronExpression: 'invalid-cron' });

    expect(container).toHaveTextContent(/^invalid-cron$/);
  });
});

function setup(props: Props) {
  return render(<ScheduleCronExpression {...props} />);
}
