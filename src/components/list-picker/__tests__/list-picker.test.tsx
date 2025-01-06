import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import ListPicker from '../list-picker';

const MOCK_LIST_PICKER_LABELS = {
  opt1: 'Option 1',
  opt2: 'Option 2',
  opt3: 'Option 3',
};

type MockListPickerOption = keyof typeof MOCK_LIST_PICKER_LABELS;

describe(ListPicker.name, () => {
  it('renders without errors', () => {
    setup({});
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Mock label')).toBeInTheDocument();
    expect(screen.getByText('Mock placeholder')).toBeInTheDocument();
  });

  it('displays all the options in the select component', () => {
    setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    Object.entries(MOCK_LIST_PICKER_LABELS).forEach(([_, value]) =>
      expect(screen.getByText(value)).toBeInTheDocument()
    );
  });

  it('calls the setQueryParams function when an option is selected', () => {
    const { mockSetValue } = setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    const option = screen.getByText('Option 1');
    act(() => {
      fireEvent.click(option);
    });
    expect(mockSetValue).toHaveBeenCalledWith('opt1');
  });

  it('calls the setQueryParams function when the filter is cleared', () => {
    const { mockSetValue } = setup({
      override: 'opt2',
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith(undefined);
  });
});

function setup({ override }: { override?: MockListPickerOption }) {
  const mockSetValue = jest.fn();
  render(
    <ListPicker
      label="Mock label"
      placeholder="Mock placeholder"
      value={override ?? undefined}
      setValue={mockSetValue}
      labelMap={MOCK_LIST_PICKER_LABELS}
    />
  );

  return { mockSetValue };
}
