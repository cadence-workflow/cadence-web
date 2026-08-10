import React from 'react';

import * as navigationModule from 'next/navigation';

import { render, screen } from '@/test-utils/rtl';

import { mockSchedulePageTabsConfig } from '../../__fixtures__/schedule-page-tabs-config';
import SchedulePageTabsError from '../schedule-page-tabs-error';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: jest.fn(() => ({
    domain: 'test-domain',
    cluster: 'test-cluster',
    scheduleId: 'my-schedule',
    scheduleTab: 'details',
  })),
}));

jest.mock(
  '../../config/schedule-page-tabs.config',
  () => mockSchedulePageTabsConfig
);

describe(SchedulePageTabsError.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tab error config when schedule tab exists in config', () => {
    setup();

    expect(screen.getByText('details error')).toBeInTheDocument();
  });

  it('renders generic error when schedule tab is missing from config', () => {
    jest.spyOn(navigationModule, 'useParams').mockReturnValue({
      domain: 'test-domain',
      cluster: 'test-cluster',
      scheduleId: 'my-schedule',
      scheduleTab: 'invalid',
    });
    setup();

    expect(
      screen.getByText('Failed to load schedule content')
    ).toBeInTheDocument();
  });
});

function setup({
  error = new Error('Something went wrong'),
}: {
  error?: Error;
} = {}) {
  render(<SchedulePageTabsError error={error} reset={() => {}} />);
}
