import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';

import SearchAttributesInput from '../workflow-actions-search-attributes';
import type {
  Props,
  SearchAttributeOption,
} from '../workflow-actions-search-attributes.types';

const mockSearchAttributes: Array<SearchAttributeOption> = [
  {
    name: 'WorkflowType',
    valueType: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
  },
  {
    name: 'StartTime',
    valueType: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
  },
  {
    name: 'CustomBoolField',
    valueType: IndexedValueType.INDEXED_VALUE_TYPE_BOOL,
  },
  {
    name: 'CustomNumberField',
    valueType: IndexedValueType.INDEXED_VALUE_TYPE_DOUBLE,
  },
];

describe(SearchAttributesInput.name, () => {
  it('should render with default empty state', () => {
    setup();

    const keySelects = screen.getAllByRole('combobox', {
      name: 'Search attribute key',
    });
    expect(keySelects).toHaveLength(1);
    expect(keySelects[0]).toHaveValue('');

    const valueInputs = screen.getAllByRole('textbox', {
      name: 'Search attribute value',
    });
    expect(valueInputs).toHaveLength(1);
    expect(valueInputs[0]).toHaveValue('');

    expect(screen.getByText('Add search attribute')).toBeInTheDocument();
  });

  it('should render existing values', () => {
    setup({
      value: [
        { key: 'WorkflowType', value: 'MyWorkflow' },
        { key: 'StartTime', value: '2023-01-01T00:00:00Z' },
      ],
    });

    const allComboboxes = screen.getAllByRole('combobox');
    expect(allComboboxes).toHaveLength(2);

    expect(screen.getByDisplayValue('MyWorkflow')).toBeInTheDocument();

    expect(screen.getByDisplayValue('2023–01–01 00:00:00')).toBeInTheDocument();
  });

  it('should allow selecting an attribute key', async () => {
    const { user, mockOnChange } = setup();

    await user.click(
      screen.getByRole('combobox', { name: 'Search attribute key' })
    );

    await user.click(screen.getByText('WorkflowType'));

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: 'WorkflowType', value: '' },
    ]);
  });

  it('should update input type based on selected attribute type', () => {
    setup({
      value: [
        { key: 'WorkflowType', value: '' },
        { key: 'StartTime', value: '' },
        { key: 'CustomBoolField', value: '' },
        { key: 'CustomNumberField', value: '' },
      ],
    });

    const stringInput = screen.getByPlaceholderText('Enter value');
    expect(stringInput).toHaveAttribute('type', 'text');

    expect(screen.getByText('Select value')).toBeInTheDocument();

    const numberInput = screen.getByPlaceholderText('Enter number');
    expect(numberInput).toHaveAttribute('type', 'number');

    expect(
      screen.getByPlaceholderText('Select date and time')
    ).toBeInTheDocument();
  });

  it('should allow entering values', async () => {
    const { user, mockOnChange } = setup({
      value: [{ key: 'WorkflowType', value: '' }],
    });

    const valueInput = screen.getByRole('textbox', {
      name: 'Search attribute value',
    });
    await user.clear(valueInput);
    await user.type(valueInput, 'MyWorkflow');

    // Check that onChange was called (it will be called for each character)
    expect(mockOnChange).toHaveBeenCalled();
    // Verify that the last call included the key we expect
    const calls = mockOnChange.mock.calls;
    expect(calls[calls.length - 1][0][0].key).toBe('WorkflowType');
    expect(calls.length).toBeGreaterThan(0);
  });

  it('should disable value input when no key is selected', () => {
    setup();

    const valueInput = screen.getByRole('textbox', {
      name: 'Search attribute value',
    });
    expect(valueInput).toBeDisabled();
  });

  it('should render boolean input as dropdown', async () => {
    const { user } = setup({
      value: [{ key: 'CustomBoolField', value: '' }],
    });

    const booleanSelect = screen.getByText('Select value');
    expect(booleanSelect).toBeInTheDocument();

    // Click on the dropdown
    await user.click(booleanSelect);

    // Should see TRUE/FALSE options
    expect(screen.getByText('TRUE')).toBeInTheDocument();
    expect(screen.getByText('FALSE')).toBeInTheDocument();
  });

  it('should render timestamp input as date picker', () => {
    setup({
      value: [{ key: 'StartTime', value: '' }],
    });

    // DatePicker should be present (check for the placeholder text it uses)
    expect(
      screen.getByPlaceholderText('Select date and time')
    ).toBeInTheDocument();
  });

  it('should reset value when key changes', async () => {
    const { user, mockOnChange } = setup({
      value: [{ key: 'WorkflowType', value: 'ExistingValue' }],
    });

    // Change the key by clicking on the combobox and selecting a different option
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('StartTime'));

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: 'StartTime', value: '' },
    ]);
  });

  it('should add new attribute when add button is clicked', async () => {
    const { user, mockOnChange } = setup({
      value: [{ key: 'WorkflowType', value: 'MyWorkflow' }],
    });

    await user.click(screen.getByText('Add search attribute'));

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: 'WorkflowType', value: 'MyWorkflow' },
      { key: '', value: '' },
    ]);
  });

  it('should disable add button when current attributes are incomplete', () => {
    setup({
      value: [{ key: 'WorkflowType', value: '' }],
    });

    expect(screen.getByText('Add search attribute')).toBeDisabled();
  });

  it('should delete attribute when delete button is clicked', async () => {
    const { user, mockOnChange } = setup({
      value: [
        { key: 'WorkflowType', value: 'MyWorkflow' },
        { key: 'StartTime', value: '2023-01-01T00:00:00Z' },
      ],
    });

    const deleteButtons = screen.getAllByLabelText('Delete attribute');
    await user.click(deleteButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: 'StartTime', value: '2023-01-01T00:00:00Z' },
    ]);
  });

  it('should clear attribute when delete button is clicked on single empty attribute', async () => {
    const { user, mockOnChange } = setup({
      value: [{ key: 'WorkflowType', value: 'SomeValue' }],
    });

    const deleteButton = screen.getByLabelText('Clear attribute');
    await user.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('should disable delete button when only empty attribute exists', () => {
    setup();

    expect(screen.getByLabelText('Delete attribute')).toBeDisabled();
  });

  it('should display global error state on fields', () => {
    setup({
      error: 'Global error message',
    });

    // Global errors apply error state to all fields (aria-invalid="true")
    const valueInput = screen.getByRole('textbox', {
      name: 'Search attribute value',
    });

    expect(valueInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should display field-specific error state', () => {
    setup({
      value: [
        { key: 'WorkflowType', value: 'test' },
        { key: 'StartTime', value: '' },
      ],
      error: [
        undefined, // First field has no error
        {
          value: 'Value is required',
        },
      ],
    });

    const allValueInputs = screen.getAllByRole('textbox', {
      name: 'Search attribute value',
    });

    expect(allValueInputs[0]).toHaveAttribute('aria-invalid', 'false');
    expect(allValueInputs[1]).toHaveAttribute('aria-invalid', 'true');
  });

  it('should be searchable in the key select dropdown', async () => {
    const { user } = setup();

    const keySelect = screen.getByRole('combobox', {
      name: 'Search attribute key',
    });
    await user.click(keySelect);
    await user.type(keySelect, 'Work');

    expect(screen.getByText('WorkflowType')).toBeInTheDocument();
  });

  it('should filter out already selected attributes from suggestions', async () => {
    const { user } = setup({
      value: [
        { key: 'WorkflowType', value: 'MyWorkflow' },
        { key: 'StartTime', value: '2023-01-01T00:00:00Z' },
        { key: '', value: '' }, // Empty row
      ],
    });

    // Get the last (empty) key select and click it to open dropdown
    const allKeySelects = screen.getAllByRole('combobox', {
      name: /Search attribute key/i,
    });
    const emptyKeySelect = allKeySelects[allKeySelects.length - 1];
    await user.click(emptyKeySelect);

    // Wait for dropdown to open and get all options
    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    // Get all options in the dropdown
    const options = screen.getAllByRole('option');
    const optionTexts = options.map((opt) => opt.textContent);

    // The empty row should show only unselected attributes
    // (filtering out 'WorkflowType' and 'StartTime' which are already selected)
    expect(optionTexts).not.toContain('WorkflowType');
    expect(optionTexts).not.toContain('StartTime');
    expect(optionTexts).toContain('CustomBoolField');
    expect(optionTexts).toContain('CustomNumberField');
    expect(options).toHaveLength(2); // Only 2 unselected attributes
  });

  it('should disable add button when all attributes are selected', () => {
    setup({
      value: [
        { key: 'WorkflowType', value: 'MyWorkflow' },
        { key: 'StartTime', value: '2023-01-01T00:00:00Z' },
        { key: 'CustomBoolField', value: 'TRUE' },
        { key: 'CustomNumberField', value: '123' },
      ],
    });

    // Add button should be disabled since all 4 available attributes are selected
    expect(screen.getByText('Add search attribute')).toBeDisabled();
  });

  it('should enable add button when not all attributes are selected and current fields are complete', () => {
    setup({
      value: [
        { key: 'WorkflowType', value: 'MyWorkflow' },
        { key: 'StartTime', value: '2023-01-01T00:00:00Z' },
      ],
    });

    // Add button should be enabled since only 2 out of 4 available attributes are selected
    expect(screen.getByText('Add search attribute')).not.toBeDisabled();
  });
});

function setup(props: Partial<Props> = {}) {
  const mockOnChange = jest.fn();
  const user = userEvent.setup();

  const defaultProps: Props = {
    onChange: mockOnChange,
    searchAttributes: mockSearchAttributes,
    ...props,
  };

  render(<SearchAttributesInput {...defaultProps} />);

  return {
    user,
    mockOnChange,
  };
}
