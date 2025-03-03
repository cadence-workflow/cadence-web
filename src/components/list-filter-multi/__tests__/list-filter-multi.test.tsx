import React from 'react';

import { userEvent, render, screen } from '@/test-utils/rtl';

import ListFilterMulti from '../list-filter-multi';

const MOCK_LIST_FILTER_LABELS = {
  opt1: 'Option 1',
  opt2: 'Option 2',
  opt3: 'Option 3',
};

type MockListFilterOption = keyof typeof MOCK_LIST_FILTER_LABELS;

describe(ListFilterMulti.name, () => {
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
    const { user, mockOnChangeValues } = setup({});

    const selectFilter = screen.getByRole('combobox');
    await user.click(selectFilter);

    const option1 = screen.getByText('Option 1');
    await user.click(option1);

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt1']);

    await user.click(selectFilter);

    const option2 = screen.getByText('Option 2');
    await user.click(option2);

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt2']);
  });

  it('calls the setQueryParams function when the filter is cleared', async () => {
    const { user, mockOnChangeValues } = setup({
      override: ['opt2'],
    });

    const clearButton = screen.getByLabelText('Clear all');
    await user.click(clearButton);

    expect(mockOnChangeValues).toHaveBeenCalledWith(undefined);
  });
});

function setup({ override }: { override?: Array<MockListFilterOption> }) {
  const mockOnChangeValues = jest.fn();
  const user = userEvent.setup();
  render(
    <ListFilterMulti
      label="Mock label"
      placeholder="Mock placeholder"
      values={override ?? undefined}
      onChangeValues={mockOnChangeValues}
      labelMap={MOCK_LIST_FILTER_LABELS}
    />
  );

  return { user, mockOnChangeValues };
}
