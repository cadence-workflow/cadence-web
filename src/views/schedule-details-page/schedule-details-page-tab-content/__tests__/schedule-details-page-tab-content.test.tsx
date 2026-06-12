import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type ScheduleDetailsPageTabsParams } from '../../schedule-details-page-tabs/schedule-details-page-tabs.types';
import ScheduleDetailsPageTabContent from '../schedule-details-page-tab-content';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe(ScheduleDetailsPageTabContent.name, () => {
  it('renders placeholder for details tab', () => {
    setup({ scheduleTab: 'details' });
    expect(screen.getByText(/Details/i)).toBeInTheDocument();
  });

  it('renders placeholder for runs tab', () => {
    setup({ scheduleTab: 'runs' });
    expect(screen.getByText(/Runs/i)).toBeInTheDocument();
  });

  it('calls notFound for unknown tab slug', () => {
    const { notFound } = jest.requireMock('next/navigation');
    expect(() =>
      setup({
        scheduleTab:
          'unknown-tab' as ScheduleDetailsPageTabsParams['scheduleTab'],
      })
    ).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});

function setup({
  scheduleTab = 'details',
}: {
  scheduleTab?: ScheduleDetailsPageTabsParams['scheduleTab'];
} = {}) {
  render(
    <ScheduleDetailsPageTabContent
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'my-schedule',
        scheduleTab,
      }}
    />
  );
}
