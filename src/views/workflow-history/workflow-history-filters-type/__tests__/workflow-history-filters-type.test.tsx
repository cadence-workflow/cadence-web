import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import * as localStorageModule from '@/utils/local-storage';

import workflowHistoryUserPreferencesKeys from '../../config/workflow-history-user-preferences-keys.config';
import WorkflowHistoryFiltersType from '../workflow-history-filters-type';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP } from '../workflow-history-filters-type.constants';
import {
  type WorkflowHistoryFiltersTypeValue,
  type WorkflowHistoryEventFilteringType,
} from '../workflow-history-filters-type.types';

jest.mock('@/utils/local-storage', () => ({
  getLocalStorageValue: jest.fn(),
  setLocalStorageValue: jest.fn(),
  clearLocalStorageValue: jest.fn(),
}));

jest.mock('../helpers/parse-event-filtering-types', () =>
  jest.fn((val) => JSON.parse(val))
);

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
      historyEventTypes: [
        'ACTIVITY',
        'CHILDWORKFLOW',
        'SIGNAL',
        'TIMER',
        'WORKFLOW',
        'DECISION',
      ],
    });
  });

  it('should override preference when query param is set', () => {
    const { mockGetLocalStorageValue } = setup({
      overrides: {
        historyEventTypes: ['TIMER', 'SIGNAL'],
      },
    });

    // The component should use the query param values instead of preferences
    // We can verify this by checking that the selected values are from query params
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Signal')).toBeInTheDocument();
    expect(screen.queryByText('Activity')).toBeNull();
    expect(screen.queryByText('Decision')).toBeNull();

    // Should not call localStorage when query param is set
    expect(mockGetLocalStorageValue).not.toHaveBeenCalled();
  });

  it('should use preference when query param is undefined', () => {
    const { mockGetLocalStorageValue } = setup({
      historyEventTypesPreference: ['TIMER', 'SIGNAL'],
    });

    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Signal')).toBeInTheDocument();
    expect(screen.queryByText('Activity')).toBeNull();
    expect(screen.queryByText('Decision')).toBeNull();

    expect(mockGetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesKeys.HISTORY_EVENT_TYPES
    );
  });

  it('should use default values when both query param and preference are undefined', () => {
    const { mockGetLocalStorageValue } = setup({});

    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Signal')).toBeInTheDocument();
    expect(screen.getByText('Child Workflow')).toBeInTheDocument();
    expect(screen.getByText('Workflow')).toBeInTheDocument();

    expect(screen.queryByText('Decision')).toBeNull();

    expect(mockGetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesKeys.HISTORY_EVENT_TYPES
    );
  });

  it('should save preference when user changes selection', () => {
    const { mockSetValue, mockSetLocalStorageValue } = setup({
      overrides: {
        historyEventTypes: ['TIMER'],
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

    // Should also save to localStorage
    expect(mockSetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesKeys.HISTORY_EVENT_TYPES,
      JSON.stringify(['TIMER', 'ACTIVITY'])
    );
  });
});

function setup({
  overrides,
  historyEventTypesPreference,
}: {
  overrides?: WorkflowHistoryFiltersTypeValue;
  historyEventTypesPreference?:
    | Array<WorkflowHistoryEventFilteringType>
    | undefined;
}) {
  const mockSetValue = jest.fn();

  const mockGetLocalStorageValue = jest.fn(() => {
    return historyEventTypesPreference
      ? JSON.stringify(historyEventTypesPreference)
      : null;
  });
  const mockSetLocalStorageValue = jest.fn();

  jest
    .spyOn(localStorageModule, 'getLocalStorageValue')
    .mockImplementation(mockGetLocalStorageValue);
  jest
    .spyOn(localStorageModule, 'setLocalStorageValue')
    .mockImplementation(mockSetLocalStorageValue);

  const renderResult = render(
    <WorkflowHistoryFiltersType
      value={{
        historyEventTypes: undefined,
        ...overrides,
      }}
      setValue={mockSetValue}
    />
  );

  return {
    mockSetValue,
    mockGetLocalStorageValue,
    mockSetLocalStorageValue,
    ...renderResult,
  };
}
