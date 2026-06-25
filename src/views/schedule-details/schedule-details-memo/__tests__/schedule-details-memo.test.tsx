import { render, screen } from '@/test-utils/rtl';

import ScheduleDetailsMemo from '../schedule-details-memo';
import { type Props } from '../schedule-details-memo.types';

describe(ScheduleDetailsMemo.name, () => {
  it('renders tab-indented JSON for memo fields', () => {
    setup({
      memo: {
        fields: {
          team: { data: 'eyJ0ZWFtIjoiY2FkZW5jZSJ9' },
          note: { data: 'dGVzdC1ub3Rl' },
        },
      },
    });

    const pre = screen.getByText((_, element) => element?.tagName === 'PRE');
    expect(pre).toHaveTextContent('"team": "cadence"');
    expect(pre).toHaveTextContent('"note": "test-note"');
    expect(pre.textContent).toContain('\t');
  });

  it('renders nothing when memo fields are absent', () => {
    setup({ memo: null });
    expect(screen.queryByText(/team/)).not.toBeInTheDocument();
  });
});

function setup({ memo }: Pick<Props, 'memo'>) {
  render(<ScheduleDetailsMemo memo={memo} />);
}
