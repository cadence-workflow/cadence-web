import resolveInitialMetricsChartViewDomain, {
  getReadableExpectedRunCount,
} from '../helpers/resolve-initial-metrics-chart-view-domain';
import {
  CHART_FUTURE_GUTTER_MS,
  CHART_INITIAL_EXPECTED_RUN_COUNT,
  CHART_NOW_ANCHOR_RATIO,
} from '../schedule-detail-metrics-chart.constants';

const WIDE_CHART_WIDTH_PX = 1200;
const NARROW_CHART_WIDTH_PX = 320;
const HOUR_MS = 60 * 60_000;

describe(resolveInitialMetricsChartViewDomain.name, () => {
  it('caps the initial item count on very wide charts', () => {
    expect(getReadableExpectedRunCount(2000)).toBe(
      CHART_INITIAL_EXPECTED_RUN_COUNT
    );
  });

  it('keeps a distant next execution while anchoring now consistently', () => {
    const nowMs = 1_000;
    const nextExecutionMs = nowMs + 12 * HOUR_MS;

    const domain = resolveInitialMetricsChartViewDomain({
      nowMs,
      chartWidthPx: WIDE_CHART_WIDTH_PX,
      nextExecutionMs,
      timestampsMs: [nowMs - 60_000],
    });

    expect(domain.maxMs).toBe(nextExecutionMs + CHART_FUTURE_GUTTER_MS);
    expectNowAnchor(domain, nowMs);
  });

  it('uses expected occurrences and cadence-derived future space', () => {
    const nowMs = 20 * HOUR_MS;
    const nextExecutionMs = nowMs + HOUR_MS;
    const expectedTimesMs = getExpectedTimesMs(20);

    const domain = resolveInitialMetricsChartViewDomain({
      nowMs,
      chartWidthPx: WIDE_CHART_WIDTH_PX,
      nextExecutionMs,
      expectedTimesMs,
      futureGutterMs: HOUR_MS,
    });

    expect(domain.minMs).toBe(expectedTimesMs[0]);
    expect(domain.maxMs).toBeGreaterThanOrEqual(nextExecutionMs + HOUR_MS);
    expectNowAnchor(domain, nowMs);
  });

  it('shows fewer expected occurrences when the chart is narrow', () => {
    const nowMs = 20 * HOUR_MS;
    const expectedTimesMs = getExpectedTimesMs(20);

    const narrowDomain = resolveInitialMetricsChartViewDomain({
      nowMs,
      chartWidthPx: NARROW_CHART_WIDTH_PX,
      expectedTimesMs,
    });
    const wideDomain = resolveInitialMetricsChartViewDomain({
      nowMs,
      chartWidthPx: WIDE_CHART_WIDTH_PX,
      expectedTimesMs,
    });

    // (320 - 2 * 24) / 48 = 5 readable slots out of the latest 20 occurrences.
    expect(narrowDomain.minMs).toBe(expectedTimesMs[15]);
    expect(wideDomain.minMs).toBe(expectedTimesMs[0]);
    expectNowAnchor(narrowDomain, nowMs);
  });

  it('limits visible rendered items to the count that fits the chart', () => {
    const nowMs = 20 * HOUR_MS;
    const timestampsMs = getExpectedTimesMs(20);

    const domain = resolveInitialMetricsChartViewDomain({
      nowMs,
      chartWidthPx: NARROW_CHART_WIDTH_PX,
      timestampsMs,
      expectedTimesMs: getExpectedTimesMs(20),
    });

    expect(domain.minMs).toBe(timestampsMs[15]);
    expectNowAnchor(domain, nowMs);
  });

  it('does not widen the expected window for older loaded runs', () => {
    const nowMs = 20 * HOUR_MS;
    const expectedTimesMs = getExpectedTimesMs(20);

    const domain = resolveInitialMetricsChartViewDomain({
      nowMs,
      chartWidthPx: NARROW_CHART_WIDTH_PX,
      timestampsMs: [HOUR_MS],
      expectedTimesMs,
    });

    expect(domain.minMs).toBe(expectedTimesMs[15]);
    expectNowAnchor(domain, nowMs);
  });

  it('uses loaded runs when no expected occurrences resolve', () => {
    const nowMs = 20 * HOUR_MS;
    const oldestRunMs = nowMs - 3 * HOUR_MS;

    const domain = resolveInitialMetricsChartViewDomain({
      nowMs,
      chartWidthPx: WIDE_CHART_WIDTH_PX,
      expectedTimesMs: [],
      timestampsMs: [oldestRunMs, nowMs - HOUR_MS],
    });

    expect(domain.minMs).toBe(oldestRunMs);
    expectNowAnchor(domain, nowMs);
  });
});

function getExpectedTimesMs(count: number) {
  return Array.from({ length: count }, (_, index) => (index + 1) * HOUR_MS);
}

function expectNowAnchor(
  domain: { minMs: number; maxMs: number },
  nowMs: number
) {
  expect((nowMs - domain.minMs) / (domain.maxMs - domain.minMs)).toBeCloseTo(
    CHART_NOW_ANCHOR_RATIO
  );
}
