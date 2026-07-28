import {
  formatChartSeriesMomentLabel,
  formatChartSeriesRunGroupLabel,
} from '../format-chart-series-marker-label';

describe(formatChartSeriesRunGroupLabel.name, () => {
  it('describes a single run by status and id', () => {
    expect(
      formatChartSeriesRunGroupLabel([
        { runId: 'run-1', scheduledTimeMs: 0, status: 'completed' },
      ])
    ).toBe('Completed schedule run run-1');
  });

  it('describes a group by count and scheduled time', () => {
    const scheduledTimeMs = Date.UTC(2024, 0, 1);

    expect(
      formatChartSeriesRunGroupLabel([
        { runId: 'run-1', scheduledTimeMs, status: 'completed' },
        { runId: 'run-2', scheduledTimeMs, status: 'failed' },
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

  it('labels the next execution', () => {
    const scheduledTimeMs = Date.UTC(2024, 0, 1);

    expect(formatChartSeriesMomentLabel('next', scheduledTimeMs)).toBe(
      `Next run at ${new Date(scheduledTimeMs).toISOString()}`
    );
  });
});
