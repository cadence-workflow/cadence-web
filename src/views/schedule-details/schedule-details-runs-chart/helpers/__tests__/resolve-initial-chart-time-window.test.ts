import {
  CHART_EXPECTED_RUN_SLOT_PX,
  CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX,
  CHART_NOW_ANCHOR_RATIO,
} from '../../schedule-details-runs-chart.constants';
import resolveInitialChartTimeWindow from '../resolve-initial-chart-time-window';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();
const hourMs = 60 * 60_000;
const chartWidthPx = 800;

describe(resolveInitialChartTimeWindow.name, () => {
  it('sizes initial zoom so markers stay proportionally spaced when zoomed out', () => {
    const { window, maxSpanMs } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
    });
    const initialSpanMs = window.maxMs - window.minMs;

    expect(maxSpanMs).toBeGreaterThan(initialSpanMs);
    expect(maxSpanMs / initialSpanMs).toBeCloseTo(
      CHART_EXPECTED_RUN_SLOT_PX / CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX,
      5
    );
  });

  it('does not expand the initial span to a far-future next execution', () => {
    const { window: windowWithoutNextRun } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
    });
    const { window: windowWithFarNextRun } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
      nextExecutionMs: mockNowMs + 24 * hourMs,
    });

    expect(windowWithFarNextRun.maxMs - windowWithFarNextRun.minMs).toBeCloseTo(
      windowWithoutNextRun.maxMs - windowWithoutNextRun.minMs,
      -2
    );
  });

  it('anchors now toward the right edge of the initial window', () => {
    const { window } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
    });
    const spanMs = window.maxMs - window.minMs;

    expect((mockNowMs - window.minMs) / spanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );
  });

  it('includes recent cron slots in the initial window', () => {
    const oldestExpectedRunMs = mockNowMs - 10 * hourMs;

    const { window } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
    });

    expect(window.minMs).toBeLessThanOrEqual(oldestExpectedRunMs);
  });
});
