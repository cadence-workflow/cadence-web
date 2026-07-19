import { render, screen } from '@/test-utils/rtl';

import { type Props as FormattedDateProps } from '@/components/formatted-date/formatted-date.types';

import ScheduleRunsRuntimeCell from '../schedule-runs-runtime-cell';
import { type Props } from '../schedule-runs-runtime-cell.types';

jest.mock('@/components/formatted-date/formatted-date', () =>
  jest.fn(({ timestampMs }: FormattedDateProps) => (
    <time>{timestampMs ?? 'Ongoing'}</time>
  ))
);

describe(ScheduleRunsRuntimeCell.name, () => {
  it('renders a running execution', () => {
    setup({ startTime: 100, closeTime: undefined });

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('renders a closed execution', () => {
    setup({ startTime: 100, closeTime: 200 });

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.queryByText('Ongoing')).not.toBeInTheDocument();
  });

  it('renders a fallback when the start time is missing', () => {
    setup({ startTime: 0, closeTime: undefined });

    expect(screen.getByText('None')).toBeInTheDocument();
  });
});

function setup(props: Props) {
  render(<ScheduleRunsRuntimeCell {...props} />);
}
