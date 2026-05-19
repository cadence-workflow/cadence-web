import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainSchedulesHeader from '../domain-schedules-header';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

jest.mock('@/components/page-filters/page-filters', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-page-filters" />),
}));

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

  it('renders the page filters slot', () => {
    render(<DomainSchedulesHeader count={0} />);

    expect(screen.getByTestId('mock-page-filters')).toBeInTheDocument();
  });
});
