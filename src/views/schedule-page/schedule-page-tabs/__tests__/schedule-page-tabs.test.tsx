import React from 'react';

import { act, fireEvent, render, screen } from '@/test-utils/rtl';

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

describe(SchedulePageTabs.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders both tab titles', () => {
    setup();

    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Runs')).toBeInTheDocument();
  });

  it('navigates with router.push when a tab is clicked', () => {
    setup();

    act(() => {
      fireEvent.click(screen.getByText('Details'));
    });

    expect(mockPushFn).toHaveBeenCalledWith('details');
  });

  it('navigates to runs tab when clicked', () => {
    setup();

    act(() => {
      fireEvent.click(screen.getByText('Runs'));
    });

    expect(mockPushFn).toHaveBeenCalledWith('runs');
  });
});

function setup() {
  render(<SchedulePageTabs />);
}
