import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainSchedulesHeader from '../domain-schedules-header';

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

describe(DomainSchedulesHeader.name, () => {
  it('renders the title without count when count is undefined', () => {
    render(
      <DomainSchedulesHeader
        count={undefined}
        onCreateScheduleClick={jest.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Schedules' })
    ).toBeInTheDocument();
  });

  it('renders the title with count when count is provided', () => {
    render(
      <DomainSchedulesHeader count={5} onCreateScheduleClick={jest.fn()} />
    );

    expect(
      screen.getByRole('heading', { name: 'Schedules (5)' })
    ).toBeInTheDocument();
  });

  it('renders zero count', () => {
    render(
      <DomainSchedulesHeader count={0} onCreateScheduleClick={jest.fn()} />
    );

    expect(
      screen.getByRole('heading', { name: 'Schedules (0)' })
    ).toBeInTheDocument();
  });

  it('renders the page filters search input', () => {
    render(
      <DomainSchedulesHeader count={0} onCreateScheduleClick={jest.fn()} />
    );

    expect(
      screen.getByPlaceholderText('Find schedule by ID or workflow type')
    ).toBeInTheDocument();
  });

  it('calls onCreateScheduleClick when Create schedule is pressed', async () => {
    const onCreateScheduleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <DomainSchedulesHeader
        count={0}
        onCreateScheduleClick={onCreateScheduleClick}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    expect(onCreateScheduleClick).toHaveBeenCalledTimes(1);
  });
});
