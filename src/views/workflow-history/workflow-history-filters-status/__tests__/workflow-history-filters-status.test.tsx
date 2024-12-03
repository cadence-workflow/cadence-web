import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import WorkflowHistoryFiltersType from '../workflow-history-filters-status';
import { WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_LABELS_MAP } from '../workflow-history-filters-status.constants';
import { type WorkflowHistoryFiltersStatusValue } from '../workflow-history-filters-status.types';

describe('WorkflowHistoryFiltersStatus', () => {
  it('renders without errors', () => {
    setup({});
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays all the options in the select component', () => {
    setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });

    Object.entries(WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_LABELS_MAP).forEach(
      ([_, label]) => expect(screen.getByText(label)).toBeInTheDocument()
    );
  });

  it('calls the setQueryParams function when an option is selected', () => {
    const { mockSetValue } = setup({});
    const selectFilter = screen.getByRole('combobox');

    act(() => {
      fireEvent.click(selectFilter);
    });
    const completedOption = screen.getByText('Completed');
    act(() => {
      fireEvent.click(completedOption);
    });
    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventStatuses: ['COMPLETED'],
    } as WorkflowHistoryFiltersStatusValue);
  });

  it('calls the setQueryParams function when the filter is cleared', () => {
    const { mockSetValue } = setup({
      overrides: {
        historyEventStatuses: ['COMPLETED'],
      },
    });
    const clearButton = screen.getByLabelText('Clear all');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventStatuses: undefined,
    });
  });
});

function setup({
  overrides,
}: {
  overrides?: WorkflowHistoryFiltersStatusValue;
}) {
  const mockSetValue = jest.fn();
  render(
    <WorkflowHistoryFiltersType
      value={{
        historyEventStatuses: undefined,
        ...overrides,
      }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
