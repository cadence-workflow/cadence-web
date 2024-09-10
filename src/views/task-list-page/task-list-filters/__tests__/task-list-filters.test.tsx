import React from 'react';

import { render } from '@/test-utils/rtl';

import { mockQueryParamsValues } from '@/components/page-filters/__fixtures__/page-filters.fixtures';

import TaskListFilters from '../task-list-filters';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockQueryParamsValues, mockSetQueryParams])
);

describe(TaskListFilters.name, () => {
  it('renders without errors', () => {
    render(<TaskListFilters />);
  });
});
