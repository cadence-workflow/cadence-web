import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import MultiJsonInput from '../multi-json-input';
import type { Props } from '../multi-json-input.types';

describe('MultiJsonInput', () => {
  const defaultProps = {
    label: 'Test Label',
    placeholder: 'Enter JSON',
    value: [''],
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    setup({});

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter JSON')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders with custom label and placeholder', () => {
    setup({
      label: 'Custom Label',
      placeholder: 'Custom Placeholder',
    });

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Custom Placeholder')
    ).toBeInTheDocument();
  });

  it('renders multiple inputs when value array has multiple items', () => {
    setup({
      value: ['{"key": "value1"}', '{"key": "value2"}'],
    });

    const textareas = screen.getAllByRole('textbox');
    expect(textareas).toHaveLength(2);
    expect(textareas[0]).toHaveValue('{"key": "value1"}');
    expect(textareas[1]).toHaveValue('{"key": "value2"}');
  });

  it('calls onChange when input value changes', async () => {
    const onChange = jest.fn();
    const { user } = setup({ onChange });

    const textarea = screen.getByPlaceholderText('Enter JSON');
    await user.type(textarea, 'test');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(4); // One call per character
  });

  it('enables add button only when all inputs have values', () => {
    setup({
      value: ['{"key": "value1"}', '{"key": "value2"}'],
    });

    const addButton = screen.getByText('Add');
    expect(addButton).not.toBeDisabled();
  });

  it('disables add button when any input is empty', () => {
    setup({
      value: ['{"key": "value1"}', ''],
    });

    const addButton = screen.getByText('Add');
    expect(addButton).toBeDisabled();
  });

  it('adds new input when add button is clicked', async () => {
    const onChange = jest.fn();
    const { user } = setup({
      value: ['{"key": "value"}'],
      onChange,
    });

    const addButton = screen.getByText('Add');
    await user.click(addButton);

    expect(onChange).toHaveBeenCalledWith(['{"key": "value"}', '']);
  });

  it('removes input when delete button is clicked and multiple inputs exist', async () => {
    const onChange = jest.fn();
    const { user } = setup({
      value: ['{"key": "value1"}', '{"key": "value2"}'],
      onChange,
    });

    const deleteButtons = screen.getAllByLabelText('Delete input');
    await user.click(deleteButtons[0]);

    expect(onChange).toHaveBeenCalledWith(['{"key": "value2"}']);
  });

  it('clears input when delete button is clicked and only one input exists', async () => {
    const onChange = jest.fn();
    const { user } = setup({
      value: ['{"key": "value"}'],
      onChange,
    });

    const deleteButton = screen.getByLabelText('Clear input');
    await user.click(deleteButton);

    expect(onChange).toHaveBeenCalledWith(['']);
  });

  it('disables delete button when only one input exists and it is empty', () => {
    setup({});

    const deleteButton = screen.getByLabelText('Clear input');
    expect(deleteButton).toBeDisabled();
  });

  it('enables delete button when only one input exists and it has content', () => {
    const props = {
      ...defaultProps,
      value: ['{"key": "value"}'],
    };

    render(<MultiJsonInput {...props} />);

    const deleteButton = screen.getByLabelText('Clear input');
    expect(deleteButton).not.toBeDisabled();
  });

  it('displays error message when error prop is provided', () => {
    const props = {
      ...defaultProps,
      error: 'Invalid JSON format',
    };

    render(<MultiJsonInput {...props} />);

    expect(screen.getByText('Invalid JSON format')).toBeInTheDocument();
  });

  it('applies error state to textarea when error prop is provided', () => {
    const props = {
      ...defaultProps,
      error: 'Invalid JSON format',
    };

    render(<MultiJsonInput {...props} />);

    const textarea = screen.getByPlaceholderText('Enter JSON');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles empty value array by defaulting to single empty input', () => {
    const props = {
      ...defaultProps,
      value: [],
    };

    render(<MultiJsonInput {...props} />);

    const textareas = screen.getAllByRole('textbox');
    expect(textareas).toHaveLength(1);
    expect(textareas[0]).toHaveValue('');
  });

  it('renders with custom add button text', () => {
    const props = {
      ...defaultProps,
      addButtonText: 'Add argument',
    };

    render(<MultiJsonInput {...props} />);

    expect(screen.getByText('Add argument')).toBeInTheDocument();
  });

  it('maintains input order when deleting inputs', async () => {
    const onChange = jest.fn();
    const { user } = setup({
      value: ['input1', 'input2', 'input3'],
      onChange,
    });

    const deleteButtons = screen.getAllByLabelText('Delete input');
    await user.click(deleteButtons[1]); // Delete middle input

    expect(onChange).toHaveBeenCalledWith(['input1', 'input3']);
  });
});

const setup = ({
  label = 'Test Label',
  placeholder = 'Enter JSON',
  value = [''],
  onChange = jest.fn(),
  error,
  addButtonText,
}: Partial<Props>) => {
  const user = userEvent.setup();
  const result = render(
    <MultiJsonInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      addButtonText={addButtonText}
    />
  );
  return { ...result, user };
};
