import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import {
  type mockPageQueryParamConfig,
  mockQueryParamsValues,
} from '../../__fixtures__/page-filters.fixtures';
import {
  type PageFilterComponentProps,
  type PageFilterConfig,
} from '../../page-filters.types';
import PageFiltersFields from '../page-filters-fields';

const MockFilterA = ({
  value,
  setValue,
}: PageFilterComponentProps<{ paramA: string }>) => {
  return (
    <div>
      <div>Value 1: {value.paramA}</div>
      <div
        data-testid="change-filters"
        onClick={() => setValue({ paramA: 'valueA2' })}
      />
    </div>
  );
};

const MockFilterB = ({
  value,
  setValue,
}: PageFilterComponentProps<{ paramB: string }>) => {
  return (
    <div>
      <div>Value 2: {value.paramB}</div>
      <div
        data-testid="change-filters"
        onClick={() => setValue({ paramB: 'valueB2' })}
      />
    </div>
  );
};

export const mockFiltersConfig: [
  PageFilterConfig<typeof mockPageQueryParamConfig, { paramA: string }>,
  PageFilterConfig<typeof mockPageQueryParamConfig, { paramB: string }>,
] = [
  {
    id: 'filterA',
    getValue: (v) => ({ paramA: v.paramA }),
    formatValue: (v) => v,
    component: MockFilterA,
  },
  {
    id: 'filterB',
    getValue: (v) => ({ paramB: v.paramB }),
    formatValue: (v) => v,
    component: MockFilterB,
  },
];

describe('PageFiltersFields', () => {
  it('should reset filters when clear filters button is pressed', async () => {
    const { mockedResetAllFilters } = setup({
      valuesOverrides: { paramA: 'valueA2', paramB: 'valueB2' },
    });

    const clearFiltersButton = await screen.findByText('Clear filters');

    act(() => {
      fireEvent.click(clearFiltersButton);
    });

    expect(mockedResetAllFilters).toHaveBeenCalled();
  });

  it('should call setQueryParams when filter setValue is called', async () => {
    const { mockedSetQueryParams } = setup({});

    const filtersButtons = await screen.findAllByTestId('change-filters');
    expect(filtersButtons).toHaveLength(2);

    act(() => {
      fireEvent.click(filtersButtons[0]);
    });

    expect(mockedSetQueryParams).toHaveBeenCalledWith({ paramA: 'valueA2' });
  });
});

function setup({
  valuesOverrides,
}: {
  valuesOverrides?: Partial<
    PageQueryParamValues<typeof mockPageQueryParamConfig>
  >;
}) {
  const mockedResetAllFilters = jest.fn();
  const mockedSetQueryParams = jest.fn();

  render(
    <PageFiltersFields
      pageFiltersConfig={mockFiltersConfig}
      resetAllFilters={mockedResetAllFilters}
      setQueryParams={mockedSetQueryParams}
      queryParams={{ ...mockQueryParamsValues, ...valuesOverrides }}
    />
  );
  return { mockedResetAllFilters, mockedSetQueryParams };
}
