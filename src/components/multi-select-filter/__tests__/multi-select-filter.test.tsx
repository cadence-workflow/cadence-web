import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import MultiSelectFilter from '../multi-select-filter';

jest.mock('../multi-select-menu/multi-select-menu', () =>
  jest.fn(() => (
    <div data-testid="multi-select-menu">Multi Select Menu Placeholder</div>
  ))
);

const MOCK_OPTIONS_LABEL_MAP = {
  opt1: 'Option 1',
  opt2: 'Option 2',
  opt3: 'Option 3',
} as const;

type MockOption = keyof typeof MOCK_OPTIONS_LABEL_MAP;

describe(MultiSelectFilter.name, () => {
  it('renders without errors', () => {
    setup({});

    expect(screen.getByText('Mock Label')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows multi select menu when dropdown is opened', async () => {
    const { user } = setup({});

    const selectFilter = screen.getByRole('combobox');
    await user.click(selectFilter);

    expect(screen.getByTestId('multi-select-menu')).toBeInTheDocument();
  });

  it('displays selected values correctly', () => {
    setup({
      values: ['opt1', 'opt3'],
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    expect(within(buttons[0]).getByText('Option 1')).toBeDefined();
    expect(within(buttons[1]).getByText('Option 3')).toBeDefined();
    expect(within(buttons[2]).getByText('Clear all')).toBeDefined();
  });

  it('calls onChangeValues when selected values are modified', async () => {
    const { user, mockOnChangeValues } = setup({
      values: ['opt1', 'opt3'],
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    // Delete Option 1
    await user.click(within(buttons[0]).getByText('Delete'));

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt3']);
  });

  it('calls onChangeValues when Clear All is called', async () => {
    const { user, mockOnChangeValues } = setup({
      values: ['opt1', 'opt3'],
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    await user.click(buttons[2]);

    expect(mockOnChangeValues).toHaveBeenCalledWith([]);
  });

  it('handles empty values array', () => {
    setup({
      values: [],
    });

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Mock Placeholder')).toBeInTheDocument();
  });
});

function setup({
  label = 'Mock Label',
  placeholder = 'Mock Placeholder',
  values = [],
  optionsLabelMap = MOCK_OPTIONS_LABEL_MAP,
}: {
  label?: string;
  placeholder?: string;
  values?: Array<MockOption>;
  optionsLabelMap?: Record<MockOption, string>;
} = {}) {
  const mockOnChangeValues = jest.fn();
  const user = userEvent.setup();

  render(
    <MultiSelectFilter
      label={label}
      placeholder={placeholder}
      values={values}
      onChangeValues={mockOnChangeValues}
      optionsLabelMap={optionsLabelMap}
    />
  );

  return { user, mockOnChangeValues };
}
