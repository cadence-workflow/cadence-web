import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import DatePicker from '../date-picker';
import { type DateRange } from '../date-picker.types';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

jest.mock('../date-picker.constants', () => ({
  ...jest.requireActual('../date-picker.constants'),
  DATE_FORMAT: 'dd MMM yyyy, HH:mm x',
}));

export const mockDateOverrides: DateRange = {
  start: new Date(1684800000000), // 23 May 2023 00:00
  end: new Date(1684886400000), // 24 May 2023 00:00
};

describe(DatePicker.name, () => {
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
    const { mockSetDates } = setup({});
    const datePicker = screen.getByPlaceholderText('Mock placeholder');
    act(() => {
      fireEvent.change(datePicker, {
        target: { value: '13 May 2023, 00:00 +00 – 14 May 2023, 00:00 +00' },
      });
    });

    expect(mockSetDates).toHaveBeenCalledWith({
      start: new Date('2023-05-13T00:00:00.000Z'),
      end: new Date('2023-05-14T00:00:00.000Z'),
    });
  });

  it('resets to previous date when one date is selected and then the modal is closed', () => {
    const { mockSetDates } = setup({
      overrides: mockDateOverrides,
    });
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

    expect(datePicker).toHaveValue(
      '23 May 2023, 00:00 +00 – 24 May 2023, 00:00 +00'
    );
    expect(mockSetDates).not.toHaveBeenCalled();
  });

  it('resets to empty state when one date is selected and then the modal is closed', () => {
    const { mockSetDates } = setup({});
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

    expect(datePicker).toHaveValue('');
    expect(mockSetDates).not.toHaveBeenCalled();
  });

  it('clears the date when the clear button is clicked', () => {
    const { mockSetDates } = setup({
      overrides: mockDateOverrides,
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });

    expect(mockSetDates).toHaveBeenCalledWith({
      start: undefined,
      end: undefined,
    });
  });
});

function setup({ overrides }: { overrides?: DateRange }) {
  const mockSetDates = jest.fn();
  render(
    <DatePicker
      label="Mock label"
      placeholder="Mock placeholder"
      dates={{
        start: undefined,
        end: undefined,
        ...overrides,
      }}
      setDates={mockSetDates}
    />
  );

  return { mockSetDates };
}
