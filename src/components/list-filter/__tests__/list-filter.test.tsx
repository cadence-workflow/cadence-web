import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import ListFilter from '../list-filter';

const MOCK_LIST_FILTER_LABELS = {
  opt1: 'Option 1',
  opt2: 'Option 2',
  opt3: 'Option 3',
};

type MockListFilterOption = keyof typeof MOCK_LIST_FILTER_LABELS;

describe(ListFilter.name, () => {
  it('renders without errors', () => {
    setup({});
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Mock label')).toBeInTheDocument();
    expect(screen.getByText('Mock placeholder')).toBeInTheDocument();
  });

  it('displays all the options in the select component', async () => {
    const { user } = setup({});

    const selectFilter = screen.getByRole('combobox');
    await user.click(selectFilter);

    Object.entries(MOCK_LIST_FILTER_LABELS).forEach(([_, value]) =>
      expect(screen.getByText(value)).toBeInTheDocument()
    );
  });

  it('calls the setQueryParams function when an option is selected', async () => {
    const { user, mockOnChangeValue } = setup({});

    const selectFilter = screen.getByRole('combobox');
    await user.click(selectFilter);

    const option = screen.getByText('Option 1');
    await user.click(option);

    expect(mockOnChangeValue).toHaveBeenCalledWith('opt1');
  });

  it('calls the setQueryParams function when the filter is cleared', async () => {
    const { user, mockOnChangeValue } = setup({
      override: 'opt2',
    });

    const clearButton = screen.getByLabelText('Clear value');
    await user.click(clearButton);

    expect(mockOnChangeValue).toHaveBeenCalledWith(undefined);
  });
});

function setup({ override }: { override?: MockListFilterOption }) {
  const mockOnChangeValue = jest.fn();
  const user = userEvent.setup();

  render(
    <ListFilter
      label="Mock label"
      placeholder="Mock placeholder"
      value={override ?? undefined}
      onChangeValue={mockOnChangeValue}
      labelMap={MOCK_LIST_FILTER_LABELS}
    />
  );

  return { user, mockOnChangeValue };
}
