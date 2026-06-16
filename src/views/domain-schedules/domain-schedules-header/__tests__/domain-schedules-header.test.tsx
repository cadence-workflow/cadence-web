import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainSchedulesHeader from '../domain-schedules-header';
import { type Props } from '../domain-schedules-header.types';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

describe(DomainSchedulesHeader.name, () => {
  it('renders the title without count when count is undefined', () => {
    setup({ count: undefined });

    expect(
      screen.getByRole('heading', { name: 'Schedules' })
    ).toBeInTheDocument();
  });

  it('renders the title with count when count is provided', () => {
    setup({ count: 5 });

    expect(
      screen.getByRole('heading', { name: 'Schedules (5)' })
    ).toBeInTheDocument();
  });

  it('renders zero count', () => {
    setup({ count: 0 });

    expect(
      screen.getByRole('heading', { name: 'Schedules (0)' })
    ).toBeInTheDocument();
  });

  it('renders the page filters search input', () => {
    setup({ count: 0 });

    expect(
      screen.getByPlaceholderText('Find schedule by ID or workflow type')
    ).toBeInTheDocument();
  });

  it('calls onCreateScheduleClick when Create schedule is pressed', async () => {
    const { user, mockedOnCreateScheduleClick } = setup({ count: 0 });

    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    expect(mockedOnCreateScheduleClick).toHaveBeenCalledTimes(1);
  });
});

function setup(props: Partial<Pick<Props, 'count'>> = {}) {
  const mockedOnCreateScheduleClick = jest.fn();
  const user = userEvent.setup();
  render(
    <DomainSchedulesHeader
      onCreateScheduleClick={mockedOnCreateScheduleClick}
      count={props.count}
    />
  );
  return { user, mockedOnCreateScheduleClick };
}
