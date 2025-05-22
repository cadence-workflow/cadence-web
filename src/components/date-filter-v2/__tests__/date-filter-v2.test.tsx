import React, { useState } from 'react';

import { type StatefulPopoverProps } from 'baseui/popover';
import { type TimePickerProps } from 'baseui/timepicker';

import { render, screen, fireEvent, act, waitFor } from '@/test-utils/rtl';

import DateFilterV2 from '../date-filter-v2';
import { type DateFilterRange } from '../date-filter-v2.types';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

// Mock StatefulPopover to render content immediately in tests
jest.mock('baseui/popover', () => {
  const originalModule = jest.requireActual('baseui/popover');
  return {
    ...originalModule,
    StatefulPopover: ({ content, children }: StatefulPopoverProps) => {
      const [isShown, setIsShown] = useState(false);

      return (
        <div onClick={() => setIsShown(true)}>
          {children}
          {isShown ? (
            <div data-testid="popover-content">
              {typeof content === 'function' &&
                content({ close: () => setIsShown(false) })}
            </div>
          ) : null}
        </div>
      );
    },
  };
});

jest.mock('baseui/timepicker', () => ({
  TimePicker: jest.fn(
    ({ value, onChange, disabled }: TimePickerProps) =>
      onChange && (
        <input
          data-testid="time-picker"
          value={value?.toTimeString() ?? ''}
          onChange={(e) => onChange(new Date(e.target.value))}
          disabled={disabled}
        />
      )
  ),
}));

const mockDateOverrides: DateFilterRange = {
  start: new Date('2023-05-23T00:00:00.000Z'),
  end: new Date('2023-05-24T00:00:00.000Z'),
};

describe(DateFilterV2.name, () => {
  it('displays the date filter component with placeholder when no dates are provided', () => {
    setup({});
    expect(screen.getByPlaceholderText('Mock placeholder')).toBeInTheDocument();
  });

  it('renders without errors when dates are already provided', () => {
    setup({
      overrides: mockDateOverrides,
    });

    expect(
      screen.getByDisplayValue('23 May, 00:00:00 UTC - 24 May, 00:00:00 UTC')
    ).toBeInTheDocument();
  });

  it('opens a popover when clicked', () => {
    setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.click(datePicker);
    });

    // Check for elements in the popover
    expect(screen.getByText('Quick Range')).toBeInTheDocument();
    expect(screen.getByText('Custom Range')).toBeInTheDocument();
    expect(screen.getByText('Last 5 minutes')).toBeInTheDocument();
  });

  it('selects a relative time range when clicking a quick range button', () => {
    const { mockOnChangeDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.click(datePicker);
    });

    const lastFiveMinutesButton = screen.getByText('Last 5 minutes');

    act(() => {
      fireEvent.click(lastFiveMinutesButton);
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith({
      start: 'now-5m',
      end: 'now',
    });
  });

  it('allows selecting a custom date range via the calendar', () => {
    const { mockOnChangeDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.click(datePicker);
    });

    const saveButton = screen.getByText('Save');
    const timePickers = screen.getAllByTestId('time-picker');

    act(() => {
      fireEvent.click(screen.getByLabelText(/May 13th 2023/));
    });

    expect(saveButton).toBeDisabled();
    timePickers.forEach((picker) => {
      expect(picker).toBeDisabled();
    });

    act(() => {
      fireEvent.click(screen.getByLabelText(/May 14th 2023/));
    });

    expect(saveButton).not.toBeDisabled();
    timePickers.forEach((picker) => {
      expect(picker).not.toBeDisabled();
    });

    act(() => {
      fireEvent.click(saveButton);
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith({
      start: new Date('2023-05-13T00:00:00.000Z'),
      end: new Date('2023-05-14T00:00:00.000Z'),
    });
  });

  it('handles single date selection (same start and end date)', () => {
    const { mockOnChangeDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.click(datePicker);
    });

    act(() => {
      fireEvent.click(screen.getByLabelText(/May 13th 2023/));
    });

    act(() => {
      fireEvent.click(screen.getByLabelText(/May 13th 2023/));
    });

    const saveButton = screen.getByText('Save');
    act(() => {
      fireEvent.click(saveButton);
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith({
      start: new Date('2023-05-13T00:00:00.000Z'),
      end: new Date('2023-05-13T23:59:59.999Z'),
    });
  });

  it('allows time adjustment after date selection', () => {
    const { mockOnChangeDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.click(datePicker);
    });

    act(() => {
      fireEvent.click(screen.getByLabelText(/May 13th 2023/));
    });

    act(() => {
      fireEvent.click(screen.getByLabelText(/May 14th 2023/));
    });

    const timePickers = screen.getAllByTestId('time-picker');
    expect(timePickers).toHaveLength(2);

    act(() => {
      fireEvent.change(timePickers[0], {
        target: { value: '2023-05-13 11:45' },
      });
      fireEvent.change(timePickers[1], {
        target: { value: '2023-05-14 15:45' },
      });
    });

    const saveButton = screen.getByText('Save');
    act(() => {
      fireEvent.click(saveButton);
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith(
      expect.objectContaining({
        start: new Date('2023-05-13T11:45:00.000Z'),
        end: new Date('2023-05-14T15:45:00.000Z'),
      })
    );
  });

  it('displays the correct format when using relative date values', () => {
    setup({
      overrides: {
        start: 'now-1h',
        end: 'now',
      },
    });

    expect(screen.getByDisplayValue('Last 1 hour')).toBeInTheDocument();
  });

  it('closes popover when clicking the close button', () => {
    setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.click(datePicker);
    });

    const quickRangeHeader = screen.getByText('Quick Range');
    expect(quickRangeHeader).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-button');

    act(() => {
      fireEvent.click(closeButton);
    });

    waitFor(() => {
      expect(quickRangeHeader).not.toBeInTheDocument();
    });
  });
});

function setup({ overrides }: { overrides?: Partial<DateFilterRange> }) {
  const mockOnChangeDates = jest.fn();

  const result = render(
    <DateFilterV2
      label="Mock label"
      placeholder="Mock placeholder"
      dates={{
        start: undefined,
        end: undefined,
        ...overrides,
      }}
      onChangeDates={mockOnChangeDates}
    />
  );

  return { mockOnChangeDates, ...result };
}
