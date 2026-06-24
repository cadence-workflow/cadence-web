import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import {
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../../schedule-detail-metrics-chart/schedule-detail-metrics-chart.constants';
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

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

jest.mock('../../config/schedule-page-tabs.config', () =>
  jest.requireActual('../../config/schedule-page-tabs.config')
);

describe(`${SchedulePageTabContent.name} runs chart`, () => {
  it('renders chart region and disabled toolbar controls on the runs tab', () => {
    render(
      <SchedulePageTabContent
        params={{
          domain: 'test-domain',
          cluster: 'test-cluster',
          scheduleId: 'my-schedule',
          scheduleTab: 'runs',
        }}
      />
    );

    expect(
      screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
    ).toBeInTheDocument();

    const toolbar = screen.getByRole('toolbar', {
      name: CHART_TOOLBAR_ARIA_LABEL,
    });

    Object.values(CHART_TOOLBAR_BUTTON_LABELS).forEach((label) => {
      const button = within(toolbar).getByRole('button', { name: label });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
