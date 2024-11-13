import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import * as usePageQueryParamsModule from '@/hooks/use-page-query-params/use-page-query-params';
import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import {
  mockQueryParamsValues,
  mockPageQueryParamConfig,
  mockFiltersConfig,
} from '../__fixtures__/page-filters.fixtures';
import PageFilters from '../page-filters';
import { type Props as PageFiltersToggleProps } from '../page-filters-toggle/page-filters-toggle.types';

const mockSetQueryParams = jest.fn();
jest.mock('../../../hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockQueryParamsValues, mockSetQueryParams])
);

jest.mock('../page-filters-fields/page-filters-fields', () =>
  jest.fn(() => <div data-testid="filter-fields">Filter Fields</div>)
);

jest.mock('../page-filters-toggle/page-filters-toggle', () =>
  jest.fn((props: PageFiltersToggleProps) => (
    <button onClick={props.onClick}>Filters Button</button>
  ))
);

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

  it('should prune quotes and spaces from input text if no regexp is passed', async () => {
    setup({});

    const searchInput = await screen.findByRole('textbox');

    act(() => {
      fireEvent.change(searchInput, { target: { value: ` "test-search'` } });
    });

    expect(mockSetQueryParams).toHaveBeenCalledWith({ search: 'test-search' });
  });

  it('should prune symbols from input text if regexp is passed', async () => {
    setup({ searchTrimRegExp: /[-]/g });

    const searchInput = await screen.findByRole('textbox');

    act(() => {
      fireEvent.change(searchInput, { target: { value: 'test-search' } });
    });

    expect(mockSetQueryParams).toHaveBeenCalledWith({ search: 'testsearch' });
  });

  it('should show filters when Filters button is clicked, and modify additional filters', async () => {
    setup({});

    const filtersButton = await screen.findByRole('button', {
      name: 'Filters Button',
    });

    act(() => {
      fireEvent.click(filtersButton);
    });

    expect(screen.getByTestId('filter-fields')).toBeInTheDocument();
  });
});

function setup({
  valuesOverrides,
  searchTrimRegExp,
}: {
  valuesOverrides?: Partial<
    PageQueryParamValues<typeof mockPageQueryParamConfig>
  >;
  searchTrimRegExp?: RegExp;
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
      pageFiltersConfig={mockFiltersConfig}
      pageQueryParamsConfig={mockPageQueryParamConfig}
      {...(searchTrimRegExp ? { searchTrimRegExp } : {})}
    />
  );
}
