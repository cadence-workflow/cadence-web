import {
  CHART_EXPECTED_RUN_SLOT_PX,
  CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX,
  CHART_NOW_ANCHOR_RATIO,
} from '../../schedule-details-runs-chart.constants';
import resolveChartSpanFromMarkerIntervalMs from '../resolve-chart-span-from-marker-interval-ms';
import resolveInitialChartTimeWindow, {
  getReadableExpectedRunCount,
} from '../resolve-initial-chart-time-window';

const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();
const hourMs = 60 * 60_000;
const chartWidthPx = 800;

function expectedComfortableSpanMs(intervalMs: number): number {
  return resolveChartSpanFromMarkerIntervalMs({
    intervalMs,
    chartWidthPx,
    pxPerInterval: CHART_EXPECTED_RUN_SLOT_PX,
  });
}

describe(getReadableExpectedRunCount.name, () => {
  it('scales with the available chart width', () => {
    expect(getReadableExpectedRunCount(200)).toBeLessThan(
      getReadableExpectedRunCount(2000)
    );
  });

  it('never returns less than one', () => {
    expect(getReadableExpectedRunCount(0)).toBeGreaterThanOrEqual(1);
  });
});

describe(resolveInitialChartTimeWindow.name, () => {
  it('keeps now visible even with no run or expected data', () => {
    const { window } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
    });

    expect(window.minMs).toBeLessThanOrEqual(mockNowMs);
    expect(window.maxMs).toBeGreaterThanOrEqual(mockNowMs);
  });

  it('sizes initial zoom from the cron cadence with space between glyphs', () => {
    const { window, maxSpanMs } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
    });
    const initialSpanMs = window.maxMs - window.minMs;
    const comfortableSpanMs = expectedComfortableSpanMs(hourMs);

    expect(initialSpanMs).toBeCloseTo(comfortableSpanMs, -2);
    expect(maxSpanMs).toBeGreaterThan(initialSpanMs);
    expect(maxSpanMs / initialSpanMs).toBeCloseTo(
      CHART_EXPECTED_RUN_SLOT_PX / CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX,
      5
    );
  });

  it('does not expand the initial span to a far-future next execution', () => {
    const { window } = resolveInitialChartTimeWindow({
      nowMs: mockNowMs,
      chartWidthPx,
      cronExpression: '0 * * * *',
      nextExecutionMs: mockNowMs + 24 * hourMs,
    });
    const initialSpanMs = window.maxMs - window.minMs;
    const comfortableSpanMs = expectedComfortableSpanMs(hourMs);

    expect(initialSpanMs).toBeCloseTo(comfortableSpanMs, -2);
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
