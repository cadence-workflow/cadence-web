import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import DateFilter from '../date-filter';
import { type DateRange } from '../date-filter.types';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

jest.mock('../date-filter.constants', () => ({
  ...jest.requireActual('../date-filter.constants'),
  DATE_FORMAT: 'dd MMM yyyy, HH:mm x',
}));

export const mockDateOverrides: DateRange = {
  start: new Date(1684800000000), // 23 May 2023 00:00
  end: new Date(1684886400000), // 24 May 2023 00:00
};

describe(DateFilter.name, () => {
  it('displays the date picker component', () => {
    setup({});
    expect(screen.getByPlaceholderText('Mock placeholder')).toBeInTheDocument();
  });

  it('renders without errors when dates are already provided in query params', () => {
    setup({
      overrides: mockDateOverrides,
    });
    expect(
      // TODO - set timezone config for unit tests to UTC
      screen.getByDisplayValue(
        '23 May 2023, 00:00 +00 – 24 May 2023, 00:00 +00'
      )
    ).toBeInTheDocument();
  });

  it('sets query params when date is set', () => {
    const { mockOnChangeDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');
    act(() => {
      fireEvent.change(datePicker, {
        target: { value: '13 May 2023, 00:00 +00 – 14 May 2023, 00:00 +00' },
      });
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith({
      start: new Date('2023-05-13T00:00:00.000Z'),
      end: new Date('2023-05-14T00:00:00.000Z'),
    });
  });

  it('sets start and end time accordingly when one date is selected and then the modal is closed', () => {
    const { mockOnChangeDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.focus(datePicker);
    });

    const timeRangeStartLabel = screen.getByLabelText(
      "Choose Saturday, May 13th 2023. It's available."
    );

    act(() => {
      fireEvent.click(timeRangeStartLabel);
    });

    screen.getByText(
      'Selected date is 13 May 2023, 00:00 +00. Select the second date.'
    );

    act(() => {
      fireEvent.keyDown(datePicker, { keyCode: 9 });
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith({
      start: new Date('2023-05-13T00:00:00.000Z'),
      end: new Date('2023-05-13T23:59:59.999Z'),
    });
  });

  it('sets start and end time accordingly when the same date is selected', () => {
    const { mockOnChangeDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');

    act(() => {
      fireEvent.focus(datePicker);
    });

    const timeRangeStartLabel = screen.getByLabelText(
      "Choose Saturday, May 13th 2023. It's available."
    );

    act(() => {
      fireEvent.click(timeRangeStartLabel);
    });

    screen.getByText(
      'Selected date is 13 May 2023, 00:00 +00. Select the second date.'
    );

    screen.debug();

    const timeRangeEndLabel = screen.getByLabelText(
      "Selected start date. Saturday, May 13th 2023. It's available."
    );

    act(() => {
      fireEvent.click(timeRangeEndLabel);
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith({
      start: new Date('2023-05-13T00:00:00.000Z'),
      end: new Date('2023-05-13T23:59:59.999Z'),
    });
  });

  it('clears the date when the clear button is clicked', () => {
    const { mockOnChangeDates } = setup({
      overrides: mockDateOverrides,
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });

    expect(mockOnChangeDates).toHaveBeenCalledWith({
      start: undefined,
      end: undefined,
    });
  });
});

function setup({ overrides }: { overrides?: DateRange }) {
  const mockOnChangeDates = jest.fn();
  render(
    <DateFilter
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

  return { mockOnChangeDates };
}
