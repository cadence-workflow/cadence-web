import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import WorkflowsQueryInput from '../workflows-query-input';

describe(WorkflowsQueryInput.name, () => {
  it('renders as expected', async () => {
    setup({});

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    expect(await screen.findByText('Run Query')).toBeInTheDocument();
  });

  it('renders as expected when loaded with a start value', async () => {
    setup({ startValue: 'test_query' });

    const textbox = await screen.findByRole('textbox');
    await waitFor(() => expect(textbox).toHaveValue('test_query'));
    expect(await screen.findByText('Rerun Query')).toBeInTheDocument();
  });

  it('renders in loading state when query is running', async () => {
    setup({ isQueryRunning: true });

    expect(
      await screen.findByText('Running...')
    ).toBeInTheDocument();
  });

  it('calls setValue and changes text when the Run Query button is clicked', async () => {
    const { mockSetValue, user } = setup({});

    const textbox = await screen.findByRole('textbox');
    await user.type(textbox, 'mock_query');
    await user.click(await screen.findByText('Run Query'));

    expect(mockSetValue).toHaveBeenCalledWith('mock_query');
  });

  it('calls setValue and changes text when Enter is pressed', async () => {
    const { mockSetValue, user } = setup({});

    const textbox = await screen.findByRole('textbox');
    await user.type(textbox, 'mock_query');
    await user.keyboard('{Enter}');

    expect(mockSetValue).toHaveBeenCalledWith('mock_query');
  });

  it('calls refetchQuery when the Rerun Query button is clicked', async () => {
    const { mockRefetch, user } = setup({ startValue: 'test_query' });

    await user.click(await screen.findByText('Rerun Query'));

    expect(mockRefetch).toHaveBeenCalled();
  });
});

describe('WorkflowsQueryInput Autocomplete', () => {
  it('shows suggestions when typing a known attribute', async () => {
    setup({});

    const textbox = await screen.findByRole('textbox');
    await userEvent.type(textbox, 'Cl'); // e.g., "CloseStatus" is a suggestion

    // Wait for the suggestion to appear
    expect(await screen.findByText('CloseStatus')).toBeInTheDocument();
  });

  it('updates input when a suggestion is clicked', async () => {
    setup({});

    const textbox = await screen.findByRole('textbox');
    await userEvent.type(textbox, 'Cl');

    const suggestion = await screen.findByText('CloseStatus');
    await userEvent.click(suggestion);

    // The input should now contain the suggestion
    expect(textbox).toHaveValue(expect.stringContaining('CloseStatus'));
  });

  it('shows no suggestions for unknown input', async () => {
    setup({});

    const textbox = await screen.findByRole('textbox');
    await userEvent.type(textbox, 'zzzzzz');

    // Wait a bit for suggestions to update
    await waitFor(() => {
      expect(screen.queryByText('CloseStatus')).not.toBeInTheDocument();
    });
  });
});

function setup({
  startValue,
  isQueryRunning,
}: {
  startValue?: string;
  isQueryRunning?: boolean;
}) {
  const mockSetValue = jest.fn();
  const mockRefetch = jest.fn();
  const user = userEvent.setup();
  render(
    <WorkflowsQueryInput
      value={startValue ?? ''}
      setValue={mockSetValue}
      refetchQuery={mockRefetch}
      isQueryRunning={isQueryRunning ?? false}
    />
  );

  return { mockSetValue, mockRefetch, user };
}
