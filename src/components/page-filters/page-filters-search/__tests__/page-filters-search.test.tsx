import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import {
  mockPageQueryParamConfig,
  mockQueryParamsValues,
} from '../../__fixtures__/page-filters.fixtures';
import PageFiltersSearch from '../page-filters-search';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockQueryParamsValues, mockSetQueryParams])
);

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe(PageFiltersSearch.name, () => {
  it('should render search bar correctly and call setSearch on input change', async () => {
    const { user } = setup({});

    const searchInput = await screen.findByRole('textbox');

    await user.type(searchInput, 'test-search');

    expect(mockSetQueryParams).toHaveBeenCalledWith({ search: 'test-search' });
  });

  it('should prune quotes and spaces from input text if no regexp is passed', async () => {
    const { user } = setup({});

    const searchInput = await screen.findByRole('textbox');

    await user.type(searchInput, ` "test-search'`);

    expect(mockSetQueryParams).toHaveBeenCalledWith({ search: 'test-search' });
  });

  it('should prune symbols from input text if regexp is passed', async () => {
    const { user } = setup({ searchTrimRegExp: /[-]/g });

    const searchInput = await screen.findByRole('textbox');

    await user.type(searchInput, 'test-search');

    expect(mockSetQueryParams).toHaveBeenCalledWith({ search: 'testsearch' });
  });

  it('should debounce setSearch if a debounce duration is passed', async () => {
    const { user } = setup({ inputDebounceDurationMs: 400 });

    const searchInput = await screen.findByRole('textbox');

    await user.type(searchInput, 'test-');
    jest.advanceTimersByTime(200);

    await user.type(searchInput, 'search');
    jest.advanceTimersByTime(500);

    expect(mockSetQueryParams).toHaveBeenCalledTimes(1);
    expect(mockSetQueryParams).toHaveBeenCalledWith({
      search: 'test-search',
    });
  });
});

function setup({
  searchTrimRegExp,
  inputDebounceDurationMs,
}: {
  searchTrimRegExp?: RegExp;
  inputDebounceDurationMs?: number;
}) {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const renderResult = render(
    <PageFiltersSearch
      searchQueryParamKey="search"
      searchPlaceholder="placeholder"
      pageQueryParamsConfig={mockPageQueryParamConfig}
      {...(searchTrimRegExp ? { searchTrimRegExp } : {})}
      {...(inputDebounceDurationMs ? { inputDebounceDurationMs } : {})}
    />
  );

  return { user, ...renderResult };
}
