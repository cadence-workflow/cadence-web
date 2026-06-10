import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type ScheduleDetailPageParams } from '../../schedule-detail-page/schedule-detail-page.types';
import ScheduleDetailPageTabContent from '../schedule-detail-page-tab-content';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe(ScheduleDetailPageTabContent.name, () => {
  it('renders placeholder for overview tab', () => {
    setup({ scheduleTab: 'overview' });
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
  });

  it('renders placeholder for backfills tab', () => {
    setup({ scheduleTab: 'backfills' });
    expect(screen.getByText(/Backfills/i)).toBeInTheDocument();
  });

  it('renders placeholder for input tab', () => {
    setup({ scheduleTab: 'input' });
    expect(screen.getByText(/Input/i)).toBeInTheDocument();
  });

  it('renders placeholder for runs tab', () => {
    setup({ scheduleTab: 'runs' });
    expect(screen.getByText(/Runs/i)).toBeInTheDocument();
  });

  it('calls notFound for unknown tab slug', () => {
    const { notFound } = jest.requireMock('next/navigation');
    expect(() =>
      setup({
        scheduleTab: 'unknown-tab' as ScheduleDetailPageParams['scheduleTab'],
      })
    ).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});

function setup({
  scheduleTab = 'overview',
}: {
  scheduleTab?: ScheduleDetailPageParams['scheduleTab'];
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
