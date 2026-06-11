import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type ScheduleDetailPageTabsParams } from '../../schedule-detail-page-tabs/schedule-detail-page-tabs.types';
import ScheduleDetailPageTabContent from '../schedule-detail-page-tab-content';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe(ScheduleDetailPageTabContent.name, () => {
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
          'unknown-tab' as ScheduleDetailPageTabsParams['scheduleTab'],
      })
    ).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});

function setup({
  scheduleTab = 'details',
}: {
  scheduleTab?: ScheduleDetailPageTabsParams['scheduleTab'];
} = {}) {
  render(
    <ScheduleDetailPageTabContent
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'my-schedule',
        scheduleTab,
      }}
    />
  );
}
