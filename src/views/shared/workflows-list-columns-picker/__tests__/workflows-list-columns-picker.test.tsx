import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import WorkflowsListColumnsPicker from '../workflows-list-columns-picker';
import { type ColumnDefinition } from '../workflows-list-columns-picker.types';

jest.mock('baseui/popover', () => ({
  Popover: jest.fn(({ isOpen, content, children, onClickOutside }) => (
    <>
      {children}
      {isOpen && (
        <>
          <div data-testid="popover-content">
            {typeof content === 'function' ? content() : content}
          </div>
          <button data-testid="click-outside-btn" onClick={onClickOutside}>
            Click Outside
          </button>
        </>
      )}
    </>
  )),
}));

const MOCK_ALL_COLUMNS: ColumnDefinition[] = [
  { id: 'col-1', name: 'Workflow ID', isSystem: true },
  { id: 'col-2', name: 'Status', isSystem: true },
  { id: 'col-3', name: 'Start Time', isSystem: false },
  { id: 'col-4', name: 'End Time', isSystem: false },
];

describe(WorkflowsListColumnsPicker.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Columns button', () => {
    setup({});

    expect(screen.getByText('Columns')).toBeInTheDocument();
  });

  it('opens the popover when the Columns button is clicked', async () => {
    const { user } = setup({});

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

    await user.click(screen.getByText('Columns'));

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('shows all columns in the popover', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('Columns'));

    expect(screen.getByText('Workflow ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('*Start Time')).toBeInTheDocument();
    expect(screen.getByText('*End Time')).toBeInTheDocument();
  });

  it('shows selected columns as checked and unselected as unchecked', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('Columns'));

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
  });

  it('shows selected columns before unselected columns', async () => {
    const { user } = setup({
      selectedColumnIds: ['col-3', 'col-1'],
    });

    await user.click(screen.getByText('Columns'));

    const popoverText = screen.getByTestId('popover-content').textContent ?? '';
    const positions = [
      popoverText.indexOf('Start Time'),
      popoverText.indexOf('Workflow ID'),
      popoverText.indexOf('Status'),
      popoverText.indexOf('End Time'),
    ];
    expect(positions[0]).toBeLessThan(positions[1]);
    expect(positions[1]).toBeLessThan(positions[2]);
    expect(positions[2]).toBeLessThan(positions[3]);
  });

  it('filters columns by search query', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('Columns'));

    await user.type(
      screen.getByPlaceholderText('Find Search Attribute'),
      'Start'
    );

    expect(screen.getByText('*Start Time')).toBeInTheDocument();
    expect(screen.queryByText('Workflow ID')).not.toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.queryByText('*End Time')).not.toBeInTheDocument();
  });

  it('toggles column checked state when checkbox is clicked', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('Columns'));

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[2]).not.toBeChecked();

    await user.click(checkboxes[2]);

    const updatedCheckboxes = screen.getAllByRole('checkbox');
    expect(updatedCheckboxes[2]).toBeChecked();
  });

  it('calls onApply with checked column IDs in order and closes the popover', async () => {
    const mockOnApply = jest.fn();
    const { user } = setup({ onApply: mockOnApply });

    await user.click(screen.getByText('Columns'));
    await user.click(screen.getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(['col-1', 'col-2']);
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('calls onReset and closes the popover when Reset is clicked', async () => {
    const mockOnReset = jest.fn();
    const { user } = setup({ onReset: mockOnReset });

    await user.click(screen.getByText('Columns'));
    await user.click(screen.getByText('Reset'));

    expect(mockOnReset).toHaveBeenCalled();
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('disables the Apply button when no columns are checked', async () => {
    const { user } = setup({
      selectedColumnIds: ['col-1'],
    });

    await user.click(screen.getByText('Columns'));

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('closes the popover when clicking outside', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('Columns'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    await user.click(screen.getByTestId('click-outside-btn'));
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('closes the popover when the Columns button is clicked again', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('Columns'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    await user.click(screen.getByText('Columns'));
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('includes newly checked columns in onApply', async () => {
    const mockOnApply = jest.fn();
    const { user } = setup({ onApply: mockOnApply });

    await user.click(screen.getByText('Columns'));

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[2]);

    await user.click(screen.getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(['col-1', 'col-2', 'col-3']);
  });

  it('excludes unchecked columns from onApply', async () => {
    const mockOnApply = jest.fn();
    const { user } = setup({ onApply: mockOnApply });

    await user.click(screen.getByText('Columns'));

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    await user.click(screen.getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(['col-1']);
  });

  it('resets search query when reopening the popover', async () => {
    const { user } = setup({});

    await user.click(screen.getByText('Columns'));
    await user.type(
      screen.getByPlaceholderText('Find Search Attribute'),
      'Start'
    );

    await user.click(screen.getByText('Columns'));
    await user.click(screen.getByText('Columns'));

    expect(screen.getByPlaceholderText('Find Search Attribute')).toHaveValue(
      ''
    );
  });
});

function setup({
  allColumns = MOCK_ALL_COLUMNS,
  selectedColumnIds = ['col-1', 'col-2'],
  onApply = jest.fn(),
  onReset = jest.fn(),
}: Partial<React.ComponentProps<typeof WorkflowsListColumnsPicker>> = {}) {
  const user = userEvent.setup();

  render(
    <WorkflowsListColumnsPicker
      allColumns={allColumns}
      selectedColumnIds={selectedColumnIds}
      onApply={onApply}
      onReset={onReset}
    />
  );

  return { user };
}
