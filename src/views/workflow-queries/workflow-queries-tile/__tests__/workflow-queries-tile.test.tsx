import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import WorkflowQueriesTile from '../workflow-queries-tile';
import { type WorkflowQueryStatus } from '../workflow-queries-tile.types';

jest.mock('../../workflow-queries-tile-input/workflow-queries-tile-input', () =>
  jest.fn(() => <div>Mock input</div>)
);

describe(WorkflowQueriesTile.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    setup({});

    expect(screen.getByText('mock-query')).toBeInTheDocument();
  });

  it('renders correctly when an input is present', () => {
    setup({ input: 'test input' });

    expect(screen.getByText('Mock input')).toBeInTheDocument();
  });

  it('disables run button when query status is fetching', () => {
    setup({ status: 'fetching' });

    expect(screen.getByText('Run')).toBeDisabled();
  });

  it('calls onSelect when clicked', async () => {
    const { user, mockOnClick } = setup({});

    await user.click(screen.getByText('mock-query'));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('calls onChangeInput with empty string when input is absent and the button is clicked', async () => {
    const { user, mockOnChangeInput } = setup({});

    expect(screen.queryByText('Mock input')).toBeNull();

    await user.click(screen.getByText('Add input'));

    expect(mockOnChangeInput).toHaveBeenCalledWith('');
  });

  it('calls onChangeInput with undefined when input is present and the button is clicked', async () => {
    const { user, mockOnChangeInput } = setup({ input: 'test input' });

    expect(screen.getByText('Mock input')).toBeInTheDocument();

    await user.click(screen.getByText('Remove input'));

    expect(mockOnChangeInput).toHaveBeenCalledWith(undefined);
  });

  it('calls runQuery when the Run button is clicked', async () => {
    const { user, mockRunQuery } = setup({});

    await user.click(screen.getByText('Run'));

    expect(mockRunQuery).toHaveBeenCalled();
  });
});

function setup({
  input = undefined,
  isSelected = false,
  status = 'success',
}: {
  input?: string | undefined;
  isSelected?: boolean;
  status?: WorkflowQueryStatus;
}) {
  const user = userEvent.setup();
  const mockOnChangeInput = jest.fn();
  const mockOnClick = jest.fn();
  const mockRunQuery = jest.fn();

  render(
    <WorkflowQueriesTile
      name="mock-query"
      input={input}
      onChangeInput={mockOnChangeInput}
      isSelected={isSelected}
      onClick={mockOnClick}
      runQuery={mockRunQuery}
      queryStatus={status}
    />
  );

  return {
    user,
    mockOnChangeInput,
    mockOnClick,
    mockRunQuery,
  };
}
