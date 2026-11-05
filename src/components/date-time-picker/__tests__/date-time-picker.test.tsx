import { useEffect, useRef, type ComponentProps } from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DateTimePicker from '../date-time-picker';
import { DATE_TIME_FORMAT_MINUTES } from '../date-time-picker.constants';
import formatDateTimeValue from '../helpers/format-date-time-value';

jest.mock('baseui/datepicker', () => ({
  Calendar: function MockCalendar({
    onChange,
    autoFocusCalendar,
  }: {
    onChange?: (args: { date: Date }) => void;
    autoFocusCalendar?: boolean;
  }) {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      if (autoFocusCalendar) ref.current?.focus();
    }, [autoFocusCalendar]);
    return (
      <button
        ref={ref}
        type="button"
        data-testid="calendar-pick-day"
        onClick={() =>
          onChange?.({ date: new Date('2024-06-15T00:00:00.000Z') })
        }
      >
        pick day
      </button>
    );
  },
}));

describe(DateTimePicker.name, () => {
  it('commits typed display-format input on blur', async () => {
    const { user, onChange } = setup();
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '2024/06/15 14:30');
    await user.tab();
    expect(onChange.mock.calls.at(-1)?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('rejects partial input and restores the previous value on blur', async () => {
    const value = '2024-01-01T00:00:00.000Z';
    const { user, onChange } = setup({ value });
    const input = screen.getByRole('textbox');
    await user.clear(input);
    onChange.mockClear();
    await user.type(input, '2024/06');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(
      formatDateTimeValue(value, DATE_TIME_FORMAT_MINUTES)
    );
  });

  it('does not commit undefined while the input is emptied mid-edit', async () => {
    const { user, onChange } = setup({ value: '2024-01-01T00:00:00.000Z' });
    onChange.mockClear();
    const input = screen.getByRole('textbox');
    await user.clear(input);
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('commits empty on blur after the input is cleared by typing', async () => {
    const { user, onChange } = setup({ value: '2024-01-01T00:00:00.000Z' });
    onChange.mockClear();
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('commits clear from the clear icon without waiting for blur', async () => {
    const { user, onChange } = setup({ value: '2024-01-01T00:00:00.000Z' });
    onChange.mockClear();
    await user.click(screen.getByLabelText('Clear value'));
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('commits clear from the clear icon via keyboard', async () => {
    const { user, onChange } = setup({ value: '2024-01-01T00:00:00.000Z' });
    onChange.mockClear();
    const clear = screen.getByLabelText('Clear value');
    clear.focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('does not clear on Escape', async () => {
    const { user, onChange } = setup({ value: '2024-01-01T00:00:00.000Z' });
    onChange.mockClear();
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();
    expect(input).not.toHaveValue('');
  });

  it('keeps focus on the input after the first click opens the popover', async () => {
    const { user, onChange } = setup({ value: '2024-01-01T00:00:00.000Z' });
    onChange.mockClear();
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(input).toHaveFocus();
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('2024/06/15 14:30');
    await user.tab();
    expect(onChange.mock.calls.at(-1)?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('moves focus to the calendar on ArrowDown', async () => {
    const { user } = setup({ value: '2024-01-01T00:00:00.000Z' });
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(input).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('calendar-pick-day')).toHaveFocus();
  });

  it('returns focus to the input when Escape closes after ArrowDown', async () => {
    const { user } = setup({ value: '2024-01-01T00:00:00.000Z' });
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('calendar-pick-day')).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(input).toHaveFocus();
  });

  it('does not re-commit on blur when draft matches formatted value', async () => {
    const value = '2024-06-15T14:30:45.123Z';
    const { user, onChange } = setup({ value });
    onChange.mockClear();
    await user.click(screen.getByRole('textbox'));
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clamps calendar day selection to minDate when kept time is too early', async () => {
    const minDate = new Date('2024-06-15T18:00:00.000Z');
    const { user, onChange } = setup({
      value: '2024-06-20T00:00:00.000Z',
      minDate,
    });
    onChange.mockClear();
    await user.click(screen.getByRole('textbox'));
    await user.click(screen.getByTestId('calendar-pick-day'));
    expect(onChange).toHaveBeenCalledWith(minDate.toISOString());
  });

  it('clamps calendar day selection to maxDate when the pick is too late', async () => {
    const maxDate = new Date('2024-06-10T12:00:00.000Z');
    const { user, onChange } = setup({
      value: '2024-06-01T00:00:00.000Z',
      maxDate,
    });
    onChange.mockClear();
    await user.click(screen.getByRole('textbox'));
    await user.click(screen.getByTestId('calendar-pick-day'));
    expect(onChange).toHaveBeenCalledWith(maxDate.toISOString());
  });

  it('keeps the committed time when a calendar day is picked', async () => {
    const value = '2024-06-20T14:30:00.000Z';
    const { user, onChange } = setup({ value });
    onChange.mockClear();
    await user.click(screen.getByRole('textbox'));
    await user.click(screen.getByTestId('calendar-pick-day'));
    const iso = onChange.mock.calls.at(-1)?.[0] as string;
    expect(iso).toMatch(/^2024-06-15T14:30:00/);
  });

  it('forwards an object inputRef to the underlying input', () => {
    const inputRef = { current: null as HTMLInputElement | null };
    setup({ inputRef });
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('defaults placeholder to the display format', () => {
    setup({});
    expect(screen.getByPlaceholderText('YYYY/MM/DD HH:mm')).toBeInTheDocument();
  });

  it('renders a custom placeholder when provided', () => {
    setup({ placeholder: 'Select date and time' });
    expect(
      screen.getByPlaceholderText('Select date and time')
    ).toBeInTheDocument();
  });
});

function setup(props: Partial<ComponentProps<typeof DateTimePicker>> = {}) {
  const onChange = jest.fn();
  const user = userEvent.setup();
  render(
    <DateTimePicker
      aria-label="When"
      displayFormat={DATE_TIME_FORMAT_MINUTES}
      onChange={onChange}
      {...props}
    />
  );
  return { user, onChange };
}
