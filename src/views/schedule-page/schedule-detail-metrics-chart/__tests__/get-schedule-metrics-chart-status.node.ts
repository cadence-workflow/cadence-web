import { type Theme } from 'baseui';

import {
  getScheduleMetricsChartStatus,
  getScheduleMetricsChartStatusColor,
} from '../helpers/get-schedule-metrics-chart-status';
import {
  type ScheduleMetricsChartRun,
  type ScheduleMetricsChartStatusVariant,
} from '../schedule-detail-metrics-chart-series.types';

const theme = {
  colors: {
    positive400: 'completed-green',
    negative400: 'failed-red',
    accent400: 'running-blue',
    warning400: 'cancelled-yellow',
    contentSecondary: 'neutral-gray',
  },
} as unknown as Theme;

describe(getScheduleMetricsChartStatus.name, () => {
  it.each([
    ['WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED', 'completed'],
    ['WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW', 'completed'],
    ['WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT', 'failed'],
    ['WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED', 'failed'],
    ['WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED', 'failed'],
    ['WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID', 'running'],
    ['WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED', 'canceled'],
  ] as const)('maps %s to %s', (status, expected) => {
    expect(
      getScheduleMetricsChartStatus({ status } as ScheduleMetricsChartRun)
    ).toBe(expected);
  });

  it.each([
    ['completed', 'completed-green'],
    ['failed', 'failed-red'],
    ['running', 'running-blue'],
    ['canceled', 'cancelled-yellow'],
    ['backfill', 'neutral-gray'],
    ['skipped', 'neutral-gray'],
    ['next', 'neutral-gray'],
  ] as Array<[ScheduleMetricsChartStatusVariant, string]>)(
    'uses the Figma color channel for %s',
    (variant, expected) => {
      expect(getScheduleMetricsChartStatusColor(theme, variant)).toBe(expected);
    }
  );
});
