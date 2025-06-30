import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import * as useQueryTextWithAutocompleteModule from '../hooks/use-query-text-with-autocomplete';
import WorkflowsQueryInput from '../workflows-query-input';

jest.mock('../hooks/use-query-text-with-autocomplete', () =>
  jest.fn(() => ({
    queryText: '',
    setQueryText: jest.fn(),
    nextSuggestions: [],
    onSuggestionSelect: jest.fn(),
  }))
);

describe(WorkflowsQueryInput.name, () => {
  it('renders as expected', async () => {
    setup({});

    expect(await screen.findByRole('combobox')).toBeInTheDocument();
    expect(await screen.findByText('Run Query')).toBeInTheDocument();
  });

  it('renders as expected when loaded with a start value', async () => {
    setup({
      startValue: 'test_query',
      hookReturn: {
        queryText: 'test_query',
        setQueryText: jest.fn(),
        nextSuggestions: [],
        onSuggestionSelect: jest.fn(),
      },
    });

    const combobox = await screen.findByRole('combobox');

    expect(
      await within(combobox).findByDisplayValue('test_query')
    ).toBeInTheDocument();
    expect(await screen.findByText('Rerun Query')).toBeInTheDocument();
  });

  it('renders in loading state when query is running', async () => {
    setup({ isQueryRunning: true });

    expect(
      await screen.findByLabelText('loading Run Query')
    ).toBeInTheDocument();
  });

  it('calls setValue with queryText when the Run Query button is clicked', async () => {
    const { mockSetValue, user } = setup({
      hookReturn: {
        queryText: 'mock_query',
        setQueryText: jest.fn(),
        nextSuggestions: [],
        onSuggestionSelect: jest.fn(),
      },
    });

    await user.click(await screen.findByText('Run Query'));

    expect(mockSetValue).toHaveBeenCalledWith('mock_query');
  });

  it('calls setValue when Enter is pressed in the combobox', async () => {
    const { mockSetValue, user } = setup({
      hookReturn: {
        queryText: 'mock_query',
        setQueryText: jest.fn(),
        nextSuggestions: [],
        onSuggestionSelect: jest.fn(),
      },
    });

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);
    await user.keyboard('{Enter}');

    expect(mockSetValue).toHaveBeenCalledWith('mock_query');
  });

  it('calls refetchQuery when the Rerun Query button is clicked and query is unchanged', async () => {
    const { mockRefetch, user } = setup({
      startValue: 'test_query',
      hookReturn: {
        queryText: 'test_query',
        setQueryText: jest.fn(),
        nextSuggestions: [],
        onSuggestionSelect: jest.fn(),
      },
    });

    await user.click(await screen.findByText('Rerun Query'));

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('calls setQueryText when combobox value changes', async () => {
    const mockSetQueryText = jest.fn();
    const { user } = setup({
      hookReturn: {
        queryText: '',
        setQueryText: mockSetQueryText,
        nextSuggestions: [],
        onSuggestionSelect: jest.fn(),
      },
    });

    const combobox = await screen.findByRole('combobox');
    await user.type(combobox, 'new query');

    // Note: The exact number of calls depends on the typing implementation
    expect(mockSetQueryText).toHaveBeenCalled();
  });

  it('renders suggestions when available', async () => {
    const { user } = setup({
      hookReturn: {
        queryText: 'WorkflowType',
        setQueryText: jest.fn(),
        nextSuggestions: ['WorkflowType = "example"', 'WorkflowType != "test"'],
        onSuggestionSelect: jest.fn(),
      },
    });

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);

    // Suggestions should be available in the dropdown
    expect(
      await screen.findByText('WorkflowType = "example"')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('WorkflowType != "test"')
    ).toBeInTheDocument();
  });

  it('calls onSuggestionSelect when a suggestion is clicked', async () => {
    const mockOnSuggestionSelect = jest.fn();
    const { user } = setup({
      hookReturn: {
        queryText: 'WorkflowType',
        setQueryText: jest.fn(),
        nextSuggestions: ['WorkflowType = "example"', 'WorkflowType != "test"'],
        onSuggestionSelect: mockOnSuggestionSelect,
      },
    });

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);

    const suggestion = await screen.findByText('WorkflowType = "example"');
    await user.click(suggestion);

    expect(mockOnSuggestionSelect).toHaveBeenCalledWith(
      'WorkflowType = "example"'
    );
  });

  it('shows "Run Query" when query text differs from current value', async () => {
    setup({
      startValue: 'original_query',
      hookReturn: {
        queryText: 'modified_query',
        setQueryText: jest.fn(),
        nextSuggestions: [],
        onSuggestionSelect: jest.fn(),
      },
    });

    expect(await screen.findByText('Run Query')).toBeInTheDocument();
    expect(screen.queryByText('Rerun Query')).not.toBeInTheDocument();
  });

  it('shows "Rerun Query" when query text matches current value', async () => {
    setup({
      startValue: 'same_query',
      hookReturn: {
        queryText: 'same_query',
        setQueryText: jest.fn(),
        nextSuggestions: [],
        onSuggestionSelect: jest.fn(),
      },
    });

    expect(await screen.findByText('Rerun Query')).toBeInTheDocument();
    expect(screen.queryByText('Run Query')).not.toBeInTheDocument();
  });
});

function setup({
  startValue,
  isQueryRunning,
  hookReturn,
}: {
  startValue?: string;
  isQueryRunning?: boolean;
  hookReturn?: ReturnType<typeof useQueryTextWithAutocompleteModule.default>;
}) {
  const mockSetValue = jest.fn();
  const mockRefetch = jest.fn();
  const user = userEvent.setup();

  if (hookReturn) {
    jest
      .spyOn(useQueryTextWithAutocompleteModule, 'default')
      .mockReturnValue(hookReturn);
  }

  const renderResult = render(
    <WorkflowsQueryInput
      value={startValue ?? ''}
      setValue={mockSetValue}
      refetchQuery={mockRefetch}
      isQueryRunning={isQueryRunning ?? false}
    />
  );

  return { mockSetValue, mockRefetch, user, ...renderResult };
}
