import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import {
  type SchedulePageTabContentProps,
  type SchedulePageTabsParams,
} from '../../schedule-page-tabs/schedule-page-tabs.types';
import SchedulePageTabContent from '../schedule-page-tab-content';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

jest.mock('../../config/schedule-page-tabs.config', () => ({
  details: {
    title: 'Details',
    artwork: () => null,
    content: ({ params }: SchedulePageTabContentProps) => (
      <div>{JSON.stringify(params)}</div>
    ),
    getErrorConfig: () => ({ message: 'details error' }),
  },
  runs: {
    title: 'Runs',
    artwork: () => null,
    content: null,
    getErrorConfig: () => ({ message: 'runs error' }),
  },
}));

describe(SchedulePageTabContent.name, () => {
  it('renders selected tab content with params', () => {
    setup({ scheduleTab: 'details' });
    expect(
      screen.getByText(
        '{"domain":"test-domain","cluster":"test-cluster","scheduleId":"my-schedule","scheduleTab":"details"}'
      )
    ).toBeInTheDocument();
  });

  it('renders empty state for runs tab when content is null', () => {
    setup({ scheduleTab: 'runs' });
    const { notFound } = jest.requireMock('next/navigation');
    expect(screen.queryByText('runs-tab-content')).not.toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
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
