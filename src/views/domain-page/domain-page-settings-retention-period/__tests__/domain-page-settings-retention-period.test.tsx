import { fireEvent, render, screen } from '@/test-utils/rtl';

import DomainPageSettingsRetentionPeriod from '../domain-page-settings-retention-period';

// Note: We use fireEvent instead of userEvent for this test file since userEvent
// is not able to properly trigger events for input changes in Form components
describe(DomainPageSettingsRetentionPeriod.name, () => {
  it('renders correctly for retention period of multiple days', () => {
    setup({ retentionPeriod: 5 });

    expect(screen.getByRole('spinbutton')).toHaveDisplayValue('5');
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('renders correctly for retention period of 1 day', () => {
    setup({ retentionPeriod: 1 });

    expect(screen.getByRole('spinbutton')).toHaveDisplayValue('1');
    expect(screen.getByText('Day')).toBeInTheDocument();
  });

  it('calls onChange when value is changed', async () => {
    const { mockOnChange } = setup({ retentionPeriod: 5 });

    const input = screen.getByRole('spinbutton');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 10 } });
    fireEvent.blur(input);

    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it('changes value to the empty string when cleared', async () => {
    const { mockOnChange } = setup({ retentionPeriod: 5 });

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
