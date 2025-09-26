import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import CronScheduleInput from '../cron-schedule-input';
import { type CronScheduleInputProps } from '../cron-schedule-input.types';

// Mock the CronScheduleInputPopover component
jest.mock('../cron-schedule-input-popover/cron-schedule-input-popover', () => {
  return function MockCronScheduleInputPopover({
    fieldType,
  }: {
    fieldType: string;
  }) {
    return (
      <div data-testid={`cron-schedule-input-popover-${fieldType}`}>
        Popover for {fieldType}
      </div>
    );
  };
});

const defaultProps: CronScheduleInputProps = {
  value: {
    minutes: '0',
    hours: '9',
    daysOfMonth: '1',
    months: '1',
    daysOfWeek: '1',
  },
  onChange: jest.fn(),
  onBlur: jest.fn(),
  onFocus: jest.fn(),
};

describe(CronScheduleInput.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all cron fields with correct labels', () => {
    setup();

    expect(screen.getByText('Minute')).toBeInTheDocument();
    expect(screen.getByText('Hour')).toBeInTheDocument();
    expect(screen.getByText('Day of Month')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Day of Week')).toBeInTheDocument();
  });

  it('should render input fields with correct values', () => {
    setup();

    expect(screen.getByLabelText('Minute')).toHaveValue('0');
    expect(screen.getByLabelText('Hour')).toHaveValue('9');
    expect(screen.getByLabelText('Day of Month')).toHaveValue('1');
    expect(screen.getByLabelText('Month')).toHaveValue('1');
    expect(screen.getByLabelText('Day of Week')).toHaveValue('1');
  });

  it('should render empty inputs when no value is provided', () => {
    setup({ value: undefined });

    expect(screen.getByLabelText('Minute')).toHaveValue('');
    expect(screen.getByLabelText('Hour')).toHaveValue('');
    expect(screen.getByLabelText('Day of Month')).toHaveValue('');
    expect(screen.getByLabelText('Month')).toHaveValue('');
    expect(screen.getByLabelText('Day of Week')).toHaveValue('');
  });

  it('should render with partial values', () => {
    const partialValue = {
      minutes: '30',
      hours: '14',
    };
    setup({ value: partialValue });

    expect(screen.getByLabelText('Minute')).toHaveValue('30');
    expect(screen.getByLabelText('Hour')).toHaveValue('14');

    expect(screen.getByLabelText('Day of Month')).toHaveValue('');
    expect(screen.getByLabelText('Month')).toHaveValue('');
    expect(screen.getByLabelText('Day of Week')).toHaveValue('');
  });

  it('should call onChange when input value changes', async () => {
    const { user, mockOnChange } = setup({ value: { minutes: '' } });

    const minutesInput = screen.getByLabelText('Minute');
    await user.type(minutesInput, '15');

    expect(mockOnChange).toHaveBeenCalled();

    const calls = mockOnChange.mock.calls;
    expect(calls[0][0].minutes).toBe('1');
    expect(calls[1][0].minutes).toBe('5');
  });

  it('should call onFocus when input is focused', async () => {
    const { user, mockOnFocus } = setup();

    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('should call onBlur when input loses focus', async () => {
    const { user, mockOnBlur } = setup();

    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);
    await user.tab();

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('should handle multiple field changes correctly', async () => {
    const { user, mockOnChange } = setup({ value: { minutes: '', hours: '' } });

    const minutesInput = screen.getByLabelText('Minute');
    const hoursInput = screen.getByLabelText('Hour');

    await user.type(minutesInput, '1');

    await user.type(hoursInput, '2');

    expect(mockOnChange).toHaveBeenCalled();

    const calls = mockOnChange.mock.calls;
    expect(calls[0][0].minutes).toBe('1');
    expect(calls[1][0].hours).toBe('2');
  });

  it('should open popover when input is focused', async () => {
    const { user } = setup();

    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);

    expect(
      screen.getByTestId('cron-schedule-input-popover-minutes')
    ).toBeInTheDocument();
  });

  it('should close popover when input loses focus', async () => {
    const { user } = setup();

    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);

    expect(
      screen.getByTestId('cron-schedule-input-popover-minutes')
    ).toBeInTheDocument();

    await user.tab();

    expect(
      screen.queryByTestId('cron-schedule-input-popover-minutes')
    ).not.toBeInTheDocument();
  });

  it('should open correct popover for each field', async () => {
    const { user } = setup();

    // Focus minutes field
    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);
    expect(
      screen.getByTestId('cron-schedule-input-popover-minutes')
    ).toBeInTheDocument();

    // Focus hours field - this should close the minutes popover and open hours popover
    const hoursInput = screen.getByLabelText('Hour');
    await user.click(hoursInput);

    // The minutes popover should be closed and hours popover should be open
    expect(
      screen.getByTestId('cron-schedule-input-popover-hours')
    ).toBeInTheDocument();
  });

  it('should show error state for string error', () => {
    setup({ error: 'Invalid cron expression' });

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should show error state for specific field errors', () => {
    const fieldErrors = {
      minutes: 'Invalid minutes value',
      hours: 'Invalid hours value',
      daysOfMonth: '',
      months: '',
      daysOfWeek: '',
      seconds: '',
      years: '',
    };

    setup({ error: fieldErrors });

    // Verify error states by selecting inputs by their labels
    expect(screen.getByLabelText('Minute')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Hour')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Day of Month')).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Month')).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Day of Week')).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('should not show error state when no error is provided', () => {
    setup();

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).not.toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should disable all inputs when disabled prop is true', () => {
    setup({ disabled: true });

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('should enable all inputs when disabled prop is false', () => {
    setup({ disabled: false });

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).not.toBeDisabled();
    });
  });

  it('should enable inputs by default when disabled prop is not provided', () => {
    setup();

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).not.toBeDisabled();
    });
  });

  it('should not trigger onChange when disabled', async () => {
    const { user, mockOnChange } = setup({ disabled: true });

    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);
    await user.type(minutesInput, '15');

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle undefined onChange gracefully', async () => {
    const { user } = setup({ onChange: undefined });

    const minutesInput = screen.getByLabelText('Minute');
    await user.type(minutesInput, '5');

    // Should not throw an error
    // Note: The input value won't update because there's no state management
    // when onChange is undefined, but the component should not crash
    expect(minutesInput).toBeInTheDocument();
  });

  it('should handle undefined onFocus gracefully', async () => {
    const { user } = setup({ onFocus: undefined });

    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);

    // Should not throw an error
    expect(
      screen.getByTestId('cron-schedule-input-popover-minutes')
    ).toBeInTheDocument();
  });

  it('should handle undefined onBlur gracefully', async () => {
    const { user } = setup({ onBlur: undefined });

    const minutesInput = screen.getByLabelText('Minute');
    await user.click(minutesInput);
    await user.tab();

    // Should not throw an error
    expect(
      screen.queryByTestId('cron-schedule-input-popover-minutes')
    ).not.toBeInTheDocument();
  });

  it('should maintain focus management between fields', async () => {
    const { user } = setup();

    const minutesInput = screen.getByLabelText('Minute');
    const hoursInput = screen.getByLabelText('Hour');

    await user.click(minutesInput);
    expect(minutesInput).toHaveFocus();

    await user.tab();
    expect(hoursInput).toHaveFocus();
  });
});

function setup(props: Partial<CronScheduleInputProps> = {}) {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();
  const mockOnFocus = jest.fn();
  const user = userEvent.setup();

  const mergedProps = {
    ...defaultProps,
    onChange: mockOnChange,
    onBlur: mockOnBlur,
    onFocus: mockOnFocus,
    ...props,
  };

  render(<CronScheduleInput {...mergedProps} />);

  return {
    user,
    mockOnChange,
    mockOnBlur,
    mockOnFocus,
  };
}
