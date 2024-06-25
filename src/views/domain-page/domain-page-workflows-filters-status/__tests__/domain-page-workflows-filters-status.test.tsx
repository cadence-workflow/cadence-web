import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { mockDomainPageQueryParamsValues } from '../../__fixtures__/domain-page-query-params';
import type domainPageQueryParamsConfig from '../../config/domain-page-query-params.config';
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
    const { mockSetQueryParams } = setup({});
    const selectFilter = screen.getByRole('combobox');
    act(() => {
      fireEvent.click(selectFilter);
    });
    const runningOption = screen.getByText('Running');
    act(() => {
      fireEvent.click(runningOption);
    });
    expect(mockSetQueryParams).toHaveBeenCalledWith({
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    });
  });

  it('calls the setQueryParams function when the filter is cleared', () => {
    const { mockSetQueryParams } = setup({
      queryParamsOverrides: {
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
      },
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });
    expect(mockSetQueryParams).toHaveBeenCalledWith({ status: undefined });
  });
});

function setup({
  queryParamsOverrides,
}: {
  queryParamsOverrides?: Partial<
    PageQueryParamValues<typeof domainPageQueryParamsConfig>
  >;
}) {
  const mockSetQueryParams = jest.fn();
  render(
    <DomainPageWorkflowsFiltersStatus
      queryParams={{
        ...mockDomainPageQueryParamsValues,
        ...queryParamsOverrides,
      }}
      setQueryParams={mockSetQueryParams}
    />
  );

  return { mockSetQueryParams };
}
