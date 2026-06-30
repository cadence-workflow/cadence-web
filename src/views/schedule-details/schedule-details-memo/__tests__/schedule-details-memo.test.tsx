import { render, screen } from '@/test-utils/rtl';

import losslessJsonStringify from '@/utils/lossless-json-stringify';

import ScheduleDetailsMemo from '../schedule-details-memo';
import { type Props } from '../schedule-details-memo.types';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }: { textToCopy: string }) => (
    <div data-testid="copy-text-button">{textToCopy}</div>
  ))
);

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }: { json: unknown }) => (
    <div data-testid="pretty-json">{JSON.stringify(json)}</div>
  ))
);

describe(ScheduleDetailsMemo.name, () => {
  it('renders formatted memo fields with PrettyJson', () => {
    setup({
      memo: {
        fields: {
          team: { data: 'ImNhZGVuY2Ui' },
          note: { data: 'dGVzdC1ub3Rl' },
        },
      },
    });

    expect(screen.getByTestId('pretty-json')).toHaveTextContent(
      JSON.stringify({ team: 'cadence', note: 'test-note' })
    );
  });

  it('renders copy text button with formatted memo JSON', () => {
    setup({
      memo: {
        fields: {
          team: { data: 'ImNhZGVuY2Ui' },
          note: { data: 'dGVzdC1ub3Rl' },
        },
      },
    });

    expect(screen.getByTestId('copy-text-button').innerHTML).toMatch(
      losslessJsonStringify({ team: 'cadence', note: 'test-note' }, null, '\t')
    );
  });

  it('renders nothing when memo fields are absent', () => {
    setup({ memo: null });
    expect(screen.queryByTestId('pretty-json')).not.toBeInTheDocument();
  });
});

function setup({ memo }: Pick<Props, 'memo'>) {
  render(<ScheduleDetailsMemo memo={memo} />);
}
