import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import * as usePageQueryParamsModule from '@/hooks/use-page-query-params/use-page-query-params';
import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import {
  mockQueryParamsValues,
  mockPageQueryParamConfig,
} from '../__fixtures__/page-filters.fixtures';
import PageFilters from '../page-filters';
import {
  type PageFilterComponentProps,
  type PageFilterConfig,
} from '../page-filters.types';

const mockSetQueryParams = jest.fn();
jest.mock('../../../hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockQueryParamsValues, mockSetQueryParams])
);

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

const MOCK_FILTERS_CONFIG: [
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

afterEach(() => {
  jest.clearAllMocks();
});

describe('PageFilters', () => {
  it('should render search bar correctly and call setSearch on input change', async () => {
    setup({});

    const searchInput = await screen.findByRole('textbox');

    act(() => {
      fireEvent.change(searchInput, { target: { value: 'test-search' } });
    });

    expect(mockSetQueryParams).toHaveBeenCalledWith({ search: 'test-search' });
  });

  it('should show filters when Filters button is clicked, and modify additional filters', async () => {
    setup({});

    const filtersButton = await screen.findByText('Filters');

    act(() => {
      fireEvent.click(filtersButton);
    });

    const filtersButtons = await screen.findAllByTestId('change-filters');
    expect(filtersButtons).toHaveLength(2);

    act(() => {
      fireEvent.click(filtersButtons[0]);
    });

    expect(mockSetQueryParams).toHaveBeenCalledWith({ paramA: 'valueA2' });
  });

  it('should reset filters when clear filters button is pressed', async () => {
    setup({
      valuesOverrides: { paramA: 'valueA2', paramB: 'valueB2' },
    });

    const filtersButton = await screen.findByText('Filters (2)');

    act(() => {
      fireEvent.click(filtersButton);
    });

    const clearFiltersButton = await screen.findByText('Clear filters');

    act(() => {
      fireEvent.click(clearFiltersButton);
    });

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      paramA: undefined,
      paramB: undefined,
    });
  });
});

function setup({
  valuesOverrides,
}: {
  valuesOverrides?: Partial<
    PageQueryParamValues<typeof mockPageQueryParamConfig>
  >;
}) {
  if (valuesOverrides) {
    jest
      .spyOn(usePageQueryParamsModule, 'default')
      .mockReturnValue([
        { ...mockQueryParamsValues, ...valuesOverrides },
        mockSetQueryParams,
      ]);
  }

  render(
    <PageFilters
      searchQueryParamKey="search"
      searchPlaceholder="placeholder"
      pageFiltersConfig={MOCK_FILTERS_CONFIG}
      pageQueryParamsConfig={mockPageQueryParamConfig}
    />
  );
}
