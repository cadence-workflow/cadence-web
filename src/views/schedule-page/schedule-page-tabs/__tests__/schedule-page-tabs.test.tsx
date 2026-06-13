import React from 'react';

import { act, fireEvent, render, screen } from '@/test-utils/rtl';

import { mockSchedulePageTabsConfig } from '../../__fixtures__/schedule-page-tabs-config';
import SchedulePageTabs from '../schedule-page-tabs';

const mockPushFn = jest.fn();

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockPushFn,
    back: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  }),
  useParams: () => ({
    domain: 'test-domain',
    cluster: 'test-cluster',
    scheduleId: 'my-schedule',
    scheduleTab: 'details',
  }),
}));

jest.mock(
  '../../config/schedule-page-tabs.config',
  () => mockSchedulePageTabsConfig
);

describe(SchedulePageTabs.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tab titles from mocked config', () => {
    setup();

    expect(
      screen.getByText(mockSchedulePageTabsConfig.details.title)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockSchedulePageTabsConfig.runs.title)
    ).toBeInTheDocument();
  });

  it('renders tab artworks from mocked config', () => {
    setup();

    expect(screen.getByTestId('details-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('runs-artwork')).toBeInTheDocument();
  });

  it('navigates with router.push when the details tab is clicked', () => {
    setup();

    act(() => {
      fireEvent.click(
        screen.getByText(mockSchedulePageTabsConfig.details.title)
      );
    });

    expect(mockPushFn).toHaveBeenCalledWith('details');
  });

  it('navigates with router.push when the runs tab is clicked', () => {
    setup();

    act(() => {
      fireEvent.click(screen.getByText(mockSchedulePageTabsConfig.runs.title));
    });

    expect(mockPushFn).toHaveBeenCalledWith('runs');
  });

  it('renders back link to domain schedules list', () => {
    setup();

    const link = screen.getByRole('link', { name: 'Back to schedules' });
    expect(link).toHaveAttribute(
      'href',
      '/domains/test-domain/test-cluster/schedules'
    );
  });
});

function setup() {
  render(<SchedulePageTabs />);
}
