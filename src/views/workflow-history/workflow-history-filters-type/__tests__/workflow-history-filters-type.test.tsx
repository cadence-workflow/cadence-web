import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import * as useHistoryEventTypesPreferenceModule from '@/views/workflow-history/hooks/use-history-event-types-preference';

import WorkflowHistoryFiltersType from '../workflow-history-filters-type';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP } from '../workflow-history-filters-type.constants';
import {
  type WorkflowHistoryFiltersTypeValue,
  type WorkflowHistoryEventFilteringType,
} from '../workflow-history-filters-type.types';

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

    Object.entries(WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP).forEach(
      ([_, label]) => expect(screen.getByText(label)).toBeInTheDocument()
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
      historyEventTypes: ['DECISION'],
    });
  });

  it('calls the setQueryParams function when the filter is cleared', () => {
    const { mockSetValue } = setup({
      overrides: {
        historyEventTypes: ['ACTIVITY'],
      },
    });
    const clearButton = screen.getByLabelText('Clear all');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith({ historyEventTypes: undefined });
  });

  it('should override preference when query param is set', () => {
    const mockGetEventTypesPreference = jest.fn(
      () => ['ACTIVITY', 'DECISION'] as WorkflowHistoryEventFilteringType[]
    );
    const mockSetEventTypesPreference = jest.fn();

    const useHistoryEventTypesPreferenceSpy = jest
      .spyOn(useHistoryEventTypesPreferenceModule, 'default')
      .mockReturnValue({
        getValue: mockGetEventTypesPreference,
        setValue: mockSetEventTypesPreference,
        clearValue: jest.fn(),
      });

    setup({
      overrides: {
        historyEventTypes: ['TIMER', 'SIGNAL'], // Query param value
      },
    });

    // The component should use the query param values instead of preferences
    // We can verify this by checking that the selected values are from query params
    const selectedValues = screen.getByRole('combobox').textContent;
    expect(selectedValues).toContain('Timer');
    expect(selectedValues).toContain('Signal');

    useHistoryEventTypesPreferenceSpy.mockRestore();
  });

  it('should use preference when query param is undefined', () => {
    const mockGetEventTypesPreference = jest.fn(
      () => ['TIMER', 'SIGNAL'] as WorkflowHistoryEventFilteringType[]
    );
    const mockSetEventTypesPreference = jest.fn();

    const useHistoryEventTypesPreferenceSpy = jest
      .spyOn(useHistoryEventTypesPreferenceModule, 'default')
      .mockReturnValue({
        getValue: mockGetEventTypesPreference,
        setValue: mockSetEventTypesPreference,
        clearValue: jest.fn(),
      });

    setup({
      overrides: {
        historyEventTypes: undefined, // No query param
      },
    });

    // Should use preference when query param is undefined
    const selectedValues = screen.getByRole('combobox').textContent;
    expect(selectedValues).toContain('Timer');
    expect(selectedValues).toContain('Signal');

    useHistoryEventTypesPreferenceSpy.mockRestore();
  });

  it('should use default values when both query param and preference are undefined', () => {
    const mockGetEventTypesPreference = jest.fn(() => null);

    const useHistoryEventTypesPreferenceSpy = jest
      .spyOn(useHistoryEventTypesPreferenceModule, 'default')
      .mockReturnValue({
        getValue: mockGetEventTypesPreference,
        setValue: jest.fn(),
        clearValue: jest.fn(),
      });

    setup({
      overrides: {
        historyEventTypes: undefined, // No query param
      },
    });

    // Should use default values when both are undefined
    // The component should show all options as selected (default behavior)
    const selectedValues = screen.getByRole('combobox').textContent;
    // Default should include all event types
    expect(selectedValues).toContain('Activity');
    expect(selectedValues).toContain('Decision');
    expect(selectedValues).toContain('Timer');
    expect(selectedValues).toContain('Signal');

    useHistoryEventTypesPreferenceSpy.mockRestore();
  });

  it('should save preference when user changes selection', () => {
    const mockGetEventTypesPreference = jest.fn(
      () => ['ACTIVITY', 'DECISION'] as WorkflowHistoryEventFilteringType[]
    );
    const mockSetEventTypesPreference = jest.fn();

    const useHistoryEventTypesPreferenceSpy = jest
      .spyOn(useHistoryEventTypesPreferenceModule, 'default')
      .mockReturnValue({
        getValue: mockGetEventTypesPreference,
        setValue: mockSetEventTypesPreference,
        clearValue: jest.fn(),
      });

    const { mockSetValue } = setup({
      overrides: {
        historyEventTypes: ['TIMER'], // Query param value
      },
    });

    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });

    const activityOption = screen.getByText('Activity');
    act(() => {
      fireEvent.click(activityOption);
    });

    // Should call setValue with new query param value
    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventTypes: ['TIMER', 'ACTIVITY'],
    });

    // Should also save to preference
    expect(mockSetEventTypesPreference).toHaveBeenCalledWith([
      'TIMER',
      'ACTIVITY',
    ]);

    useHistoryEventTypesPreferenceSpy.mockRestore();
  });
});

function setup({ overrides }: { overrides?: WorkflowHistoryFiltersTypeValue }) {
  const mockSetValue = jest.fn();
  render(
    <WorkflowHistoryFiltersType
      value={{
        historyEventTypes: undefined,
        ...overrides,
      }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
