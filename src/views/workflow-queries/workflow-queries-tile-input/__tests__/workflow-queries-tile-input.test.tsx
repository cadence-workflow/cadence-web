import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import WorkflowQueriesTileInput from '../workflow-queries-tile-input';

describe(WorkflowQueriesTileInput.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<WorkflowQueriesTileInput value="" onChange={jest.fn()} />);

    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });

  it('renders correctly with a non-empty value', () => {
    render(
      <WorkflowQueriesTileInput value="test value" onChange={jest.fn()} />
    );

    const textbox = screen.getByRole('textbox');
    expect(textbox).toHaveTextContent('test value');
  });

  it('calls onChange when typed into', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(<WorkflowQueriesTileInput value="" onChange={mockOnChange} />);

    await user.type(screen.getByRole('textbox'), 'a');

    expect(mockOnChange).toHaveBeenCalledWith('a');
  });
});
