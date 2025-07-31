import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import { WorkflowHistoryContext } from '../../workflow-history-context-provider/workflow-history-context-provider';
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
    const { mockSetHistoryEventTypesUserPreference } = setup({
      overrides: {
        historyEventTypes: ['TIMER', 'SIGNAL'],
      },
    });

    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Signal')).toBeInTheDocument();
    expect(screen.queryByText('Activity')).toBeNull();
    expect(screen.queryByText('Decision')).toBeNull();

    expect(mockSetHistoryEventTypesUserPreference).not.toHaveBeenCalled();
  });

  it('should use preference when query param is undefined', () => {
    const { mockSetHistoryEventTypesUserPreference } = setup({
      historyEventTypesPreference: ['TIMER', 'SIGNAL'],
    });

    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Signal')).toBeInTheDocument();
    expect(screen.queryByText('Activity')).toBeNull();
    expect(screen.queryByText('Decision')).toBeNull();

    expect(mockSetHistoryEventTypesUserPreference).not.toHaveBeenCalled();
  });

  it('should use default values when both query param and preference are undefined', () => {
    const { mockSetHistoryEventTypesUserPreference } = setup({});

    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Signal')).toBeInTheDocument();
    expect(screen.getByText('Child Workflow')).toBeInTheDocument();
    expect(screen.getByText('Workflow')).toBeInTheDocument();

    expect(screen.queryByText('Decision')).toBeNull();

    expect(mockSetHistoryEventTypesUserPreference).not.toHaveBeenCalled();
  });

  it('should save preference when user changes selection', () => {
    const { mockSetValue, mockSetHistoryEventTypesUserPreference } = setup({
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

    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventTypes: ['TIMER', 'ACTIVITY'],
    });

    expect(mockSetHistoryEventTypesUserPreference).toHaveBeenCalledWith([
      'TIMER',
      'ACTIVITY',
    ]);
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
  const mockSetHistoryEventTypesUserPreference = jest.fn();

  const renderResult = render(
    <WorkflowHistoryContext.Provider
      value={{
        ungroupedViewUserPreference: null,
        setUngroupedViewUserPreference: jest.fn(),
        historyEventTypesUserPreference: historyEventTypesPreference ?? null,
        setHistoryEventTypesUserPreference:
          mockSetHistoryEventTypesUserPreference,
        clearHistoryEventTypesUserPreference: jest.fn(),
      }}
    >
      <WorkflowHistoryFiltersType
        value={{
          historyEventTypes: undefined,
          ...overrides,
        }}
        setValue={mockSetValue}
      />
    </WorkflowHistoryContext.Provider>
  );

  return {
    mockSetValue,
    mockSetHistoryEventTypesUserPreference,
    ...renderResult,
  };
}
