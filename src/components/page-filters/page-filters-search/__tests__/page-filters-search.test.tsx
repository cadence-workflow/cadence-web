import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import {
  mockPageQueryParamConfig,
  mockQueryParamsValues,
} from '../../__fixtures__/page-filters.fixtures';
import PageFiltersSearch from '../page-filters-search';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockQueryParamsValues, mockSetQueryParams])
);

afterEach(() => {
  jest.clearAllMocks();
});

describe(PageFiltersSearch.name, () => {
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
});

function setup({ searchTrimRegExp }: { searchTrimRegExp?: RegExp }) {
  render(
    <PageFiltersSearch
      searchQueryParamKey="search"
      searchPlaceholder="placeholder"
      pageQueryParamsConfig={mockPageQueryParamConfig}
      {...(searchTrimRegExp ? { searchTrimRegExp } : {})}
    />
  );
}
