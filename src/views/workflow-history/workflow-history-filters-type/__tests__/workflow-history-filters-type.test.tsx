import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryFiltersType from '../workflow-history-filters-type';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP } from '../workflow-history-filters-type.constants';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-type.types';

// Mock the MultiSelectFilter component
jest.mock('@/components/multi-select-filter/multi-select-filter', () => {
  return jest.fn(({ label, values, onChangeValues, optionsLabelMap }) => (
    <div data-testid="multi-select-filter">
      <label>{label}</label>
      <div data-testid="values">{JSON.stringify(values)}</div>
      <div data-testid="options">{JSON.stringify(optionsLabelMap)}</div>
      <button onClick={() => onChangeValues(['DECISION'])}>
        Select Option
      </button>
      <button onClick={() => onChangeValues([])}>Clear</button>
    </div>
  ));
});

describe('WorkflowHistoryFiltersType', () => {
  it('renders without errors', () => {
    setup({});
    expect(screen.getByTestId('multi-select-filter')).toBeInTheDocument();
  });

  it('passes correct props to MultiSelectFilter', () => {
    setup({
      overrides: {
        historyEventTypes: ['ACTIVITY'],
      },
    });

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByTestId('values')).toHaveTextContent('["ACTIVITY"]');
    expect(screen.getByTestId('options')).toHaveTextContent(
      JSON.stringify(WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP)
    );
  });

  it('calls setValue when onChangeValues is triggered', () => {
    const { mockSetValue } = setup({});

    screen.getByText('Select Option').click();
    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventTypes: ['DECISION'],
    });
  });

  it('calls setValue with undefined when clearing values', () => {
    const { mockSetValue } = setup({});

    screen.getByText('Clear').click();
    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventTypes: undefined,
    });
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
