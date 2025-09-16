import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryFiltersStatus from '../workflow-history-filters-status';
import { HISTORY_EVENT_FILTER_STATUS_LABELS_MAP } from '../workflow-history-filters-status.constants';
import { type WorkflowHistoryFiltersStatusValue } from '../workflow-history-filters-status.types';

// Mock the MultiSelectFilter component
jest.mock('@/components/multi-select-filter/multi-select-filter', () => {
  return jest.fn(({ label, values, onChangeValues, optionsLabelMap }) => (
    <div data-testid="multi-select-filter">
      <label>{label}</label>
      <div data-testid="values">{JSON.stringify(values)}</div>
      <div data-testid="options">{JSON.stringify(optionsLabelMap)}</div>
      <button onClick={() => onChangeValues(['COMPLETED'])}>
        Select Option
      </button>
      <button onClick={() => onChangeValues([])}>Clear</button>
    </div>
  ));
});

describe('WorkflowHistoryFiltersStatus', () => {
  it('renders without errors', () => {
    setup({});
    expect(screen.getByTestId('multi-select-filter')).toBeInTheDocument();
  });

  it('passes correct props to MultiSelectFilter', () => {
    setup({
      overrides: {
        historyEventStatuses: ['COMPLETED'],
      },
    });

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByTestId('values')).toHaveTextContent('["COMPLETED"]');
    expect(screen.getByTestId('options')).toHaveTextContent(
      JSON.stringify(HISTORY_EVENT_FILTER_STATUS_LABELS_MAP)
    );
  });

  it('calls setValue when onChangeValues is triggered', () => {
    const { mockSetValue } = setup({});

    screen.getByText('Select Option').click();
    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventStatuses: ['COMPLETED'],
    });
  });

  it('calls setValue with undefined when clearing values', () => {
    const { mockSetValue } = setup({});

    screen.getByText('Clear').click();
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
    <WorkflowHistoryFiltersStatus
      value={{
        historyEventStatuses: undefined,
        ...overrides,
      }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
