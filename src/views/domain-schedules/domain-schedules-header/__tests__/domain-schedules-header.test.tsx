import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { mockQueryParamsValues } from '@/components/page-filters/__fixtures__/page-filters.fixtures';

import DomainSchedulesHeader from '../domain-schedules-header';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockQueryParamsValues, mockSetQueryParams])
);

describe(DomainSchedulesHeader.name, () => {
  it('renders the title without count when count is undefined', () => {
    render(<DomainSchedulesHeader count={undefined} />);

    expect(
      screen.getByRole('heading', { name: 'Schedules' })
    ).toBeInTheDocument();
  });

  it('renders the title with count when count is provided', () => {
    render(<DomainSchedulesHeader count={5} />);

    expect(
      screen.getByRole('heading', { name: 'Schedules (5)' })
    ).toBeInTheDocument();
  });

  it('renders zero count', () => {
    render(<DomainSchedulesHeader count={0} />);

    expect(
      screen.getByRole('heading', { name: 'Schedules (0)' })
    ).toBeInTheDocument();
  });

  it('renders the page filters search input', () => {
    render(<DomainSchedulesHeader count={0} />);

    expect(
      screen.getByPlaceholderText('Find schedule by ID or workflow type')
    ).toBeInTheDocument();
  });
});
