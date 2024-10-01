import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import WorkflowHistoryFiltersType from '../workflow-history-filters-type';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_OPTIONS } from '../workflow-history-filters-type.constants';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-type.types';

describe('WorkflowHistoryFiltersType', () => {
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
    WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_OPTIONS.forEach(({ label }) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );
  });

  it('calls the setQueryParams function when an option is selected', () => {
    const { mockSetValue } = setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    const decisionOption = screen.getByText('Decision');
    act(() => {
      fireEvent.click(decisionOption);
    });
    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventType: 'DECISION',
    });
  });

  it('calls the setQueryParams function when the filter is cleared', () => {
    const { mockSetValue } = setup({
      overrides: {
        historyEventType: 'ACTIVITY',
      },
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith({ historyEventType: undefined });
  });
});

function setup({ overrides }: { overrides?: WorkflowHistoryFiltersTypeValue }) {
  const mockSetValue = jest.fn();
  render(
    <WorkflowHistoryFiltersType
      value={{
        historyEventType: undefined,
        ...overrides,
      }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
