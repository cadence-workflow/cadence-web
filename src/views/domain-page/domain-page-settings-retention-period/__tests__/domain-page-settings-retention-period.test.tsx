import { fireEvent, render, screen } from '@/test-utils/rtl';

import DomainPageSettingsRetentionPeriod from '../domain-page-settings-retention-period';
import { NUM_SECONDS_IN_DAY } from '../domain-page-settings-retention-period.constants';

// Note: We use fireEvent instead of userEvent for this test file since userEvent
// is not able to properly trigger events for input changes in Form components
describe(DomainPageSettingsRetentionPeriod.name, () => {
  it('renders correctly for retention period of multiple days', () => {
    setup({ retentionPeriod: 5 * NUM_SECONDS_IN_DAY });

    expect(screen.getByRole('spinbutton')).toHaveDisplayValue('5');
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('renders correctly for retention period of 1 day', () => {
    setup({ retentionPeriod: 1 * NUM_SECONDS_IN_DAY });

    expect(screen.getByRole('spinbutton')).toHaveDisplayValue('1');
    expect(screen.getByText('Day')).toBeInTheDocument();
  });

  it('renders value with 2 decimal places for retention period of not exactly 1 day', () => {
    setup({ retentionPeriod: 90000 });

    expect(screen.getByRole('spinbutton')).toHaveDisplayValue('1.04');
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('calls onChange when value is changed', async () => {
    const { mockOnChange } = setup({ retentionPeriod: 5 * NUM_SECONDS_IN_DAY });

    const input = screen.getByRole('spinbutton');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 10 } });
    fireEvent.blur(input);

    expect(mockOnChange).toHaveBeenCalledWith(10 * NUM_SECONDS_IN_DAY);
  });

  it('changes value to the empty string when cleared', async () => {
    const { mockOnChange } = setup({ retentionPeriod: 5 * NUM_SECONDS_IN_DAY });

    const input = screen.getByRole('spinbutton');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(mockOnChange).toHaveBeenCalledWith(NaN);
  });
});

function setup({
  retentionPeriod,
  error,
}: {
  retentionPeriod: number;
  error?: string;
}) {
  const mockOnBlur = jest.fn();
  const mockOnChange = jest.fn();

  render(
    <DomainPageSettingsRetentionPeriod
      onBlur={mockOnBlur}
      onChange={mockOnChange}
      value={retentionPeriod}
      error={error}
    />
  );

  return { mockOnChange };
}
