import { render, screen } from '@/test-utils/rtl';

import ScheduleDetailsBadges from '../schedule-details-badges';

describe(ScheduleDetailsBadges.name, () => {
  it('renders each label as a badge', () => {
    setup({ labels: ['32 runs', 'region'] });

    expect(screen.getByText('32 runs')).toBeInTheDocument();
    expect(screen.getByText('region')).toBeInTheDocument();
  });

  it('renders nothing when labels are empty', () => {
    setup({ labels: [] });
    expect(screen.queryByText('32 runs')).not.toBeInTheDocument();
  });
});

function setup({ labels }: { labels: string[] }) {
  render(<ScheduleDetailsBadges labels={labels} />);
}
