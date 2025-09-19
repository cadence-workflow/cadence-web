import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import MultiSelectMenu from '../multi-select-menu';
import { type MultiSelectMenuOption } from '../multi-select-menu.types';

const MOCK_OPTIONS: Array<MultiSelectMenuOption<string>> = [
  { id: 'opt1', label: 'Option 1' },
  { id: 'opt2', label: 'Option 2' },
  { id: 'opt3', label: 'Option 3' },
];

describe(MultiSelectMenu.name, () => {
  it('renders without errors', () => {
    setup({});

    expect(screen.getByText('Select All')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('shows correct initial state with no values selected', () => {
    setup({ values: [] });

    const selectAllCheckbox = screen.getByLabelText('Select All');
    expect(selectAllCheckbox).not.toBeChecked();
    expect(selectAllCheckbox).not.toBePartiallyChecked();

    expect(screen.getByLabelText('Option 1')).not.toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    expect(screen.getByLabelText('Option 3')).not.toBeChecked();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('shows correct initial state with some values selected', () => {
    setup({ values: ['opt1', 'opt3'] });

    const selectAllCheckbox = screen.getByLabelText('Select All');
    expect(selectAllCheckbox).not.toBeChecked();
    expect(selectAllCheckbox).toBePartiallyChecked();

    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    expect(screen.getByLabelText('Option 3')).toBeChecked();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('shows correct initial state with all values selected', () => {
    setup({ values: ['opt1', 'opt2', 'opt3'] });

    const selectAllCheckbox = screen.getByLabelText('Select All');
    expect(selectAllCheckbox).toBeChecked();
    expect(selectAllCheckbox).not.toBePartiallyChecked();

    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).toBeChecked();
    expect(screen.getByLabelText('Option 3')).toBeChecked();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('enables buttons when selecting additional options', async () => {
    const { user } = setup({ values: ['opt1'] });

    await user.click(screen.getByLabelText('Option 2'));

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
  });

  it('enables buttons when deselecting options', async () => {
    const { user } = setup({ values: ['opt1', 'opt2'] });

    await user.click(screen.getByLabelText('Option 1'));

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
  });

  it('selects all options when Select All is clicked', async () => {
    const { user } = setup({ values: [] });

    await user.click(screen.getByLabelText('Select All'));

    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).toBeChecked();
    expect(screen.getByLabelText('Option 3')).toBeChecked();
    expect(screen.getByLabelText('Select All')).toBeChecked();
  });

  it('deselects all options when Select All is clicked and all are selected', async () => {
    const { user } = setup({ values: ['opt1', 'opt2', 'opt3'] });

    await user.click(screen.getByLabelText('Select All'));

    expect(screen.getByLabelText('Option 1')).not.toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    expect(screen.getByLabelText('Option 3')).not.toBeChecked();
    expect(screen.getByLabelText('Select All')).not.toBeChecked();
  });

  it('selects all options when Select All is clicked and some are selected', async () => {
    const { user } = setup({ values: ['opt1', 'opt3'] });

    await user.click(screen.getByLabelText('Select All'));

    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).toBeChecked();
    expect(screen.getByLabelText('Option 3')).toBeChecked();
    expect(screen.getByLabelText('Select All')).toBeChecked();
  });

  it('calls onChangeValues and onCloseMenu when Apply is clicked', async () => {
    const { user, mockOnChangeValues, mockOnCloseMenu } = setup({
      values: ['opt1'],
    });

    await user.click(screen.getByLabelText('Option 2'));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(mockOnChangeValues).toHaveBeenCalledWith(['opt1', 'opt2']);
    expect(mockOnCloseMenu).toHaveBeenCalledTimes(1);
  });

  it('resets temporary state and calls onCloseMenu when Cancel is clicked', async () => {
    const { user, mockOnChangeValues, mockOnCloseMenu } = setup({
      values: ['opt1'],
    });

    await user.click(screen.getByLabelText('Option 2'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockOnChangeValues).not.toHaveBeenCalled();
    expect(mockOnCloseMenu).toHaveBeenCalledTimes(1);

    // Verify state was reset by checking checkboxes
    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
  });

  it('disables buttons when items are modified back to original state', async () => {
    const { user } = setup({ values: ['opt1', 'opt3'] });

    // Initially buttons should be disabled
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();

    // Modify selection - add opt2
    await user.click(screen.getByLabelText('Option 2'));

    // Buttons should now be enabled
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();

    // Modify back to original state - remove opt2
    await user.click(screen.getByLabelText('Option 2'));

    // Buttons should be disabled again
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('updates Select All state correctly when individual options change', async () => {
    const { user } = setup({ values: [] });

    const selectAllCheckbox = screen.getByLabelText('Select All');

    // Initially unchecked
    expect(selectAllCheckbox).not.toBeChecked();
    expect(selectAllCheckbox).not.toBePartiallyChecked();

    // Check one option - should become indeterminate
    await user.click(screen.getByLabelText('Option 1'));
    expect(selectAllCheckbox).not.toBeChecked();
    expect(selectAllCheckbox).toBePartiallyChecked();

    // Check second option - still indeterminate
    await user.click(screen.getByLabelText('Option 2'));
    expect(selectAllCheckbox).not.toBeChecked();
    expect(selectAllCheckbox).toBePartiallyChecked();

    // Check third option - should become fully checked
    await user.click(screen.getByLabelText('Option 3'));
    expect(selectAllCheckbox).toBeChecked();
    expect(selectAllCheckbox).not.toBePartiallyChecked();
  });
});

function setup({
  values = [],
  options = MOCK_OPTIONS,
}: {
  values?: Array<string>;
  options?: Array<MultiSelectMenuOption<string>>;
} = {}) {
  const mockOnChangeValues = jest.fn();
  const mockOnCloseMenu = jest.fn();
  const user = userEvent.setup();

  render(
    <MultiSelectMenu
      values={values}
      options={options}
      onChangeValues={mockOnChangeValues}
      onCloseMenu={mockOnCloseMenu}
    />
  );

  return { user, mockOnChangeValues, mockOnCloseMenu };
}
