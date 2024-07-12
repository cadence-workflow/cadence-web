import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { mockDomainPageQueryParamsValues } from '../../__fixtures__/domain-page-query-params';
import { type DomainPageWorkflowFiltersStatusValue } from '../domain-page-workflow-filters-status-types';
import DomainPageWorkflowsFiltersStatus from '../domain-page-workflows-filters-status';

describe('DomainPageWorkflowsFiltersStatus', () => {
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
    Object.entries(WORKFLOW_STATUS_NAMES).forEach(([_, value]) =>
      expect(screen.getByText(value)).toBeInTheDocument()
    );
  });

  it('calls the setQueryParams function when an option is selected', () => {
    const { mockSetValue } = setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    const runningOption = screen.getByText('Running');
    act(() => {
      fireEvent.click(runningOption);
    });
    expect(mockSetValue).toHaveBeenCalledWith({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    });
  });

  it('calls the setQueryParams function when the filter is cleared', () => {
    const { mockSetValue } = setup({
      overrides: {
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
      },
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetValue).toHaveBeenCalledWith({ status: undefined });
  });
});

function setup({
  overrides,
}: {
  overrides?: DomainPageWorkflowFiltersStatusValue;
}) {
  const mockSetValue = jest.fn();
  render(
    <DomainPageWorkflowsFiltersStatus
      value={{
        status: mockDomainPageQueryParamsValues.status,
        ...overrides,
      }}
      setValue={mockSetValue}
    />
  );

  return { mockSetValue };
}
