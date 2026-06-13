import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type SchedulePageTabsParams } from '../../schedule-page-tabs/schedule-page-tabs.types';
import SchedulePageTabContent from '../schedule-page-tab-content';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe(SchedulePageTabContent.name, () => {
  it('renders placeholder for details tab', () => {
    setup({ scheduleTab: 'details' });
    expect(screen.getByText(/Schedule details/i)).toBeInTheDocument();
  });

  it('renders placeholder for runs tab', () => {
    setup({ scheduleTab: 'runs' });
    expect(screen.getByText(/Runs/i)).toBeInTheDocument();
  });

  it('calls notFound for unknown tab slug', () => {
    const { notFound } = jest.requireMock('next/navigation');
    expect(() =>
      setup({
        scheduleTab: 'unknown-tab' as SchedulePageTabsParams['scheduleTab'],
      })
    ).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});

function setup({
  scheduleTab = 'details',
}: {
  scheduleTab?: SchedulePageTabsParams['scheduleTab'];
} = {}) {
  render(
    <SchedulePageTabContent
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'my-schedule',
        scheduleTab,
      }}
    />
  );
}
