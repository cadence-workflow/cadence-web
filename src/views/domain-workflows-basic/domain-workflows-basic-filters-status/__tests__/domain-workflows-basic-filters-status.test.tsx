import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainWorkflowsBasicFiltersStatus from '../domain-workflows-basic-filters-status';
import { WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY } from '../domain-workflows-basic-filters-status.constants';
import { type DomainWorkflowsBasicFiltersStatusValue } from '../domain-workflows-basic-filters-status.types';

describe(DomainWorkflowsBasicFiltersStatus.name, () => {
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
    Object.entries(WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY).forEach(
      ([_, value]) => expect(screen.getByText(value)).toBeInTheDocument()
    );
  });

  it('calls the setQueryParams function when an option is selected', () => {
    const { mockSetValue } = setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    const runningOption = screen.getByText('Closed');
    act(() => {
      fireEvent.click(runningOption);
    });
    expect(mockSetValue).toHaveBeenCalledWith({
      statusBasic: 'ALL_CLOSED',
    });
  });

  it('calls the setQueryParams function when the filter is cleared', () => {
    const { mockSetValue } = setup({
      overrides: {
        statusBasic: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
      },
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith({ statusBasic: undefined });
  });
});

function setup({
  overrides,
}: {
  overrides?: DomainWorkflowsBasicFiltersStatusValue;
}) {
  const mockSetValue = jest.fn();
  render(
    <DomainWorkflowsBasicFiltersStatus
      value={{
        statusBasic: mockDomainPageQueryParamsValues.statusBasic,
        ...overrides,
      }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
