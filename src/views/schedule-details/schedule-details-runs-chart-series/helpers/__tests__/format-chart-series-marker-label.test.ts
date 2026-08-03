import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import {
  formatChartSeriesMomentLabel,
  formatChartSeriesRunGroupLabel,
} from '../format-chart-series-marker-label';

describe(formatChartSeriesRunGroupLabel.name, () => {
  it('describes a single run by status and scheduled time', () => {
    const scheduledTimeMs = Date.UTC(2024, 0, 1);

    expect(
      formatChartSeriesRunGroupLabel([
        {
          runId: 'run-1',
          scheduledTimeMs,
          status: WORKFLOW_STATUSES.completed,
        },
      ])
    ).toBe(
      `Completed schedule run at ${new Date(scheduledTimeMs).toISOString()}`
    );
  });

  it('describes a group by count and scheduled time', () => {
    const scheduledTimeMs = Date.UTC(2024, 0, 1);

    expect(
      formatChartSeriesRunGroupLabel([
        {
          runId: 'run-1',
          scheduledTimeMs,
          status: WORKFLOW_STATUSES.completed,
        },
        {
          runId: 'run-2',
          scheduledTimeMs,
          status: WORKFLOW_STATUSES.failed,
        },
      ])
    ).toBe(`2 schedule runs at ${new Date(scheduledTimeMs).toISOString()}`);
  });
});

describe(formatChartSeriesMomentLabel.name, () => {
  it('labels a skipped execution', () => {
    const scheduledTimeMs = Date.UTC(2024, 0, 1);

    expect(formatChartSeriesMomentLabel('skipped', scheduledTimeMs)).toBe(
      `Skipped run at ${new Date(scheduledTimeMs).toISOString()}`
    );
  });

  it('labels an unconfirmed (not yet loaded) execution', () => {
    const scheduledTimeMs = Date.UTC(2024, 0, 1);

    expect(formatChartSeriesMomentLabel('loading', scheduledTimeMs)).toBe(
      `Loading run at ${new Date(scheduledTimeMs).toISOString()}`
    );
  });

  it('labels the next execution', () => {
    const scheduledTimeMs = Date.UTC(2024, 0, 1);

    expect(formatChartSeriesMomentLabel('next', scheduledTimeMs)).toBe(
      `Next run at ${new Date(scheduledTimeMs).toISOString()}`
    );
  });
});
