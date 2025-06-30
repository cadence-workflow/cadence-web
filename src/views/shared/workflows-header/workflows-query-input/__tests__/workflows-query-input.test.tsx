import React from 'react';

import { fireEvent } from '@testing-library/react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import WorkflowsQueryInput from '../workflows-query-input';

beforeAll(() => {
  // Prevent errors if input.focus is called on undefined in jsdom
  HTMLElement.prototype.focus = function () {};
});

function Wrapper({
  startValue = '',
  isQueryRunning = false,
  onSetValue,
  onRefetchQuery,
}: {
  startValue?: string;
  isQueryRunning?: boolean;
  onSetValue?: (v: string | undefined) => void;
  onRefetchQuery?: () => void;
}) {
  const [value, setValue] = React.useState(startValue);
  return (
    <WorkflowsQueryInput
      value={value}
      setValue={(v) => {
        setValue(v ?? '');
        onSetValue?.(v);
      }}
      refetchQuery={onRefetchQuery ?? (() => {})}
      isQueryRunning={isQueryRunning}
    />
  );
}

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
      await screen.findByRole('button', { name: /loading run query/i })
    ).toBeInTheDocument();
  });

  // TODO @adhitya.mamallan: These tests cannot be reliably run in jsdom/RTL due to incompatibility between BaseWeb Input/react-autosuggest and the controlled input pattern.
  it.skip('calls setValue and changes text when the Run Query button is clicked', async () => {
    const mockSetValue = jest.fn();
    render(<Wrapper onSetValue={mockSetValue} />);
    const textbox = await screen.findByRole('textbox');
    textbox.focus();
    await userEvent.type(textbox, 'mock_query');
    (textbox as HTMLInputElement).value = 'mock_query';
    fireEvent.change(textbox, { target: { value: 'mock_query' } });
    await userEvent.click(await screen.findByText('Run Query'));
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('mock_query');
    });
  });

  // TODO @adhitya.mamallan: These tests cannot be reliably run in jsdom/RTL due to incompatibility between BaseWeb Input/react-autosuggest and the controlled input pattern.
  it.skip('calls setValue and changes text when Enter is pressed', async () => {
    const mockSetValue = jest.fn();
    render(<Wrapper onSetValue={mockSetValue} />);
    const textbox = await screen.findByRole('textbox');
    textbox.focus();
    await userEvent.type(textbox, 'mock_query');
    (textbox as HTMLInputElement).value = 'mock_query';
    fireEvent.change(textbox, { target: { value: 'mock_query' } });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('mock_query');
    });
  });

  it('calls refetchQuery when the Rerun Query button is clicked', async () => {
    const { mockRefetch, user } = setup({ startValue: 'test_query' });

    await user.click(await screen.findByText('Rerun Query'));

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('calls input onChange and updates queryText', async () => {
    setup({});
    const textbox = await screen.findByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'new_query' } });
    expect(textbox).toHaveValue('new_query');
  });

  it('shows "Rerun Query" when query is unchanged and "Run Query" otherwise', async () => {
    setup({ startValue: 'foo' });
    const textbox = await screen.findByRole('textbox');
    // Should show Rerun Query when value matches queryText
    expect(await screen.findByText('Rerun Query')).toBeInTheDocument();
    // Change the value
    fireEvent.change(textbox, { target: { value: 'bar' } });
    expect(await screen.findByText('Run Query')).toBeInTheDocument();
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
