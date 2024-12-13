import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import DomainWorkflowsQueryInput from '../workflows-query-input';

describe(DomainWorkflowsQueryInput.name, () => {
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
      await screen.findByLabelText('loading Run Query')
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
    <DomainWorkflowsQueryInput
      value={startValue ?? ''}
      setValue={mockSetValue}
      refetchQuery={mockRefetch}
      isQueryRunning={isQueryRunning ?? false}
    />
  );

  return { mockSetValue, mockRefetch, user };
}
